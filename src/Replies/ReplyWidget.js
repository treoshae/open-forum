// ReplyWidget.js
import React, { useState, useEffect, useContext } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { FaReply, FaTrash } from 'react-icons/fa';
import useReply from './useReply';
import UserContext from '../UserContext';


function ReplyWidget({ messageId, parentContentRef }) {
  const [replyContent, setReplyContent] = useState('');
  const [quote, setQuote] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const { handleNewReply, handleDeleteReply } = useReply(messageId);
  const { isSuperUser, userSeaPair } = useContext(UserContext);


  useEffect(() => {
    let wasTextSelected = false;

    const captureQuote = () => {
      const selectedText = window.getSelection().toString();
      if (selectedText && parentContentRef.current && parentContentRef.current.contains(window.getSelection().baseNode)) {
        wasTextSelected = true;
        setQuote(selectedText);
      } else if (wasTextSelected) {
        wasTextSelected = false;
        setQuote('');
      }
    };

    document.addEventListener('mousedown', captureQuote);
    document.addEventListener('mouseup', captureQuote);

    return () => {
      document.removeEventListener('mousedown', captureQuote);
      document.removeEventListener('mouseup', captureQuote);
    };
  }, [parentContentRef]);

  const handleReplyClick = () => {
    handleNewReply(`${quote ? `Quoted: "${quote}"\n\n` : ''}${replyContent}`);
    setReplyContent('');
    setShowReplyBox(false);
    setQuote('');
  };

  return (
    <>
      <Button variant="link" onClick={() => setShowReplyBox(!showReplyBox)} style={{ border: 'none', background: 'none' }}>
        <FaReply />
      </Button>
      {<Button variant="link" onClick={handleDeleteReply} style={{ border: 'none', background: 'none' }}>
        <FaTrash />
      </Button>}
      {showReplyBox && (
        <>
          {quote && (
            <div className="mb-2">Quoted: "{quote}"</div>
          )}
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Write your reply here..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={handleReplyClick}>Reply</Button>
          </InputGroup>
        </>
      )}
    </>
  );
}

export default ReplyWidget;
