import { database, auth } from "./firebase-config";
import {onAuthStateChanged} from "firebase/auth";
import {collection, doc, getDoc, getDocs, deleteDoc} from "firebase/firestore";
import "../css/profile.css";

export function loadUserProfile() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(database, "users", user.uid);
            const userSnap = await getDoc(userRef);
            const recipeSnapshot = await getDocs(collection(database, "recipes"));

            if (userSnap.exists()) {
                const userData = userSnap.data();
                const favRecipes = userData.favoriteRecipes || [];
                const favContainer = document.getElementById("favoriteRecipes");
                favContainer.innerHTML = "";

                document.getElementById("name").innerText = userData.name || "N/A";
                document.getElementById("email").innerText = userData.email || "N/A";
                document.getElementById("username").innerText = userData.username || "N/A";

                favRecipes.forEach((recipeId) => {
                    recipeSnapshot.forEach((doc) => {
                        const recipe = doc.data();
                        if (recipeId === recipe.recipeId) {
                            const favBox = document.createElement("div");
                            favBox.classList.add("fav-box");
                            favBox.innerHTML = `
                                <img src="${recipe.imgUrl}" alt="${recipe.recipeName}">
                                <h3>${recipe.recipeName}</h3>
                            `;
                            favContainer.appendChild(favBox);

                            favContainer.addEventListener("click", () => {
                                window.location.href = `/recipe.html?nev=${recipe.recipeName}`;
                            });
                        }
                    });
                });
            } else {
                console.log("Nincsenek adatok a Firestore-ban!");
            }
        } else {
            console.log("Felhasználó nincs bejelentkezve!");
        }
        if (user.email === "admin@admin.com") {
            const donationRef = doc(database, "donations", "summary");
            const donationSnap = await getDoc(donationRef);

            document.getElementById("donationText").style.display = "block";

            if (donationSnap.exists()) {
                const donationData = donationSnap.data();

                document.getElementById("donationSum").innerText = donationData.totalAmount || "N/A";
            }
        }
    });
}

export async function listMyRecipes() {
    const recipeSnapshot = await getDocs(collection(database, "recipes"));
    const user = auth.currentUser;
    const myRecipes = document.getElementById("myRecipes");
    myRecipes.innerHTML = "";

    recipeSnapshot.forEach((docFor) => {
        const recipe = docFor.data();
        if (user.email === "admin@admin.com") {
            recipeList(recipe, myRecipes);
        } else if (recipe.userEmail === user.email ) {
            recipeList(recipe, myRecipes);
        } else {
            myRecipes.innerHTML = "<li>Nincsenek receptjeid.</li>";
        }
    });
}

function recipeList(recipe, myRecipes) {
    const li = document.createElement("li");
    li.innerHTML = `
                <span>${recipe.recipeName}</span>
                <i class="fa fa-eye eye-button" data-id="${recipe.recipeName}"></i>
                <i class="fa fa-pencil edit-button" data-id="${recipe.recipeName}"></i>
                <i class="fa fa-trash delete-button" data-id="${recipe.recipeId}"></i>
            `;
    myRecipes.appendChild(li);

    document.getElementById("profilePage").addEventListener("click", async (event) => {
        const eyeButton = event.target.closest(".eye-button");
        const editButton = event.target.closest(".edit-button");
        const deleteButton = event.target.closest(".delete-button");
        if (eyeButton) {
            const recipeName = eyeButton.getAttribute("data-id");
            window.location.href = `/recipe.html?nev=${recipeName}`;
        } else if (deleteButton) {
            const recipeId = deleteButton.getAttribute("data-id");
            try {
                const recipeRef = doc(database, "recipes", recipeId);
                await deleteDoc(recipeRef);
                event.target.closest("li").remove();
            } catch (error) {
                console.error("Hiba történt a törlés során:", error);
            }
        } else if (editButton) {
            const recipeName = editButton.getAttribute("data-id");
            window.location.href = `recipe.html?edit=true&nev=${recipeName}`;
        }
    });
}