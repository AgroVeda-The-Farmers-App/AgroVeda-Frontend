import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "major-ba111.firebaseapp.com",
  databaseURL: "https://major-ba111-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "major-ba111",
  storageBucket: "major-ba111.firebasestorage.app",
  messagingSenderId: "707944947029",
  appId: "1:707944947029:web:cf30c7f56f256901c63dc"
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);