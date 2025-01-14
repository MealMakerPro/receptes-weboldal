import { auth, database } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

export function handleRegistration(name, email, username, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            return set(ref(database, "users/" + user.uid), {
                username: username,
                email: email,
            });
        })
        .then(() => {
            alert("Sikeres regisztráció!");
        })
        .catch((error) => {
            console.error("Hiba: ", error);
            alert(error.message);
        });
}