import React, { useState, useContext } from 'react';
import UserContext from '../UserContext';
import { saveMessage } from '../gossipNetwork';
import NewMessageForm from './NewMessageForm';

function NewMessage() {
    const [content, setContent] = useState('');
    const { user } = useContext(UserContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            console.error('User is not logged in');
            return;
        }

        const messageData = {
            content: content,
            timestamp: Date.now(),
            userId: user.id, // Use the user ID instead of alias
        };

        saveMessage(messageData, (ack) => {
            if (ack.err) {
                console.error('Error while storing message:', ack.err);
            } else {
                console.log('Data saved successfully');
                setContent('');
            }
        });
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    if (!user) return null;

    return (
        <NewMessageForm
            content={content}
            onSubmit={handleSubmit}
            onContentChange={handleContentChange}
        />
    );
}

export default NewMessage;