import React, { useEffect, useState, useRef, useContext } from 'react';
import { Card, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getMessage } from '../gossipNetwork';
import ReplyWidget from '../Replies/ReplyWidget';
import ReplyList from '../Replies/ReplyList';
import { approximateDate } from '../utils/dateApproximation';
import { removeMessage } from '../gossipNetwork';
import UserContext  from '../UserContext';


function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const textRef = useRef(null);
  const { isSuperUser, userSeaPair } = useContext(UserContext);

  useEffect(() => {
    getMessage(id, (data) => {
      if (data) {
        setPost({
          id,
          ...data,
        });
      }
    });
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleRemoveClick = () => {
    console.log('remove message: ', id, userSeaPair)
    removeMessage(id, userSeaPair, (ack) => {
      if (ack.err) {
        console.error(ack.err || 'Unknown error');
      } else {
        console.log('Message removed');
      }
    });
  };

  return (
    <Container>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>{post.alias}</Card.Title>
          <Card.Text role="article" ref={textRef}>{post.content}</Card.Text> {/* Use ref here */}
          <Card.Text><small className="text-muted">{approximateDate(post.timestamp)}</small></Card.Text>
          <ReplyWidget messageId={post.id} parentContentRef={textRef} /> {/* Pass the ref here */}
          {isSuperUser && <button onClick={handleRemoveClick}>Remove</button>}
        </Card.Body>
      </Card>
      <ReplyList messageId={post.id} />
    </Container>
  );
}

export default SinglePost;
