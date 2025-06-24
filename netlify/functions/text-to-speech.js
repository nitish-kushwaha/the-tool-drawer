const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // फ्रंट-एंड से अब हम टेक्स्ट के साथ-साथ और भी ऑप्शन लेंगे
    const { text, voiceName, speakingRate, pitch } = JSON.parse(event.body);
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!text) { return { statusCode: 400, body: 'Error: No text provided.' }; }
    if (!apiKey) { return { statusCode: 500, body: 'Error: API Key not found.' }; }

    // गूगल API को भेजने वाला नया बॉडी
    const requestBody = {
      input: { text: text },
      voice: { 
        languageCode: 'en-US', // इसे भविष्य में बदला जा सकता है
        name: voiceName // फ्रंट-एंड से मिली आवाज़ का नाम
      },
      audioConfig: { 
        audioEncoding: 'MP3',
        speakingRate: speakingRate, // फ्रंट-एंड से मिली स्पीड
        pitch: pitch // फ्रंट-एंड से मिली पिच
      },
    };

    const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': apiKey },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Google TTS API Error:', error);
      return { statusCode: response.status, body: JSON.stringify(error) };
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('Serverless function error:', error);
    return { statusCode: 500, body: 'An internal server error occurred.' };
  }
};