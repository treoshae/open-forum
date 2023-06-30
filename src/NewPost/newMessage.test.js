import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserContext from '../UserContext';
import NewMessage from './NewMessage';
import * as GossipNetwork from '../gossipNetwork';

jest.mock('../gossipNetwork', () => ({
  saveMessage: jest.fn(),
}));

describe('NewMessage', () => {
  it('does not render the form when the user is not logged in', () => {
    render(
      <UserContext.Provider value={{ user: null }}>
        <NewMessage />
      </UserContext.Provider>
    );

    expect(screen.queryByPlaceholderText("What's on your mind?")).not.toBeInTheDocument();
  });

  it('renders the form when the user is logged in', () => {
    const mockUser = { id: 'testUserId' };

    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <NewMessage />
      </UserContext.Provider>
    );

    expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument();
  });

  it('allows a user to post a message', async () => {
    const user = { id: 'testUserId' };
    const { getByTestId } = render(
      <UserContext.Provider value={{ user }}>
        <NewMessage />
      </UserContext.Provider>
    );

    const contentInput = getByTestId('message-content-input');
    const submitButton = screen.getByText('Post');

    fireEvent.change(contentInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(GossipNetwork.saveMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Test message',
          userId: 'testUserId',
        }),
        expect.any(Function)
      );
    });
  });
});