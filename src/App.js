import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import HomePage from './Pages/Home';
import WipeInterface from './Pages/WipeInterface';
import Certificates from './Pages/Certificates';
import VerifyCertificate from './Pages/VerifyCertificate';
import Dashboard from './Pages/Dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout currentPageName="Home"><HomePage /></Layout>} />
        <Route path="/wipe-interface" element={<Layout currentPageName="WipeInterface"><WipeInterface /></Layout>} />
        <Route path="/certificates" element={<Layout currentPageName="Certificates"><Certificates /></Layout>} />
        <Route path="/verify-certificate" element={<Layout currentPageName="VerifyCertificate"><VerifyCertificate /></Layout>} />
        <Route path="/dashboard" element={<Layout currentPageName="Dashboard"><Dashboard /></Layout>} />
      </Routes>
    </Router>
  );
}