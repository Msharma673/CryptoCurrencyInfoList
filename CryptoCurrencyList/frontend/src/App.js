import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import CryptoList from './CryptoList';
import CryptoSearch from './CryptoSearch';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cryptoList" element={<CryptoList />} />
        <Route path="/cryptosearch/:coinName" element={<CryptoSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
