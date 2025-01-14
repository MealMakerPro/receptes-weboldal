import { handleRegistration } from "./registration";
import "../css/all_pages.css";

document.getElementById("registrationForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    handleRegistration(name, email, username, password);
})