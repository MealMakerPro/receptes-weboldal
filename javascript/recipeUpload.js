import { database } from './firebase-config';
import "../css/recipeUpload.css";
import {doc, setDoc} from "firebase/firestore";

export function addIngredient() {
    const ingredientsDiv = document.getElementById('ingredients');
    const newIngredient = document.createElement('div');
    newIngredient.classList.add('ingredient');
    newIngredient.innerHTML = `
        <input type="number" class="amount" placeholder="Mennyiség" required>
        <input type="text" class="unit" placeholder="Mértékegység" required>
        <input type="text" class="ingredientName" placeholder="Hozzávaló neve" required>
    `;
    ingredientsDiv.appendChild(newIngredient);
}

export async function submitRecipe(recipeName, instructions, cookingTime, ingredients) {
    try {
        const recipeRef = doc(database, "recipes", recipeName.toLowerCase().replace(/\s+/g, "_"));
        const recipeData = {
            recipeName: recipeName,
            instructions: instructions,
            cookingTime: cookingTime,
            ingredients: ingredients,
        };
        await setDoc(recipeRef, recipeData);
        console.log("Recept sikeresen mentve!");
        document.getElementById('recipeForm').reset();
        document.getElementById('ingredients').innerHTML = "";
        addIngredient();
    } catch (error) {
        console.error('Hiba a recept mentésekor:', error);
        alert("Hiba történt a mentés során!");
    }
}
