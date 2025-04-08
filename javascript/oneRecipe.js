import "../css/recipe.css";
import {database, storage} from "./firebase-config";
import {arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

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
                showOneRecipe(doc, urlParams);
            } else {
                console.log(oneRecipe);
                console.error("Nincs ilyen recept.");
            }
        } catch (error) {
            console.error("Hiba történt a lekérés során:", error);
        }
    }
}

function showOneRecipe(data, urlParams) {
    document.getElementById("recipeName").textContent = data.recipeName;
    document.getElementById("recipeImg").src = data.imgUrl;
    document.getElementById("cookingTime").textContent = data.cookingTime;
    document.getElementById("instructions").textContent = data.instructions;
    document.getElementById("recipeId").textContent = data.recipeId;

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

    const gallery = document.getElementById("user-photo-gallery");
    if (data.finishedImages && data.finishedImages.length > 0) {
        data.finishedImages.forEach(finishedImage => {
            const imageBox = document.createElement("img");
            imageBox.src = finishedImage;
            imageBox.alt = "Felhasználói kép";
            gallery.appendChild(imageBox);
        });
    }

    const editMode = urlParams.get("edit") === "true";
    const saveBtn = document.getElementById("saveButton");

    if (editMode) {
        const recipeNameElement = document.getElementById("recipeName");
        const instructionsElement = document.getElementById("instructions");
        const cookingTimeElement = document.getElementById("cookingTime");

        recipeNameElement.setAttribute("contenteditable", "true");
        instructionsElement.setAttribute("contenteditable", "true");
        cookingTimeElement.setAttribute("contenteditable", "true");
        saveBtn.style.display = "inline-block";
    }
}

function formatRecipeName(name) {
    return name.toLowerCase().replace(/\s+/g, "_");
}

export async function uploadFinishedImages(finishedImage, recipeId) {
    try {
        const storageRef = ref(storage, `finishedImages/${finishedImage.name}`);
        await uploadBytes(storageRef, finishedImage);
        const imgUrl = await getDownloadURL(storageRef);
        const recipeRef = doc(database, "recipes", recipeId);
        const recipeSnap = await getDoc(recipeRef);

        if (recipeSnap.exists()) {
            await updateDoc(recipeRef, {
                finishedImages: arrayUnion(imgUrl),
            });
        }
    } catch (error) {
        console.error("Hiba az elkészült étel fotó feltöltésénél: " + error);
    }
}