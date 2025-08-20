// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Page Components
import Signup from './pages/Signup';
import Login from './pages/Login';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import TimerPage from './pages/TimerPage';
import NotesPage from './pages/NotesPage'; // <-- Import the new NotesPage
import Layout from './pages/Layout';

// Import CSS
import './App.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* --- Public Routes (for logged-out users) --- */}
        <Route
          path="/login"
          element={!token ? <div className="app-container"><Login /></div> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!token ? <div className="app-container"><Signup /></div> : <Navigate to="/" />}
        />

        {/* --- Protected Routes (for logged-in users) --- */}
        {/* All protected routes will be rendered inside the Layout component */}
        <Route
          path="/*"
          element={token ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<DashboardPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="timer" element={<TimerPage />} />
          <Route path="notes" element={<NotesPage />} /> {/* <-- Add the route for the notes page */}
          
          {/* Fallback for any other nested routes */}
          <Route path="*" element={<Navigate to="/" />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
