import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebase_config = {
    apiKey: "AIzaSyBmdQM_twdnAMFcyNVvg_yCqQUhFUSvhiU",
    authDomain: "receptes-weboldal.firebaseapp.com",
    projectId: "receptes-weboldal",
    storageBucket: "receptes-weboldal.firebasestorage.app",
    messagingSenderId: "811645364337",
    appId: "1:811645364337:web:9cc0cf7360c3789d6313d0",
    measurementId: "G-JMVR32E4J6"
};

const app = initializeApp(firebase_config);
const analytics = getAnalytics(app);