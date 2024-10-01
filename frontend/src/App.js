import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Favorites from './components/Favorite/Favorites';
import History from './components/History';
import TranslatorHome from './components/Translator/TranslatorHome';
import ImageList from './components/ImageTranslator/ImageList';
import Register from './components/Auth/Register';
import LoginNew from './components/Auth/loginNew';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Profile from './components/Auth/profile';
import VoiceHistory from './components/VoiceHistory';
import GetProPage from './components/Translator/pro/GetProPage';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const isAuthenticatedFromStorage =
      localStorage.getItem('isAuthenticated') === 'true';
    const userFromStorage = JSON.parse(localStorage.getItem('user'));

    if (isAuthenticatedFromStorage && userFromStorage) {
      setIsAuthenticated(true);
      setUser(userFromStorage);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <TranslatorHome handleLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginNew onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Favorites handleLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <History handleLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/imageTranslator"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ImageList handleLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/get-pro"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <GetProPage handleLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/voicehistory" element={<VoiceHistory />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
