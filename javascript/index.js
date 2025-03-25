import { handleRegistration } from "./registration";
import { handleLogIn, updateMenu } from "./login";
import {listMyRecipes, loadUserProfile} from "./profile";
import "../css/all_pages.css";
import header from "../img/name.png";
import indexImg from "../img/indexImg.jpg";
import { addIngredient, submitRecipe } from "./recipeUpload";
import { submitDonation } from "./donation";
import {listingRecipes} from "./listingRecipes";
import {listOneRecipe} from "./oneRecipe";
import {createBlogPost, showBlogPosts} from "./blog";

document.getElementById('headerImg').src = header;

if (document.getElementById('indexPage')) {
    import("../css/index.css");
    document.getElementById('indexImg').src = indexImg;
}

if (document.body.id === "profilePage") {
    loadUserProfile();
    listMyRecipes().then(() => {
        console.log("Receptjeim sikeres betöltése.");
    }).catch((error) => {
        console.error("Hiba történt a receptjeim betöltésekor: ", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    registration();
    login();
    addRecipe();
    createPosts();

    if (document.getElementById("blog")) {
        showBlogPosts().then(() => {
            console.log("Blogbejegyzések sikeresen betöltve!");
        }).catch((error) => {
            console.error("Hiba történt a blogbejegyzések betöltésekor: ", error);
        });
    }

    donation();

    if (document.getElementById("oneRecipe")) {
        listOneRecipe().then(() => {
            console.log("Recept sikeresen betöltve!");
        }).catch((error) => {
            console.error("Hiba történt a recept betöltésekor:", error);
        });
    }

    const id = document.getElementById("fetchRecipes");
    const form = document.getElementById("search");
    if (form) {
        searchAndListRecipe(form);
    } else {
        if (id) {
            listingRecipes().then(() => {
                console.log("Receptek sikeresen betöltve!");
            })
                .catch((error) => {
                    console.error("Hiba történt a receptek betöltésekor:", error);
                });
        }
    }
});

function searchAndListRecipe(form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchingValue = document.getElementById("indexSearchText").value.trim();
        if (searchingValue) {
            sessionStorage.setItem("search", searchingValue);
            window.location.href = "../recipes.html";
        } else {
            alert("Írj be valamit a keresőbe!");
        }
    });
}

function registration() {
    const form = document.getElementById("registrationForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            handleRegistration(name, email, username, password);
        });
    }
}

function login() {
    const form = document.getElementById("loginForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            handleLogIn(email, password);
        });
    }

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    updateMenu(isLoggedIn);
}

function addRecipe() {
    const form = document.getElementById("recipeForm");
    if (form) {
        const addIngredientBtn = document.getElementById("addIngredientBtn");
        addIngredientBtn.addEventListener("click", addIngredient);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
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
            const recipeImage = document.getElementById("recipeImage").files[0];

            if (!recipeName || !instructions || !cookingTime || ingredients.length === 0 || !recipeImage) {
                alert("Kérlek, tölts ki minden mezőt és adj hozzá legalább egy hozzávalót és egy képet!");
                return;
            }

            await submitRecipe(recipeName, instructions, cookingTime, ingredients, recipeImage);
        });
    }
}

function createPosts() {
    const form = document.getElementById("blogPostForm");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const postName = document.getElementById("postName").value.trim();
            const postBody = document.getElementById("postBody").value.trim();

            if (!postName || !postBody) {
                alert("Kérlek tölts ki minden mezőt!");
                return;
            }

            await createBlogPost(postName, postBody);
        });
    }
}

function donation() {
    const form = document.getElementById("donationForm");
    if (form) {
        form.addEventListener("submit",  async (e) => {
            e.preventDefault();
            const amount = document.getElementById("donationAmount").value.trim();
            await submitDonation(amount);
            setTimeout(() => {
                location.reload();
            }, 500);
        });
    }
}