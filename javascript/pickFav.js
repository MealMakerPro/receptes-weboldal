import {database} from "./firebase-config";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export async function checkFavoriteStatus(user, recipeId, heart) {
    const userRef = doc(database, "users", user.uid);

    try {
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const favorites = userData.favoriteRecipes || [];

            if (favorites.includes(recipeId)) {
                heart.classList.add("favorite");
            } else {
                heart.classList.remove("favorite");
            }
        }
    } catch (error) {
        console.error("Hiba történt a kedvencek lekérdezésekor:", error);
    }
}

export async function toggleFavorites(user, recipeId, heart) {
    const userRef = doc(database, "users", user.uid);

    try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            let favorites = userData.favoriteRecipes || [];

            if (favorites.includes(recipeId)) {
                await updateDoc(userRef, {
                    favoriteRecipes: arrayRemove(recipeId),
                });
                heart.classList.remove("favorite");
                console.log("Recept eltávolítva!");
            } else {
                await updateDoc(userRef, {
                    favoriteRecipes: arrayUnion(recipeId),
                });
                heart.classList.add("favorite");
                console.log("Recept hozzáadva!");
            }
        } else {
            console.error("Nincs ilyen felhasználó az adatbázisban.");
        }
    } catch (error) {
        console.error("Hiba történt:", error);
    }
}