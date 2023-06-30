// useLogin.js:
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import { getUser } from '../gossipNetwork';

export default function useLogin() {
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { setUser, getUserContext } = useContext(UserContext);
  
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserContext;
    if (user && user.alias) {
      setAlias(user.alias);
    }
  }, [getUserContext]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const gunUser = getUser();
    gunUser.auth(alias, password, (ack) => {
      if (ack.err) {
        setError('Invalid credentials');
        return;
      }
      const user = { alias: alias, pub: gunUser.is.pub, epub: gunUser.is.epub };
      setUser(user);
      navigate('/');
    });
  };
  

  return { alias, setAlias, password, setPassword, error, handleSubmit };
}
