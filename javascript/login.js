import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
export function handleLogIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Bejelentkezve: " + user);
            window.location.href = "../html/index.html";
        })
        .catch((error) => {
            console.error("Hiba a bejelentkezéskor: ", error);
            alert(error.message);
        });
}