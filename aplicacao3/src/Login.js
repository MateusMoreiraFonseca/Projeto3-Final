import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom'; 
onst Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let isValid = true;
    if (!username) {
      setUsernameError('Username é obrigatório');
      isValid = false;
    } else {
      setUsernameError('');
    }
    
    if (!password) {
      setPasswordError('Senha é obrigatória');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setResponseMessage('Login realizado com sucesso!');
      } else {
        setResponseMessage('');
        setUsernameError('');
        setPasswordError(result.message || 'Erro ao realizar login');
      }
    } catch (error) {
      setResponseMessage('');
      setUsernameError('');
      setPasswordError('Erro de rede ou servidor indisponível');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        {responseMessage && <p className="response">{responseMessage}</p>}
        <input
          className="input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}


export default Login;
