import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import { getDocument, removeDocument } from '../gossipNetwork';
import Delta from 'quill-delta';
import ReactQuill from 'react-quill';
import UserContext  from '../UserContext';

function DocumentPostView() {
    const { documentId } = useParams();
    const [documentPost, setDocumentPost] = useState(null);
    const { isSuperUser, userSeaPair } = useContext(UserContext);

    useEffect(() => {
        const fetchDocument = () => {
            getDocument(documentId, (doc) => {
                setDocumentPost(doc);
            });
        };

        fetchDocument();
    }, [documentId]);

    if (!documentPost) {
        return <div>Loading...</div>;
    }

    let quillDelta = new Delta(JSON.parse(documentPost.content));

    const handleRemoveClick = () => {
        removeDocument(documentId, userSeaPair, (ack) => {
            if (ack.err) {
                console.error(ack.err || 'Unknown error');
            } else {
                console.log('Document removed');
            }
        });
    };

    return (
        <Container>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>{documentPost.title}</Card.Title>
                    <ReactQuill
                        value={quillDelta}
                        readOnly={true}
                        theme={null} // this removes the toolbar
                    />
                    {isSuperUser && <button onClick={handleRemoveClick}>Remove</button>}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default DocumentPostView;
