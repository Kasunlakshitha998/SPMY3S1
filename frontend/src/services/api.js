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
// Save Bookmark
export const saveBookmark = async ({ userId, entryId, color }) => {
  const response = await API.post(`/bookmarks`, { // Change '/bookmark' to '/bookmarks'
    userId,
    entryId,
    color,
  });
  return response.data;
};
// Get Bookmarks for a user
export const getBookmarks = async (userId) => {
  const response = await axios.get(`${API}/bookmarks/${userId}`);
  return response.data;
};


// API calls for the Favorites feature
export const getFavorites = () => API.get('/favorites/');
export const addFavorite = (text, translatedText, user) =>
  API.post('/favorites/add', { text, translatedText, user });
export const deleteFavorite = (id) => API.delete(`/favorites/delete/${id}`);
export const updateFavorite = (text, translatedText, id) =>
  API.put(`/favorites/update/${id}`, { text, translatedText });
