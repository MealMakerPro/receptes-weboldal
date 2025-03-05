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

export async function submitRecipe(event) {
    event.preventDefault();

    const recipeName = document.getElementById('recipeName').value.trim();
    const instructions = document.getElementById('instructions').value.trim();
    const cookingTime = document.getElementById('cookingTime').value.trim();

    const ingredients = [];
    document.querySelectorAll('.ingredient').forEach(ingredientElement => {
        const amount = ingredientElement.querySelector('.amount').value.trim();
        const unit = ingredientElement.querySelector('.unit').value.trim();
        const ingredientName = ingredientElement.querySelector('.ingredientName').value.trim();

        if (amount && unit && ingredientName) {
            ingredients.push({ amount, unit, ingredientName });
        }
    });

    if (!recipeName || !instructions || !cookingTime || ingredients.length === 0) {
        alert("Kérlek, tölts ki minden mezőt és adj hozzá legalább egy hozzávalót!");
        return;
    }

    try {
        const recipeRef = doc(database, "recipes", recipeName.toLowerCase().replace(/\s+/g, "_"));

        await setDoc(recipeRef, {
            recipeName,
            ingredients,
            instructions,
            cookingTime
        });

        alert('Recept sikeresen mentve!');
        document.getElementById('recipeForm').reset();
        document.getElementById('ingredients').innerHTML = "";
        addIngredient();

    } catch (error) {
        console.error('Hiba a recept mentésekor:', error);
        alert("Hiba történt a mentés során!");
    }
}
