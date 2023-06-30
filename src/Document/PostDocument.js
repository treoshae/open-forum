import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import { Container, Card, Form, Button } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import usePostDocument from './usePostDocument';

const PostDocument = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const quillRef = useRef(); // Create a Ref to store the Quill instance
  const { postDocument, posting, error } = usePostDocument();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Get the Delta object from Quill instance
      const delta = quillRef.current.getEditor().getContents();
      // Save Delta object as a string to the database
      await postDocument(title, JSON.stringify(delta));
      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-3">
      <Card>
        <Card.Body>
          <h2>Post a Document</h2>
          <Form onSubmit={handleSubmit} style={{ marginTop: '40px' }}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder='Title'
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group style={{ marginTop: '20px' }}>
              <ReactQuill
                theme="snow"
                placeholder='Content'
                value={content}
                onChange={(content) => setContent(content)}
                ref={quillRef} // Attach the ref to ReactQuill component
              />
            </Form.Group>

            <Button type="submit" variant="primary">Submit</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostDocument;
