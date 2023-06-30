import React, { useEffect, useState, useRef } from 'react';
import { Card, Alert } from 'react-bootstrap';
import { getReplies } from '../gossipNetwork';
import ReplyWidget from '../Replies/ReplyWidget';
import { approximateDate } from '../utils/dateApproximation';

const ReplyList = ({ messageId, depth = 0 }) => {
  const [replies, setReplies] = useState([]);
  const textRefMap = useRef({});

  useEffect(() => {
    const unsubscribe = getReplies(messageId, (newReply) => {
      setReplies((oldReplies) => {
        if (!oldReplies.some((reply) => reply.id === newReply.id)) {
          textRefMap.current[newReply.id] = React.createRef();
          return [newReply, ...oldReplies];
        } else {
          return oldReplies;
        }
      });
    });

    return () => unsubscribe();
  }, [messageId]);

  return (
    <div style={{ marginLeft: depth ? '20px' : '0px' }}>
      {replies.map((reply) => {
        const quoteIndex = reply.content.indexOf('Quoted: "');
        let quote = '';
        let content = reply.content;

        if (quoteIndex !== -1) {
          const endQuoteIndex = reply.content.indexOf('"\n\n', quoteIndex);
          if (endQuoteIndex !== -1) {
            quote = reply.content.slice(quoteIndex + 9, endQuoteIndex);
            content = reply.content.slice(endQuoteIndex + 3);
          }
        }

        return (
          <div key={reply.id}>
            <div
              style={{
                borderLeft: depth ? '2px solid #343a40' : 'none',
                paddingLeft: depth ? '10px' : '0px',
              }}
            >
              <Card className="mb-2 reply-card">
                <Card.Body>
                  <Card.Title>{reply.alias}</Card.Title>
                  {quote && <Alert variant="dark" className="quote-alert">{quote}</Alert>}
                  <Card.Text role="article" ref={textRefMap.current[reply.id]}>
                    {content}
                  </Card.Text>
                  <Card.Text>
                    <small className="text-muted">{approximateDate(reply.timestamp)}</small>
                  </Card.Text>
                  <ReplyWidget messageId={reply.id} parentContentRef={textRefMap.current[reply.id]} />
                </Card.Body>
              </Card>
            </div>
            <ReplyList messageId={reply.id} depth={depth + 1} />
          </div>
        );
      })}
    </div>
  );
};

export default ReplyList;
