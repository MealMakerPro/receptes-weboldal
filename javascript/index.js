import { handleRegistration } from "./registration";
import {handleLogIn} from "./login";
import "../css/all_pages.css";
import header from "../img/name.png";

document.getElementById('headerImg').src = header;

document.addEventListener("DOMContentLoaded", handleRegistration);
document.addEventListener("DOMContentLoaded", handleLogIn);

document.getElementById("registrationForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    handleRegistration(name, email, username, password);
})

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    handleLogIn(email, password);
})