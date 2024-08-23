export const firebaseConfig = {
   apiKey: import.meta.env.VITE_FB_KEY,
   authDomain: import.meta.VITE_FB_AUTH_DOMAIN,
   projectId: import.meta.env.VITE_FB_PROJECT_ID,
   storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
   messagingSenderId: import.meta.env.VITE_FB_MESSAGE_SENDER_ID,
   appId: import.meta.env.VITE_FB_APP_ID,
   measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID
}