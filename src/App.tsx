import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import WhatWeDo from './pages/What-we-do';
import Videos from './pages/Videos';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/what-we-do" element={<WhatWeDo />} />
                
        <Route path="/videos" element={<Videos />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;