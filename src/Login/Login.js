// Login.js:
import React from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import useLogin from './useLogin';

export default function Login() {
  const { alias, setAlias, password, setPassword, error, handleSubmit } = useLogin();

  return (
    <Container>
      <Card className="auth-card">
        <Form onSubmit={handleSubmit} data-testid="login-form">
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
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
