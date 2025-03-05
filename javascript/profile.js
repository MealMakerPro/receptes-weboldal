import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { database, auth } from "./firebase-config";

if (window.location.pathname.includes("profile.html")) {
    import("../css/profile.css");
}

export function loadUserProfile() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(database, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();

                document.getElementById("name").innerText = userData.name || "N/A";
                document.getElementById("email").innerText = userData.email || "N/A";
                document.getElementById("username").innerText = userData.username || "N/A";
            } else {
                console.log("Nincsenek adatok a Firestore-ban!");
            }
        } else {
            console.log("Felhasználó nincs bejelentkezve!");
        }
    });
}