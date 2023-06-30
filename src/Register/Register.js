import React from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import useRegister from './useRegister';
import { getUser } from '../gossipNetwork';

export default function Register() {
  const { alias, setAlias, password, setPassword, error, handleSubmit } = useRegister(getUser);

  return (
    <Container>
      <Card className="auth-card">
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Alias or Email"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="auth-btn">
            Register
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
