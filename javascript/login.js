import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

if (window.location.pathname.includes("login")) {
    import("../css/login.css");
}

const auth = getAuth();

export function handleLogIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Bejelentkezve: " + user.email);
            localStorage.setItem("isLoggedIn", "true")
            window.location.href = "/index.html";
        })
        .catch((error) => {
            console.error("Hiba a bejelentkezéskor: ", error);
            alert("Hibás e-mail cím vagy jelszó!");
        });
}

export function updateMenu(isLoggedIn) {
    const menuWhatmeal = document.getElementById("menu-whatmeal");
    const menuShoppinglist = document.getElementById("menu-shoppinglist");
    const menuBlog = document.getElementById("menu-blog");
    const menuLogin = document.getElementById("menu-login");
    const menuRegistration = document.getElementById("menu-registration");
    const menuProfile = document.getElementById("menu-profile");
    const menuLogout = document.getElementById("menu-logout");

    if (isLoggedIn) {
        menuWhatmeal.style.display = "inline-block";
        menuShoppinglist.style.display = "inline-block";
        menuBlog.style.display = "inline-block";
        menuProfile.style.display = "inline-block";
        menuLogout.style.display = "inline-block";
        menuLogin.style.display = "none";
        menuRegistration.style.display = "none";
    } else {
        menuWhatmeal.style.display = "none";
        menuShoppinglist.style.display = "none";
        menuBlog.style.display = "none";
        menuProfile.style.display = "none";
        menuLogout.style.display = "none";
        menuLogin.style.display = "inline-block";
        menuRegistration.style.display = "inline-block";
    }

    if (menuLogout) {
        menuLogout.addEventListener("click", () => {
            auth.signOut().then(() => {
                console.log("Sikeres kijelentkezés");
                updateMenu(false);
                localStorage.removeItem("isLoggedIn");
            }).catch((error) => {
                console.error("Hiba a kijelentkezéskor!", error);
            });
        });
    }
}