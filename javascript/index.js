import { handleRegistration } from "./registration";
import { handleLogIn, updateMenu } from "./login";
import {listMyRecipes, loadUserProfile} from "./profile";
import "../css/all_pages.css";
import header from "../img/name.png";
import indexImg from "../img/indexImg.jpg";
import { addIngredient, submitRecipe } from "./recipeUpload";
import { submitDonation } from "./donation";
import {getLatestRecipes, listingRecipes} from "./listingRecipes";
import {listOneRecipe, uploadFinishedImages} from "./oneRecipe";
import {createBlogPost, showBlogPosts} from "./blog";
import {checkFavoriteStatus, toggleFavorites} from "./pickFav";
import {auth} from "./firebase-config";
import {onAuthStateChanged} from "firebase/auth";
import {checkCartStatus, shoppingList, toggleCartList} from "./makingShoppingList";

document.getElementById('headerImg').src = header;

if (document.getElementById('indexPage')) {
    import("../css/index.css");
    document.getElementById('indexImg').src = indexImg;
    getLatestRecipes().then(() => {
        console.log("Legfrisebb receptek betöltése sikeres.");
    }).catch((error) => {
        console.error("Hiba a legfrisebb receptek betöltésekor: ", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    registration();
    login();

    if (document.body.id === "profilePage") {
        loadUserProfile();
        listMyRecipes().then(() => {
            console.log("Receptjeim sikeres betöltése.");
        }).catch((error) => {
            console.error("Hiba történt a receptjeim betöltésekor: ", error);
        });
    }

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

    if (document.getElementById("shopping-list")) {
        shoppingList();
    }

    if (document.getElementById("oneRecipe")) {
        listOneRecipe().then(() => {
            console.log("Recept sikeresen betöltve!");
            onAuthStateChanged(auth, (user) => {
                const recipeId = document.getElementById("recipeId").textContent.trim();
                const heart = document.getElementById("heart");
                const cart = document.getElementById("cart");

                if (user) {
                    checkFavoriteStatus(user, recipeId, heart).then(() => {
                        console.log("Sikeres kedvencbetöltés!");
                    }).catch((error) => {
                        console.error("Hiba a kedvenc betöltésekor: ", error);
                    });

                    checkCartStatus(user, recipeId, cart).then(() => {
                        console.log("Sikeres kosárbetöltés!");
                    }).catch((error) => {
                        console.error("Hiba a kosár betöltésekor: ", error);
                    });

                    if (heart) {
                        heart.addEventListener("click", () => {
                            toggleFavorites(user, recipeId, heart).then(() => {
                                console.log("Recept sikeresen kedvencnek választva!");
                            }).catch((error) => {
                                console.error("Hiba történt a kedvencnek választáskor: ", error);
                            });
                        });
                    }

                    if (cart) {
                        cart.addEventListener("click", () => {
                            toggleCartList(user, recipeId, cart).then(() => {
                                console.log("Recept sikeresen bevásárló listához adva");
                            }).catch((error) => {
                                console.error("Hiba történt a bevásárló listához adáskor: " + error);
                            });
                        });
                    }
                } else {
                    console.log("Nincs bejelentkezett felhasználó!");
                }
            });
        }).catch((error) => {
            console.error("Hiba történt a recept betöltésekor:", error);
        });

        const finishedBttn = document.getElementById("finishedImgButton");
        finishedBttn.addEventListener("click", () => {
            const img = document.getElementById("finishedRecipeImage").files[0];
            const recipeId = document.getElementById("recipeId").textContent.trim();
            uploadFinishedImages(img, recipeId).then(() => {
                console.log("Sikeres elkészült fotó feltöltés!");
            }).catch((error) => {
                console.error("Hiba az elkészült fotó feltöltésekor: " + error);
            });
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