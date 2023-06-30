// MessageList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import NewMessage from '../NewPost/NewMessage';
import useMessages from './useMessages';
import { approximateDate } from '../utils/dateApproximation';
import { FaFileAlt } from 'react-icons/fa'; // import the icon

function MessageList() {
  const navigate = useNavigate();
  const { messages, loading } = useMessages();

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleViewMessage = (messageId, type) => {
    navigate(`/${type}/${messageId}`);
  };

  return (
    <Container>
      <NewMessage />
      {messages.length > 0 ? (
        [...messages].map((message) => (
          <Card key={message.id} className="mb-3" onClick={() => handleViewMessage(message.id, message.type)}>
            <Card.Body>
              <Card.Text><small>{message.alias}</small></Card.Text>
              {message.type === 'post' ? (
                <Card.Text role="article">{message.content}</Card.Text>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaFileAlt /> {/* Show the icon when it's a document */}
                  <Card.Text role="article" style={{ marginLeft: '10px' }}>{message.title}</Card.Text>
                </div>
              )}
              <Card.Text><small className="text-muted">{approximateDate(message.timestamp)}</small></Card.Text>
            </Card.Body>
          </Card>

        ))
      ) : (
        <Card className="mb-3">
          <Card.Body>
            <Card.Text>Nothing posted yet</Card.Text>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default MessageList;
