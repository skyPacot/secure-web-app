import { useState } from 'react';
import './App.css';
import LoginForm from './LoginForm';
import ChuckNorris from './ChuckNorris';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);

  const handleLogout = () => {
    setToken(null);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="App">
      {!token ? (
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          setToken={setToken}
        />
      ) : (
        <ChuckNorris token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;