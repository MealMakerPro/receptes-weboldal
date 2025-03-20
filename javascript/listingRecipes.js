import { database } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";
import "../css/recipes.css";

export async function listingRecipes() {
    const querySnapshot = await getDocs(collection(database, "recipes"));
    const recipeContainer = document.getElementById("recipe-container");
    recipeContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const recipe = doc.data();

        const recipeBox = document.createElement("div");
        recipeBox.classList.add("recipe-box");
        recipeBox.innerHTML = `
            <img src="${recipe.imgUrl}" alt="${recipe.recipeName}">
            <h3>${recipe.recipeName}</h3>
            <p>Elkészítési idő: ${recipe.cookingTime}</p>
        `;

        recipeBox.addEventListener("click", () => {
            window.location.href = "../html/oneRecipe.html";
        });

        recipeContainer.appendChild(recipeBox);
    });
}