import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import useMessages from './useMessages';
import UserContext from '../UserContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

import MessageList from './MessageList';

jest.mock('../gossipNetwork', () => ({
  getMessages: jest.fn(),
  getUser: jest.fn(),
  getReplies: jest.fn(() => jest.fn()), // Now returns a function
}));



jest.mock('./useMessages', () => jest.fn());

describe('useMessages', () => {
  const dummyUser = { alias: 'dummyUser', publicKey: '123' };

  test('fetches messages from gun and sets them to state', async () => {
    const dummyMessages = [
      { id: 'message1', userId: 'User1', content: 'Hello' },
      { id: 'message2', userId: 'User2', content: 'World' },
    ];

    useMessages.mockImplementation(() => ({
      messages: dummyMessages,
      loading: false,
    }));

    render(
      <UserContext.Provider value={{ user: dummyUser }}>
        <MemoryRouter>
          <MessageList />
        </MemoryRouter>
      </UserContext.Provider>
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
  });

  test('handles no messages', async () => {
    useMessages.mockImplementation(() => ({
      messages: [],
      loading: false,
    }));

    render(
      <UserContext.Provider value={{ user: dummyUser }}>
        <MemoryRouter>
          <MessageList />
        </MemoryRouter>
      </UserContext.Provider>
    );

    // Test that the component doesn't render any messages
    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    expect(screen.queryByText('World')).not.toBeInTheDocument();
  });

  test('renders a loading state before messages are fetched', async () => {
    const dummyMessages = [{ id: 'message1', userId: 'User1', content: 'Hello' }, { id: 'message2', userId: 'User2', content: 'World' }];

    useMessages.mockImplementation(() => ({
      messages: [],
      loading: true,
    }));

    const { rerender } = render(
      <UserContext.Provider value={{ user: dummyUser }}>
        <MemoryRouter>
          <MessageList />
        </MemoryRouter>
      </UserContext.Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    useMessages.mockImplementation(() => ({
      messages: dummyMessages,
      loading: false,
    }));

    rerender(
      <UserContext.Provider value={{ user: dummyUser }}>
        <MemoryRouter>
          <MessageList />
        </MemoryRouter>
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('World')).toBeInTheDocument();
    });
  });

  test('renders a message and the new message form if there are no messages', () => {
    useMessages.mockImplementation(() => ({
      messages: [],
      loading: false,
    }));

    render(
      <UserContext.Provider value={{ user: dummyUser }}>
        <MemoryRouter>
          <MessageList />
        </MemoryRouter>
      </UserContext.Provider>
    );

    expect(screen.getByText('Nothing posted yet')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Post/i })).toBeInTheDocument();
  });

  test('shows the latest messages first', async () => {
    const earlierMessage = { id: 'message1', userId: 'User1', content: 'Earlier message', timestamp: 1000 };
    const laterMessage = { id: 'message2', userId: 'User2', content: 'Later message', timestamp: 2000 };
  
    // Return the messages in the reverse order they were posted (latest first)
    useMessages.mockImplementation(() => ({
      messages: [laterMessage, earlierMessage],  // Note the order here
      loading: false,
    }));
  
    render(
      <UserContext.Provider value={{ user: dummyUser }}>
        <MemoryRouter>
          <MessageList />
        </MemoryRouter>
      </UserContext.Provider>
    );
  
    // Verify that the later message appears before the earlier one
    expect(screen.getByText('Later message')).toBeInTheDocument();
    expect(screen.getByText('Earlier message')).toBeInTheDocument();
  
    // Get the rendered messages
    const messages = screen.getAllByRole('article');
  
    // Verify that the later message appears before the earlier one
    expect(messages[0]).toHaveTextContent('Later message');
    expect(messages[1]).toHaveTextContent('Earlier message');
  });
  

});
