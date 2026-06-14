const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const URL = 
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;
  
// tutorial api   https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCZAPIrEvMtv6nFEnGt4AvD0cfjezQ2Q3E