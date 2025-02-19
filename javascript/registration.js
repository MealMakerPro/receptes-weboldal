import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, database } from "./firebase-config";

export function handleRegistration(name, email, username, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const userData = {
                uid: user.uid,
                email: user.email,
                name: name,
                username: username,
                createdAt: Timestamp.now(),
            };
            await setDoc(doc(database, "users", user.uid), userData);
            console.log("Felhasználó regisztrálva: " + user);
        })
        .catch((error) => {
            console.error("Regisztrációs hiba: ", error);
            alert(error.message);
        });
}
