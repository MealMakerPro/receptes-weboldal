import "../css/events.css";
import {collection, getDocs} from "firebase/firestore";
import {database} from "./firebase-config";

export async function listEvents() {
    const eventsSnapshot = await getDocs(collection(database, "events"));
    const eventsList = [];
    const eventContainer = document.getElementById("events-container");
    eventContainer.innerHTML = "";

    eventsSnapshot.forEach((doc) => {
        const event = doc.data();
        eventsList.push(event);
    });

    eventsList.forEach((event) => {
        const eventBox = document.createElement("div");
        eventBox.classList.add("event-box");
        eventBox.innerHTML = `
            <h3>${event.eventName}</h3>
            <h4>Időpont: ${event.eventDate}</h4>
            <h4>Helyszín: ${event.eventPlace}</h4>
            <p>Leírás: ${event.eventText}</p>
        `;

        eventContainer.appendChild(eventBox);
    });
}