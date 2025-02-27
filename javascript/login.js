import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
export function handleLogIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Bejelentkezve: " + user.email);
            window.location.href = "/index.html";
        })
        .catch((error) => {
            console.error("Hiba a bejelentkezéskor: ", error);
            alert("Hibás e-mail cím vagy jelszó!");
        });
}