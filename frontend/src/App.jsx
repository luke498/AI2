import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import EditDraftPage from './pages/EditDraftPage';

function App() {
  return (
    <main className="container">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Keep existing pages and flows working */}
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/edit/:id" element={<EditDraftPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

export default App;
