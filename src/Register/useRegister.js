import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import { setSuperUser } from '../gossipNetwork';

export default function useRegister(getUser) {
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    getUser().create(alias, password, (ack) => {
      if (ack.err) {
        setError(ack.err);
      } else {
        getUser().auth(alias, password, (loginAck) => {
          if (loginAck.err) {
            setError(loginAck.err);
          } else {
            const user = { alias: alias, pub: getUser().is.pub, epub: getUser().is.epub };
            setUser(user);

            // Check if super user exists, if not, set current user as super user
            setSuperUser(user.pub);

            navigate('/');
          }
        });
      }
    });
  };

  return { alias, setAlias, password, setPassword, error, handleSubmit };
}
