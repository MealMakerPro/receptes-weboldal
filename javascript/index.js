import { handleRegistration } from "./registration";
import {handleLogIn, updateMenu} from "./login";
import { loadUserProfile } from "./profile";
import "../css/all_pages.css";
import header from "../img/name.png";
import {addIngredient, submitRecipe} from "./recipeUpload";

document.getElementById('headerImg').src = header;

if (document.getElementById('indexPage')) {
    import("../css/index.css");
}

if (document.body.id === "profilePage") {
    loadUserProfile();
}

document.addEventListener("DOMContentLoaded", () => {
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
});

document.addEventListener("DOMContentLoaded", () => {
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
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("recipeForm");
    const addIngredientBtn = document.getElementById("addIngredientBtn");
    addIngredientBtn.addEventListener("click", addIngredient);

    if (form) {
        form.addEventListener("submit", (e) => {
            submitRecipe(e);
        });
    }
});

