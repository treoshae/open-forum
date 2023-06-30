// gossipNetwork.js
import Gun from 'gun/gun';
import 'gun/sea';

let networkInstance = null;

// Function to get the instance of the network
const getNetworkInstance = () => networkInstance ?? (networkInstance = Gun('http://localhost:8765/gun'));


// post functions
// Function to save a message to the network
export const saveMessage = (messageData, callback) => {
  const network = getNetworkInstance();
  const user = network.user();
  user.get('alias').once((alias) => {
    messageData.userId = user.is.pub;
    messageData.alias = alias;
    messageData.timestamp = Date.now(); // Add a timestamp
    network.get('messages').set(messageData, callback);
  });
};

// Function to save a reply to the network
export const saveReply = (parentId, replyData, callback) => {
  const network = getNetworkInstance();
  const user = network.user();
  user.get('alias').once((alias) => {
    replyData.userId = user.is.pub;
    replyData.alias = alias;
    replyData.parentId = parentId;
    replyData.timestamp = Date.now(); // Add a timestamp
    network.get('replies').set(replyData, callback); // save replies separately
  });
};

// Function to get all messages from the network
export const getMessages = (callback) => {
  const network = getNetworkInstance();
  const mapOn = network.get('messages').map().on(async (data, id) => {
    if (data === null) { // The message was moved
      // Get the signed action from the 'removed' node
      const removedData = await new Promise(resolve => {
        network.get('removed').get(id).once(resolve);
      });
      console.log('Removed data:', removedData); // Add this line
      
      if (removedData && removedData.removed) {
        // Get the super user's public key
        const publicKey = await getSuperUserPublicKey();
        console.log('Public key:', publicKey); // Add this line

        // Validate the action
        const isValid = await verifySuperUserAction(removedData.removed, publicKey);
        if (isValid) {
          callback(data, id);
        }
      }
    } else {
      callback(data, id);
    }
  });
  return () => mapOn.off();
};




// Function to get all replies from the network
export const getReplies = (parentId, callback) => {
  const network = getNetworkInstance();
  const mapOn = network.get('replies').map().on((data, id) => { // Get replies separately
    if (data && data.parentId === parentId) {
      callback({ id, ...data });
    }
  });

  // Return a function that can be called to stop listening for new replies
  return () => mapOn.off();
};

// Function to get a specific message from the network
export const getMessage = (id, callback) => {
  const network = getNetworkInstance();
  network.get('messages').get(id).once(callback);
};

// user functions
// Function to get the user from the network
export const getUser = () => {
  const network = getNetworkInstance();
  return network.user();
};

// Function to recall a previously authenticated user
export const recallUser = (callback) => {
  const network = getNetworkInstance();
  const user = network.user();
  user.recall({ sessionStorage: true }, callback);
};

// Function to clear a user session
export const clearUserSession = (callback) => {
  const network = getNetworkInstance();
  const user = network.user();
  user.leave();
};

// document functions
export const saveDocument = (documentData, callback) => {
  console.log('documentData: ', documentData);
  const network = getNetworkInstance();
  const user = network.user();
  user.get('alias').once((alias) => {
    documentData.userId = user.is.pub;
    documentData.alias = alias;
    documentData.timestamp = Date.now(); // Add a timestamp
    documentData.type = 'document'; // Type attribute to distinguish the post
    network.get('documents').set(documentData, callback); // save documents separately
  });
};

// Function to get all documents from the network
export const getDocuments = (callback) => {
  const network = getNetworkInstance();
  const mapOn = network.get('documents').map().on((data, id) => {
    callback(data, id);
  });

  // Return a function that can be called to stop listening for new documents
  return () => mapOn.off();
};


// Function to get a specific document from the network
export const getDocument = (id, callback) => {
  const network = getNetworkInstance();
  network.get('documents').get(id).once(callback);
};


//super user functions

export const setSuperUser = (seaPair) => {
  console.log('seaPair:', seaPair); // Add this line
  const network = getNetworkInstance();
  network.get('superUser').once((superUser) => {
    if (!superUser) {
      console.log('superUser:', superUser);
      console.log('superUser.pub:', superUser?.pub);
      
      console.log(seaPair); // Add this line to debug seaPair
      network.get('superUser').put({ pub: seaPair.pub }, (ack) => { // store only the public key
        if (ack.ok) {
          // Check if the data was set correctly
          network.get('superUser').once((superUser) => {
            console.log('Super User after setting: ', superUser.pub);
          });
        } else {
          console.log('Failed to set Super User: ', ack.err);
        }
      });
    }
  });
};


export const processSuperUser = (seaPair, callback) => {
  const network = getNetworkInstance();
  network.get('superUser').once((superUser) => {
    if (!superUser || !superUser.pair) { // handle undefined superUser
      setSuperUser(seaPair);
      callback(true);
    } else {
      callback(seaPair === superUser.pair);
    }
  });
};

export const signSuperUserAction = async (actionDetails, seaPair) => {
  const signedAction = await Gun.SEA.sign(actionDetails, seaPair);
  console.log('Signed action:', signedAction); // Add this line
  return signedAction;
};


// Function to mark a post as removed
export const removeMessage = async (id, seaPair, callback) => {
  const network = getNetworkInstance();
  const signedAction = await signSuperUserAction({ id, action: 'remove' }, seaPair);

  // Remove from messages and add to removed messages
  network.get('messages').get(id).put(null);
  network.get('removed').get(id).put({ removed: signedAction }, callback);
};

export const removeDocument = async (id, seaPair, callback) => {
  const network = getNetworkInstance();
  const signedAction = await signSuperUserAction({ id, action: 'remove' }, seaPair);

  // Remove from documents and add to removed documents
  network.get('documents').get(id).put(null);
  network.get('removed').get(id).put({ removed: signedAction }, callback);
};

export const removeReply = async (id, seaPair, callback) => {
  const network = getNetworkInstance();
  const signedAction = await signSuperUserAction({ id, action: 'remove' }, seaPair);

  // Remove from documents and add to removed documents
  network.get('replies').get(id).put(null);
  network.get('removed').get(id).put({ removed: signedAction }, callback);
};

export const verifySuperUserAction = async (signedAction, publicKey) => {
  const verifiedAction = await Gun.SEA.verify(signedAction, publicKey);
  return verifiedAction ? true : false;
};

// Retrieve only the public key of the super user
export const getSuperUserPublicKey = async () => {
  const network = getNetworkInstance();
  const superUser = await new Promise(resolve => {
    network.get('superUser').once(resolve);
  });
  return superUser ? superUser.pub : null;
};