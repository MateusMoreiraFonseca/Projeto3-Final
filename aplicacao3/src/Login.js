import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    
    setError(null);
    setResponseMessage('');
    setLoading(true);
  
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), 
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          setError('Credenciais inválidas.');
        } else if (response.status === 500) {
          setError('Erro interno do servidor. Tente novamente mais tarde.');
        } else {
          setError('Erro desconhecido.');
        }
        return;
      }
  
      const data = await response.json();
  
      if (data.token) {
        localStorage.setItem('token', data.token);
        setResponseMessage('Login bem-sucedido!');
        
        setTimeout(() => {
          navigate('/busca');
        }, 2000);
      } else {
        setResponseMessage(data.error || 'Erro desconhecido.');
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setError('Falha ao conectar ao servidor. Verifique sua conexão e tente novamente. Caso não consiga, o servidor pode estar offline.');
      } else {
        setError('Falha ao fazer login. Verifique suas credenciais e tente novamente.');
      }
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        {responseMessage && !error && <p className="response">{responseMessage}</p>}
        <input
          className="input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {usernameError && <p className="error">{usernameError}</p>}
        <input
          className="input"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p className="error">{passwordError}</p>}
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default Login;
