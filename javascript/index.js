import { handleRegistration } from "./registration";
import {handleLogIn} from "./login";
import "../css/all_pages.css";
import headerImg from '../img/name.png';
import logoImg from '../img/logo.png';

const imgElements = [
    {src: headerImg, id: headerImg},
    {src: logoImg, id: logoImg},
];

imgElements.forEach(image => {
    const element = document.getElementById(image.id);
    const imgElement = document.createElement('img');
    imgElement.src = image.src;
    element.appendChild(imgElement);
});

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