import { database } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";
import "../css/recipes.css";

let recipes = [];

export async function listingRecipes() {
    const querySnapshot = await getDocs(collection(database, "recipes"));


    querySnapshot.forEach((doc) => {
        const recipe = doc.data();
        recipes.push(recipe);
    });

    const searchingText = sessionStorage.getItem("search") || "";
    sessionStorage.removeItem("search");

    if (searchingText) {
        const filteredRecipes = recipes.filter(recipe =>
            recipe.recipeName.toLowerCase().includes(searchingText.toLowerCase())
        );
        showRecipe(filteredRecipes);
    } else {
        showRecipe(recipes);
    }
}

function showRecipe(recipeList) {
    const recipeContainer = document.getElementById("recipe-container");
    recipeContainer.innerHTML = "";

    recipeList.forEach((recipe) => {
        const recipeBox = document.createElement("div");
        recipeBox.classList.add("recipe-box");
        recipeBox.innerHTML = `
            <img src="${recipe.imgUrl}" alt="${recipe.recipeName}">
            <h3>${recipe.recipeName}</h3>
            <p>Elkészítési idő: ${recipe.cookingTime}</p>
        `;

        recipeBox.addEventListener("click", () => {
            window.location.href = "/recipe.html";
        });

        recipeContainer.appendChild(recipeBox);
    });
}