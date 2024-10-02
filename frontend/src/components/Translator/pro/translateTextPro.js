import axios from 'axios'; // Import axios
import { addHistory } from '../../../services/api';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GOOGLE_API_KEY = 'AIzaSyAXYSzBc9m-ubpn1vM0GIzFoIF6oKfgNbc';


export const translateTextPro = async (
  text,
  fromLang,
  toLang,
  setLoading,
  setError,
  setTranslatedText
) => {
  if (!text.trim() || !fromLang || !toLang) {
    setError('Please enter text and select both languages.');
    return;
  }

  setLoading(true);
  setError('');

  const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.post(apiUrl, {
      q: text, // The text to translate
      source: fromLang, // Source language (optional)
      target: toLang, // Target language
      format: 'text', // Optional: Specifies the format of the source text (either "text" or "html")
    });
    // const filter = 1;
    // console.log('Filter enabled:', filter); // Confirm that 1 or 0 is being sent
    // const response = await axios.post(
    //   'http://localhost:5000/api/translate',
    //   { text, toLang, filter }, // Send filter as 0 or 1
    //   { withCredentials: true }
    // );
    //const translatedText = response.data.translation;

   const translatedText = response.data.data.translations[0].translatedText;

    // Check for an empty translatedText
    if (translatedText === '') {
      setError('Invalid language pair specified or unsupported translation.');
      setTranslatedText('');
    } else {
      setTranslatedText(translatedText);

      const currentUserId = Cookies.get('userId');

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
