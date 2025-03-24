import "../css/blog.css";
import { auth, database } from "./firebase-config";
import {doc, setDoc, Timestamp} from "firebase/firestore";

export async function createBlogPost(postName, postBody) {
    try {
        const user = auth.currentUser;
        const blogRef = doc(database, "posts", postName.toLowerCase().replace(/\s+/g, "_"));
        const postData = {
            postName: postName,
            postBody: postBody,
            creator: user.email,
            createdAt: Timestamp.now(),
        };

        await setDoc(blogRef, postData);
        console.log("Blogbejegyzés sikeresen létrehozva!");
        alert("Blogbejegyzés sikeres mentése.");
        document.getElementById("blogPostForm").reset();
    } catch (error) {
        console.error("Hiba a bejegyzés létrehozásánál: ", error);
        alert("Hiba a bejegyzés létrehozásakor!");
    }
}