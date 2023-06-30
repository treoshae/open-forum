import React, { useContext } from 'react';
import { Card, Form } from 'react-bootstrap';
import UserContext from './UserContext';

function Profile() {
  const { user } = useContext(UserContext);

  console.log(`User: ${JSON.stringify(user)}`);

  return (
    <div className="container">
      <Card className="mt-3">
        <Card.Body>
          <Card.Title>Profile</Card.Title>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Alias</Form.Label>
              <Form.Control type="text" readOnly value={user ? user.alias : ''} />
            </Form.Group>
            {user?.isSuperUser && (
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control type="text" readOnly value="Super User" />
              </Form.Group>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Profile;
