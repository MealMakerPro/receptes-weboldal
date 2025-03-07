import { handleRegistration } from "./registration";
import {handleLogIn, updateMenu} from "./login";
import { loadUserProfile } from "./profile";
import "../css/all_pages.css";
import header from "../img/name.png";
import {addIngredient, submitRecipe} from "./recipeUpload";
import {submitDonation} from "./donation";

document.getElementById('headerImg').src = header;

if (document.getElementById('indexPage')) {
    import("../css/index.css");
}

if (document.body.id === "profilePage") {
    loadUserProfile();
}

document.addEventListener("DOMContentLoaded", () => {
    registration();
    login();
    addRecipe();
    donation();
});

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
            setTimeout(() => {
                location.reload();
            }, 500);
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

            if (!recipeName || !instructions || !cookingTime || ingredients.length === 0) {
                alert("Kérlek, tölts ki minden mezőt és adj hozzá legalább egy hozzávalót!");
                return;
            }

            await submitRecipe(recipeName, instructions, cookingTime, ingredients, name);
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