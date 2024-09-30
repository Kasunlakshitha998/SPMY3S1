import { addHistory } from '../../services/api';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const translateText = async (
  text,
  fromLang,
  toLang,
  setLoading,
  setError,
  setTranslatedText,
) => {
  if (!text.trim() || !fromLang || !toLang) {
    setError('Please enter text and select both languages.');
    return;
  }

  setLoading(true);
  setError('');

  const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${fromLang}|${toLang}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (
      data.responseStatus === 403 ||
      data.responseData.translatedText === ''
    ) {
      setError('Invalid language pair specified or unsupported translation.');
      setTranslatedText('');
    } else {
      const translatedText = data.responseData.translatedText;
      setTranslatedText(translatedText);

      const currentUserId = Cookies.get('userId');;
      
      if (text && translatedText) {
        try {
          await addHistory(text, translatedText, currentUserId);
          toast.success('Translation added to history!', {
            position: 'top-right',
            autoClose: 3000, // Auto close after 3 seconds
          });
        } catch (error) {
          console.error('Failed to add to History:', error);
          toast.error('Failed to add to History. Please try again.', {
            position: 'top-right',
            autoClose: 3000, // Auto close after 3 seconds
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching translation:', error);
    setError('An error occurred while fetching the translation.');
  } finally {
    setLoading(false);
  }
};
