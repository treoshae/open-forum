import React from 'react';
import { Form, Button } from 'react-bootstrap';

function NewMessageForm({ content, onSubmit, onContentChange }) {
    return (
        <Form onSubmit={onSubmit}>
            <Form.Group controlId="messageContent">
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={onContentChange}
                    data-testid="message-content-input"
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Post
            </Button>
        </Form>
    );
}

export default NewMessageForm;