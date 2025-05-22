import "../css/blog.css";
import { auth, database } from "./firebase-config";
import {collection, deleteDoc, doc, getDoc, getDocs, setDoc, Timestamp} from "firebase/firestore";

export async function createBlogPost(postName, postBody) {
    try {
        const user = auth.currentUser;
        if (user) {
            const userRef = doc(database, "users", user.uid);
            const userSnap = await getDoc(userRef);
            const userName = userSnap.data().username;

            const blogRef = doc(database, "posts", postName.toLowerCase().replace(/\s+/g, "_"));
            const postData = {
                postName: postName,
                postBody: postBody,
                creator: user.email,
                creatorName: userName,
                createdAt: Timestamp.now(),
            };

            await setDoc(blogRef, postData);
            console.log("Blogbejegyzés sikeresen létrehozva!");
            alert("Blogbejegyzés sikeres mentése.");
            setTimeout(() => {
                location.reload();
            }, 500);
        }
    } catch (error) {
        console.error("Hiba a bejegyzés létrehozásánál: ", error);
        alert("Hiba a bejegyzés létrehozásakor!");
    }
}

export async function showBlogPosts() {
    const querySnapshot = await getDocs(collection(database, "posts"));
    const blogContainer = document.getElementById("blog-container");
    blogContainer.innerHTML = "";
    const user = auth.currentUser;

    querySnapshot.forEach((posts) => {
        const post = posts.data();
        const createdAt = post.createdAt.toDate();
        const formattedDate = createdAt.toLocaleString("hu-HU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        if (user.email === "admin@admin.com") {
            const postBox = document.createElement("div");
            postBox.classList.add("post-box");
            postBox.innerHTML = `
            <span><i class="fa fa-trash delete-button-blog" data-id="${post.postName}"></i></span>
            <h3>${post.postName}</h3><br>
            <p>${post.postBody}</p><br>
            <p><strong>Készítette:</strong> ${post.creatorName}<span class="tab"></span><strong>Létrehozva:</strong> ${formattedDate}</p>
        `;
            blogContainer.appendChild(postBox);
            console.log("delete gomb hozzáadva");

            document.getElementById("blog").addEventListener("click", async (event) => {
                const deleteButton = event.target.closest(".delete-button-blog");
                if (deleteButton) {
                    const postId = deleteButton.getAttribute("data-id");
                    try {
                        const blogRef = doc(database, "posts", postId.toLowerCase().replace(/\s+/g, "_"));
                        await deleteDoc(blogRef);
                        event.target.closest("div").remove();
                    } catch (error) {
                        console.error("Hiba történt a blogbejegyzés törlése során:", error);
                    }
                }
            });
        } else {
            const postBox = document.createElement("div");
            postBox.classList.add("post-box");
            postBox.innerHTML = `
            <h3>${post.postName}</h3><br>
            <p>${post.postBody}</p><br>
            <p><strong>Készítette:</strong> ${post.creatorName}<span class="tab"></span><strong>Létrehozva:</strong> ${formattedDate}</p>
        `;
            blogContainer.appendChild(postBox);
        }
    });
}