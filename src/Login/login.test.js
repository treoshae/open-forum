// login.test.js:
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { getUser } from '../gossipNetwork';

jest.mock('../gossipNetwork', () => ({
  getUser: jest.fn().mockReturnValue({
    auth: jest.fn().mockImplementation((alias, password, callback) => {
      callback({ err: 'Invalid credentials' });
    }),
  }),
}));

describe('Login', () => {
  beforeEach(() => {
    getUser().auth.mockClear();
  });

  test('displays an error when login fails', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  
    await act(async () => {
      await userEvent.type(screen.getByPlaceholderText(/Alias or Email/i), 'invalidUser');
    });
  
    await act(async () => {
      await userEvent.type(screen.getByPlaceholderText(/Password/i), 'invalidPassword');
    });
  
    const form = screen.getByTestId('login-form');
  
    // Wrap the form submission inside act
    await act(async () => {
      fireEvent.submit(form);
    });
  
    const errorMessage = await screen.findByText(/Invalid credentials/i);
  
    expect(errorMessage).toBeInTheDocument();
  });
  
});
