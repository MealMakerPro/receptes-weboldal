import { handleRegistration } from "./registration";
import {handleLogIn} from "./login";
import "../css/all_pages.css";
import header from "../img/name.png";
import {signInWithEmailAndPassword} from "firebase/auth";

document.getElementById('headerImg').src = header;

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

