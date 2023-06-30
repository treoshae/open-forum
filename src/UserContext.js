import { createContext, useState, useEffect } from 'react';
import { getUser as getNetworkUser, processSuperUser, recallUser } from './gossipNetwork';

const UserContext = createContext({
  setUser: () => { },
  getUser: () => { },
  isSuperUser: false,
});

export function UserProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [userSeaPair, setUserSeaPair] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      // Try to recall the user
      recallUser((ack) => {
        if (ack.err) {
          console.error('Error recalling user:', ack.err);
        } else {
          // If successful, user should now be authenticated
          const networkUser = getNetworkUser();
          if (networkUser.is) {
            const newUser = networkUser.is;
            // Get SEA pair from Gun and add it to the user
            if (networkUser._) {
              newUser.seaPair = networkUser._.sea;
              setUserSeaPair(newUser.seaPair);  // update userSeaPair here
            }

            processSuperUser(newUser.pub, (superUser) => {
              newUser.isSuperUser = superUser;
              setIsSuperUser(superUser);
              setUserState(newUser);
            });
          }
        }
      });
    };

    fetchUser();
  }, []);


  const setUser = (newUser) => {
    if (newUser === null) {
      setUserState(null);
      setIsSuperUser(false);
      setUserSeaPair(null); 
      return;
    }

    console.log(`checking if super user: ${newUser.pub}`);

    processSuperUser(newUser.pub, (superUser) => {
      newUser.isSuperUser = superUser;
      setIsSuperUser(superUser);

      // Get SEA pair from Gun and add it to the user
      const networkUser = getNetworkUser();
      if (networkUser.is) {
        newUser.seaPair = networkUser._.sea;
        setUserSeaPair(newUser.seaPair);  // update userSeaPair here
      }

      setUserState(newUser);
    });
  };


  const getUser = (callback) => {
    const networkUser = getNetworkUser();
    if (networkUser.is) {
      callback(networkUser.is);
    } else {
      callback(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, getUser, isSuperUser, userSeaPair }}>
      {children}
    </UserContext.Provider>

  );
}

export default UserContext;
