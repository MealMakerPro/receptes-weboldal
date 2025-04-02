import {arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, updateDoc} from "firebase/firestore";
import {auth, database} from "./firebase-config";
import {onAuthStateChanged} from "firebase/auth";
import "../css/shopping_list.css";

export async function checkCartStatus(user, recipeId, cart) {
    const userRef = doc(database, "users", user.uid);

    try {
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const shoppingList = userData.shoppingList || [];

            if (shoppingList.includes(recipeId)) {
                cart.classList.add("shoppinglist");
            } else {
                cart.classList.remove("shoppinglist");
            }
        }
    } catch (error) {
        console.error("Hiba történt a bevásárlólista lekérdezésekor: " + error);
    }
}

export async function toggleCartList(user, recipeId, cart) {
    const userRef = doc(database, "users", user.uid);

    try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data();
            const shoppingList = userData.shoppingList || [];

            if (shoppingList.includes(recipeId)) {
                await updateDoc(userRef, {
                    shoppingList: arrayRemove(recipeId),
                });
                cart.classList.remove("shoppinglist");
                console.log("Bevásárló listáról eltávolítva!");
            } else {
                await updateDoc(userRef, {
                    shoppingList: arrayUnion(recipeId),
                });
                cart.classList.add("shoppinglist");
                console.log("Bevásárló listához adva!");
            }
        } else {
            console.error("Nincs ilyen felhasználó az adatbázisban.");
        }
    } catch (error) {
        console.error("Hiba történt a kosár kattintásakor: " + error);
    }
}

export function shoppingList() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(database, "users", user.uid);
            const userSnap = await getDoc(userRef);
            const recipeSnapshot = await getDocs(collection(database, "recipes"));

            if (userSnap.exists()) {
                const userData = userSnap.data();
                const cartRecipes = userData.shoppingList || [];
                const cartContainer = document.getElementById("cartRecipes");
                const shoppingList = document.getElementById("myShoppingList");
                cartContainer.innerHTML = "";
                shoppingList.innerHTML = "";

                cartRecipes.forEach((recipeId) => {
                    recipeSnapshot.forEach((doc) => {
                        const recipe = doc.data();
                        if (recipeId === recipe.recipeId) {
                            if (recipe.ingredients && recipe.ingredients.length > 0) {
                                recipe.ingredients.forEach(ingredient => {
                                    const li = document.createElement("li");
                                    li.textContent = `${ingredient.amount} ${ingredient.unit} ${ingredient.ingredientName}`;
                                    shoppingList.appendChild(li);
                                });
                            } else {
                                shoppingList.innerHTML = "<li>Nincsenek hozzávalók.</li>";
                            }

                            const cartBox = document.createElement("div");
                            cartBox.classList.add("c-box");
                            cartBox.innerHTML = `
                                <img src="${recipe.imgUrl}" alt="${recipe.recipeName}">
                                <h3>${recipe.recipeName}</h3>
                            `;
                            cartContainer.appendChild(cartBox);
                        }
                    });
                });
            } else {
                console.log("Nincsenek adatok a Firestore-ban!");
            }
        } else {
            console.log("Felhasználó nincs bejelentkezve!");
        }
    });
}