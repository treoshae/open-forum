import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme.css';
import Header from './Header/Header';
import MessageList from './Posts/MessageList';
import Register from './Register/Register';
import Login from './Login/Login';
import Profile from './Profile';
import { UserProvider } from './UserContext'; // import UserProvider
import SinglePost from './SinglePost/SinglePost';
import  PostDocument from './Document/PostDocument';
import DocumentPostView from './Document/DocumentPostView';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app-theme">
          <Header />
          <Routes>
            <Route path="/" element={<MessageList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/post-document" element={<PostDocument />} />
            <Route path="/post/:id" element={<SinglePost />} />
            <Route path="/document/:documentId" element={<DocumentPostView />} />

          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
