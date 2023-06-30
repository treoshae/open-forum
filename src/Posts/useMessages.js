import { useEffect, useState } from 'react';
import { getMessages, getDocuments } from '../gossipNetwork';

export default function useMessages() {
  const [messages, setMessages] = useState({});
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cleanupFunctions = [];

    // Listen for new messages
    const stopListeningMessages = getMessages((message, id) => {
      if (message && message.content && message.userId) { 
        setMessages(oldMessages => ({ ...oldMessages, [id]: { ...message, id, type: 'post' } }));
      }
      setLoadingMessages(false); // Set loadingMessages to false after fetching is done
    });

    // Listen for new documents
    const stopListeningDocuments = getDocuments((document, id) => {
      if (document && document.title && document.content && document.userId) { 
        setMessages(oldMessages => ({ ...oldMessages, [id]: { ...document, id, type: 'document' } }));
      }
      setLoadingDocuments(false); // Set loadingDocuments to false after fetching is done
    });

    cleanupFunctions.push(stopListeningMessages);
    cleanupFunctions.push(stopListeningDocuments);

    // Cleanup function
    return () => {
      cleanupFunctions.forEach((cleanupFn) => cleanupFn());
    };
  }, []);

  useEffect(() => {
    // Set the main loading state to false when both loading states are false
    if (!loadingMessages || !loadingDocuments) {
      setLoading(false);
    }
  }, [loadingMessages, loadingDocuments]);

  const messagesArray = Object.values(messages);

  // Sort the messages by timestamp in descending order
  const sortedMessagesArray = messagesArray.sort((a, b) => b.timestamp - a.timestamp);

  return { messages: sortedMessagesArray, loading };
}
