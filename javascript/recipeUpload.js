import { database, auth, storage } from './firebase-config';
import "../css/recipeUpload.css";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

export async function submitRecipe(recipeName, instructions, cookingTime, ingredients, recipeImage) {
    try {
        const user = auth.currentUser;

        const storageRef = ref(storage, `receptek_kepek/${recipeImage.name}`);
        await uploadBytes(storageRef, recipeImage);
        const imgUrl = await getDownloadURL(storageRef);

        const recipeRef = doc(database, "recipes", recipeName.toLowerCase().replace(/\s+/g, "_"));
        const recipeData = {
            recipeName: recipeName,
            instructions: instructions,
            cookingTime: cookingTime,
            ingredients: ingredients,
            imgUrl: imgUrl,
            createdAt: new Date().toISOString(),
            userId: user.uid,
            userEmail: user.email,
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
