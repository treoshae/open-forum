// useReplies.js
import { saveReply, removeReply } from '../gossipNetwork';

function useReply(parentId) {
  // Save a new reply
  const handleNewReply = (replyContent) => {
    saveReply(parentId, { content: replyContent }, (ack) => {

    });
  };

  // Delete a reply
  const handleDeleteReply = () => {
    removeReply(parentId);
  };

  return { handleNewReply, handleDeleteReply };
}

export default useReply;
