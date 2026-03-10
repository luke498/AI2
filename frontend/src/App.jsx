import React from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import EditDraftPage from './pages/EditDraftPage';

function App() {
  return (
    <main className="container">
      <nav className="navbar card">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/history">History</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit/:id" element={<EditDraftPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

export default App;
