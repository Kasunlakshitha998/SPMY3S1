import axios from 'axios';

// Set up base URL for API requests
const API = axios.create({
  baseURL: 'http://localhost:5000/',
});


// translation history
export const getHistory = () => API.get('/history');
export const addHistory = (text, translatedText, user) =>
  API.post('/history/add', { text, translatedText, user });
export const deleteHistoryEntry = (id) => API.delete(`/history/delete/${id}`);
export const clearHistory = async () => {
  return API.delete('/history/clear');
};

// translation voicehistory
export const getvoiceHistory = () => API.get('/voicehistory');
export const addvoiceHistory = (text, translatedText, user) =>
  API.post('/voicehistory/add', { text, translatedText, user });
export const deletevoiceHistoryEntry = (id) => API.delete(`/voicehistory/delete/${id}`);
export const clearvoiceHistory = async () => {
  return API.delete('/voicehistory/clear');
};



// API calls for the Favorites feature
export const getFavorites = () => API.get('/favorites/');
export const addFavorite = (text, translatedText, user) =>
  API.post('/favorites/add', { text, translatedText, user });
export const deleteFavorite = (id) => API.delete(`/favorites/delete/${id}`);
