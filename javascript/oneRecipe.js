import "../css/recipe.css";
import { database } from "./firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function listOneRecipe() {
    const urlParams = new URLSearchParams(window.location.search);
    const oneRecipe = urlParams.get("nev");
    formatRecipeName(oneRecipe);

    if (oneRecipe) {
        try {
            const q = query(collection(database, "recipes"), where("recipeName", "==", oneRecipe));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0].data();
                showOneRecipe(doc);
            } else {
                console.log(oneRecipe);
                console.error("Nincs ilyen recept.");
            }
        } catch (error) {
            console.error("Hiba történt a lekérés során:", error);
        }
    }
}

function showOneRecipe(data) {
    document.getElementById("recipeName").textContent = data.recipeName;
    document.getElementById("recipeImg").src = data.imgUrl;
    document.getElementById("cookingTime").textContent = data.cookingTime;
    document.getElementById("instructions").textContent = data.instructions;

    const ingredientsList = document.getElementById("ingredients");
    ingredientsList.innerHTML = "";

    if (data.ingredients && data.ingredients.length > 0) {
        data.ingredients.forEach(ingredient => {
            const li = document.createElement("li");
            li.textContent = `${ingredient.amount} ${ingredient.unit} ${ingredient.ingredientName}`;
            ingredientsList.appendChild(li);
        });
    } else {
        ingredientsList.innerHTML = "<li>Nincsenek hozzávalók.</li>";
    }
}

function formatRecipeName(name) {
    return name.toLowerCase().replace(/\s+/g, "_");
}