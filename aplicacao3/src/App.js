import React from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import Login from './Login';
import Busca from './Busca'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/busca" element={<Busca />} />
      {}
    </Routes>
  );
}

export default App;
