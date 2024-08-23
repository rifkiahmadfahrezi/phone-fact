import { firebaseConfig } from "./config";
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"


export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)