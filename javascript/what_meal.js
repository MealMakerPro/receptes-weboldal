import {collection, getDocs} from "firebase/firestore";
import {database} from "./firebase-config";

export async function selectedIngredients(checkboxes, container) {
    const selectedIngredients = Array.from(checkboxes).map(cb => cb.value.toLowerCase());

    const querySnapshot = await getDocs(collection(database, "recipes"));

    const matches = [];

    querySnapshot.forEach((doc) => {
        const recipe = doc.data();
        const ingredients = recipe.ingredients || [];

        const matchCount = ingredients.filter(item =>
            selectedIngredients.includes(item.ingredientName.toLowerCase())
        ).length;

        if (matchCount > 0) {
            matches.push({
                id: doc.id,
                name: recipe.recipeName,
                imageUrl: recipe.imgUrl || "",
                matchCount,
                recipe
            });
        }
    });

    matches.sort((a, b) => b.matchCount - a.matchCount);

    container.innerHTML = "";

    if (matches.length === 0) {
        container.innerHTML = "<p>Nincs találat.</p>";
    } else {
        matches.forEach(match => {
            const card = document.createElement("div");
            card.classList.add("recipe-card");

            card.innerHTML = `
        ${match.imageUrl ? `<img src="${match.imageUrl}" alt="${match.name}" style="width:100%; border-radius:8px;">` : ""}
        <h3>${match.name}</h3>
        <p>Egyező hozzávalók száma: ${match.matchCount}</p>
      `;

            card.addEventListener("click", () => {
                window.location.href = `recipe.html?nev=${match.name}`;
            });

            container.appendChild(card);
        });
    }
}