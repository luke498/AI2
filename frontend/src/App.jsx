import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import EditDraftPage from './pages/EditDraftPage';

function App() {
  return (
    <main className="container">
      <nav className="navbar card">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/history">History</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/edit/:id" element={<EditDraftPage />} />

        {/* Safe fallback so app never stays on a blank route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

export default App;
