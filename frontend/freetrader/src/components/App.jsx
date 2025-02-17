import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Login from './Login';
import WhatsappDashboard from './WhatsappDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="Login" element={<Login />} />
      <Route path="WhatsappDashboard" element={<WhatsappDashboard />} />
    </Routes>
  </Router>
  );
}

export default App;