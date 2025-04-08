import { database } from "./firebase-config";
import {collection, getDocs, query, limit, orderBy} from "firebase/firestore";
import "../css/recipes.css";

let recipes = [];
let latestRecipes = [];

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

export async function getLatestRecipes() {
    const recipeRef = collection(database, "recipes");
    const q = query(recipeRef, orderBy("createdAt", "desc"), limit(3));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        latestRecipes.push(data);
    });

    showRecipe(latestRecipes);
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
            window.location.href = `/recipe.html?nev=${recipe.recipeName}`;
        });

        recipeContainer.appendChild(recipeBox);
    });
}