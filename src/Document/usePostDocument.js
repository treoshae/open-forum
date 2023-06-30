// usePostDocument.js

import { useState } from 'react';
import { saveDocument } from '../gossipNetwork';

const usePostDocument = () => {
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);

  const postDocument = async (title, content) => {
    setPosting(true);
    setError(null);

    try {
      // Create a new document object
      const documentData = {
        title,
        content
      };

      // Save the document
      await saveDocument(documentData, (ack) => {
        if (ack.err) {
          setError(ack.err);
        }
      });

    } catch (err) {
      setError(err.message);
    }

    setPosting(false);
  };

  return { postDocument, posting, error };
};

export default usePostDocument;
