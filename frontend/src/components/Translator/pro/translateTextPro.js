import axios from 'axios'; // Import axios
import { addHistory } from '../../../services/api';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GOOGLE_API_KEY = 'AIzaSyAXYSzBc9m-ubpn1vM0GIzFoIF6oKfgNbc';
//const GOOGLE_API_KEY = 'AI';

// Function to compare and identify "untranslated" words
const validateWords = (originalText, translatedText) => {
  const originalWords = originalText.split(' ');
  const translatedWords = translatedText.split(' ');

  const invalidWords = [];
  originalWords.forEach((word, index) => {
    if (translatedWords[index] === word) {
      invalidWords.push(word);
    }
  });

  return invalidWords;
};

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
      q: text,
      source: fromLang,
      target: toLang,
      format: 'text',
    });

    const translatedText = response.data.data.translations[0].translatedText;

    // Validate by checking unchanged words
    const invalidWords = validateWords(text, translatedText);

    // If translation is successful
    setTranslatedText(translatedText);

    const currentUserId = Cookies.get('userId');

    if (text && translatedText) {
      try {
        await addHistory(text, translatedText, currentUserId);
        toast.success('Translation added to history!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } catch (error) {
        console.error('Failed to add to History:', error);
        toast.error('Failed to add to History. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }

    // Display invalid words, if any
    if (invalidWords.length > 0) {
      toast.warn(
        `The following words were not translated: ${invalidWords.join(', ')}`,
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
    }
  } catch (error) {
    console.error('Error fetching translation:', error);
    setError('An error occurred while fetching the translation.');
  } finally {
    setLoading(false);
  }
};
