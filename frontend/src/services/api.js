import axios from 'axios';

// Set up base URL for API requests
const API = axios.create({
  baseURL: 'http://localhost:5000/',
});


// translation history
export const getHistory = () => API.get('/history');
export const addHistory = (text, translatedText, user) =>
  API.post('/history/add', { text, translatedText, user });


// API calls for the Favorites feature
export const getFavorites = () => API.get('/favorites/');
export const addFavorite = (text, translatedText, user) =>
  API.post('/favorites/add', { text, translatedText, user });
export const deleteFavorite = (id) => API.delete(`/favorites/delete/${id}`);
