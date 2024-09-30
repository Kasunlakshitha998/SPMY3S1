import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Favorites from './components/Favorites';
import History from './components/History';
import Login from "./components/Auth/Login";
import { GoogleOAuthProvider } from '@react-oauth/google';
import TranslatorHome from './components/Translator/TranslatorHome';
import ImageList from './components/ImageList';
import VoiceHome from './components/Translator/VoiceHome';
import VoiceHistory from './components/VoiceHistory';

const clientId =
  '112541839051-8mcghudktegcedp8c7o9prqvfrvgng27.apps.googleusercontent.com';

const App = () => {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<TranslatorHome />} />
          <Route
            path="/login"
            element={
              <GoogleOAuthProvider clientId={clientId}>
                <Login />
              </GoogleOAuthProvider>
            }
          />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/history" element={<History />} />
          <Route path="/imageTranslator" element={< ImageList/>} />
          <Route path="/voicehome" element={<VoiceHome />} />
          <Route path="/voicehistory" element={<VoiceHistory />} />
       
        </Routes>
      </div>
    </Router>
  );
};

export default App;
