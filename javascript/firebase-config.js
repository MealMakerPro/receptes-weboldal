import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBmdQM_twdnAMFcyNVvg_yCqQUhFUSvhiU",
    authDomain: "receptes-weboldal.firebaseapp.com",
    projectId: "receptes-weboldal",
    storageBucket: "receptes-weboldal.firebasestorage.app",
    messagingSenderId: "811645364337",
    appId: "1:811645364337:web:9cc0cf7360c3789d6313d0",
    measurementId: "G-JMVR32E4J6"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getFirestore(app);
const storage = getStorage(app);

export { auth, database, storage };