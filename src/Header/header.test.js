import React from 'react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import UserContext from '../UserContext';
import Header from './Header';

describe('Header', () => {
  it('should render a logout button when the user is logged in', () => {
    const user = { alias: 'testuser', pub: 'testpub', epub: 'testepub' };
    const setUser = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <UserContext.Provider value={{ user, setUser }}>
          <Header />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const logoutButton = getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
  });

  it('should call the setUser function with null when the logout button is clicked', () => {
    const user = { alias: 'testuser', pub: 'testpub', epub: 'testepub' };
    const setUser = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <UserContext.Provider value={{ user, setUser }}>
          <Header />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const logoutButton = getByText('Logout');
    fireEvent.click(logoutButton);
    expect(setUser).toHaveBeenCalledWith(null);
  });
});