import { handleRegistration } from "./registration";
import { handleLogIn, updateMenu } from "./login";
import {listMyRecipes, listUsers, loadUserProfile} from "./profile";
import "../css/all_pages.css";
import header from "../img/name.png";
import indexImg from "../img/indexImg.jpg";
import { addIngredient, submitRecipe } from "./recipeUpload";
import { submitDonation } from "./donation";
import {getLatestRecipes, listingRecipes} from "./listingRecipes";
import {listOneRecipe, rating, showAvarage, uploadFinishedImages} from "./oneRecipe";
import {createBlogPost, showBlogPosts} from "./blog";
import {checkFavoriteStatus, toggleFavorites} from "./pickFav";
import {auth, database} from "./firebase-config";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {checkCartStatus, shoppingList, toggleCartList} from "./makingShoppingList";
import {selectedIngredients} from "./what_meal";
import {uploadEvents} from "./eventUpload";
import {listEvents} from "./events";
import {doc, getDoc, updateDoc} from "firebase/firestore";

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

if (document.getElementById("what-meal")) {
    import("../css/what_meal.css");
}

document.addEventListener("DOMContentLoaded", () => {
    registration();
    login();
    eventUp();

    if (document.body.id === "profilePage") {
        loadUserProfile();
        listMyRecipes().then(() => {
            console.log("Receptjeim sikeres betöltése.");
        }).catch((error) => {
            console.error("Hiba történt a receptjeim betöltésekor: ", error);
        });
        listUsers().then(() => {
            console.log("Felhasználók sikeres betöltése.");
        }).catch((error) => {
            console.error("Hiba történt a felhasználók betöltésekor: ", error);
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

    if (document.getElementById("events")) {
        listEvents().then(() => {
            console.log("Események sikeresen betöltve!");
        }).catch((error) => {
            console.error("Hiba történt az események betöltésekor: ", error);
        });
    }

    donation();

    if (document.getElementById("shopping-list")) {
        shoppingList();
    }

    if (document.getElementById("what-meal")) {
        document.getElementById("searchMat").addEventListener("click", async () => {
            const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
            const container = document.getElementById("recipeResults");

            await selectedIngredients(checkboxes, container);
        });
    }

    if (document.getElementById("oneRecipe")) {
        listOneRecipe().then(() => {
            console.log("Recept sikeresen betöltve!");
            onAuthStateChanged(auth, (user) => {
                const recipeId = document.getElementById("recipeId").textContent.trim();
                const heart = document.getElementById("heart");
                const cart = document.getElementById("cart");
                const ratingIcons = document.querySelectorAll(".rating-icon");
                const finishedBttn = document.getElementById("finishedImgButton");
                const saveBttn = document.getElementById("saveButton");

                showAvarage(recipeId).then(() => {
                    console.log("Sikeres értékelés kiírása!");
                }).catch((error) => {
                    console.error("Hiba az értékelés kiírásakor: ", error);
                });

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
                }

                if (heart) {
                    heart.addEventListener("click", () => {
                        if (!user) {
                            alert("Kérlek jelentkezz be!");
                            document.location.href = `login.html`;
                        }
                        toggleFavorites(user, recipeId, heart).then(() => {
                            console.log("Recept sikeresen kedvencnek választva!");
                        }).catch((error) => {
                            console.error("Hiba történt a kedvencnek választáskor: ", error);
                        });
                    });
                }

                if (cart) {
                    cart.addEventListener("click", () => {
                        if (!user) {
                            alert("Kérlek jelentkezz be!");
                            document.location.href = `login.html`;
                        }
                        toggleCartList(user, recipeId, cart).then(() => {
                            console.log("Recept sikeresen bevásárló listához adva");
                        }).catch((error) => {
                            console.error("Hiba történt a bevásárló listához adáskor: " + error);
                        });
                    });
                }

                if (ratingIcons) {
                    ratingIcons.forEach(icon => {
                        icon.addEventListener("click", () => {
                            if (!user) {
                                alert("Kérlek jelentkezz be!");
                                document.location.href = `login.html`;
                            }
                            rating(ratingIcons, icon, recipeId).then(() => {
                                console.log("Sikeres értékelés!");

                            }).catch((error) => {
                                console.error("Hiba történt értékeléskor: " + error);
                            });
                        });
                    });
                }

                saveBttn.addEventListener("click", async () => {
                    const recipeName = document.getElementById("recipeName").textContent.trim();
                    const instructions = document.getElementById("instructions").textContent.trim();
                    const cookingTime = document.getElementById("cookingTime").textContent.trim();

                    const recipeRef = doc(database, "recipes", recipeId);

                    try {
                        await updateDoc(recipeRef, {
                            recipeName: recipeName,
                            instructions: instructions,
                            cookingTime: cookingTime,
                        });
                        alert("Recept sikeresen frissítve!");
                        document.location.href = `profile.html`;
                    } catch (error) {
                        console.error("Hiba a mentéskor:", error);
                        alert("Hiba történt a mentés során.");
                    }
                });

                finishedBttn.addEventListener("click", () => {
                    if (!user) {
                        alert("Kérlek jelentkezz be!");
                        document.location.href = `login.html`;
                    }

                    const img = document.getElementById("finishedRecipeImage").files[0];
                    const recipeId = document.getElementById("recipeId").textContent.trim();
                    uploadFinishedImages(img, recipeId).then(() => {
                        console.log("Sikeres elkészült fotó feltöltés!");
                        alert("Sikeres képfeltöltés!");
                        setTimeout(() => {
                            location.reload();
                        }, 500);
                    }).catch((error) => {
                        console.error("Hiba az elkészült fotó feltöltésekor: " + error);
                    });
                });
            });
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

function eventUp() {
    const form = document.getElementById("eventUploadForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("event-name").value;
            const date = document.getElementById("event-date").value;
            const place = document.getElementById("event-place").value;
            const text = document.getElementById("event-text").value;

            uploadEvents(name, date, place, text).then(() => {
                console.log("Esemény sikeresen mentve");
            }).catch((error) => {
                console.error("Hiba történt az esemény mentésekor: " + error);
            });
        });
    }
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
        form.addEventListener("submit", async (e) => {
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