import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import Register from './Register';
import useRegister from './useRegister';
import { getUser } from '../gossipNetwork';

jest.mock('../gossipNetwork', () => ({
  getUser: jest.fn().mockReturnValue({
    create: jest.fn().mockImplementation((alias, password, callback) => {
      callback({ err: 'User already exists' });
    }),
    auth: jest.fn().mockImplementation((alias, password, callback) => {
      callback({});
    }),
  }),
}));

describe('Register', () => {
  beforeEach(() => {
    getUser().create.mockClear();
    getUser().auth.mockClear();
  });

  test('displays an error when user tries to register with an existing alias', async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    await act(async () => {
      userEvent.type(screen.getByPlaceholderText(/Alias or Email/i), 'existingAlias');
    });

    await act(async () => {
      userEvent.type(screen.getByPlaceholderText(/Password/i), 'password');
    });

    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: /register/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/User already exists/i)).toBeInTheDocument();
    });
  });
});
