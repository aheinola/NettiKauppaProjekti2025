import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import ComponentsPage from './categorypages/ComponentsPage';
import ConsolesPage from './categorypages/ConsolesPage';
import PeriphiralsPage from './categorypages/PeriphiralsPage';
import GamesPage from './categorypages/GamesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/components" element={<ComponentsPage />} />
        <Route path="/consoles" element={<ConsolesPage />} />
        <Route path='/periphirals' element={<PeriphiralsPage />} />
        <Route path='/games' element={<GamesPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
