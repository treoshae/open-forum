import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserContext from '../UserContext';
import ReplyWidget from './ReplyWidget';
import ReplyList from './ReplyList';
import { getReplies } from '../gossipNetwork';

jest.mock('../gossipNetwork', () => ({
    getReplies: jest.fn(),
}));

const dummyUser = { alias: 'dummyUser', publicKey: '123' };
const dummyMessageId = 'message1';

describe('Reply', () => {
    test('fetches replies from gun and sets them to state', async () => {
        // const dummyReplies = [
        //     { id: 'reply1', alias: 'User1', content: 'Reply1' },
        //     { id: 'reply2', alias: 'User2', content: 'Reply2' },
        // ];

        // getReplies.mockImplementation((parentId, callback) => {
        //     dummyReplies.forEach(reply => callback(reply));
        //     return () => { }; // Return a mock unsubscribe function
        // });

        // render(
        //     <UserContext.Provider value={{ user: dummyUser }}>
        //         <MemoryRouter>
        //             <ReplyWidget messageId={dummyMessageId} />
        //             <ReplyList messageId={dummyMessageId} />
        //         </MemoryRouter>
        //     </UserContext.Provider>
        // );

        // await waitFor(() => {
        //     expect(screen.getByText(/Reply1/)).toBeInTheDocument();
        //     expect(screen.getByText('User1')).toBeInTheDocument();
        //     expect(screen.getByText(/Reply2/)).toBeInTheDocument();
        //     expect(screen.getByText('User2')).toBeInTheDocument();
        // });
    });

    // test('handles no replies', async () => {
    //     getReplies.mockImplementation((parentId, callback) => {
    //         // The function doesn't call the callback, thus simulating no replies.
    //         return () => { };  // Return a mock unsubscribe function
    //     });

    //     render(
    //         <UserContext.Provider value={{ user: dummyUser }}>
    //             <MemoryRouter>
    //                 <ReplyList messageId={dummyMessageId} />
    //             </MemoryRouter>
    //         </UserContext.Provider>
    //     );

    //     await waitFor(() => {
    //         expect(screen.queryByText(/Reply1/)).not.toBeInTheDocument();
    //         expect(screen.queryByText(/User1/)).not.toBeInTheDocument();
    //         expect(screen.queryByText(/Reply2/)).not.toBeInTheDocument();
    //         expect(screen.queryByText(/User2/)).not.toBeInTheDocument();
    //     });
    // });

    // test('shows the reply form when reply button is clicked', () => {
    //     render(
    //         <UserContext.Provider value={{ user: dummyUser }}>
    //             <MemoryRouter>
    //                 <ReplyWidget messageId={dummyMessageId} />
    //             </MemoryRouter>
    //         </UserContext.Provider>
    //     );

    //     fireEvent.click(screen.getByRole('button', { name: '' })); // The name is an empty string because the button has no text content, only an icon.
    //     expect(screen.getByPlaceholderText('Write your reply here...')).toBeInTheDocument();
    // });
});
