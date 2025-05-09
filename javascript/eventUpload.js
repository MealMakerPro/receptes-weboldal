import "../css/eventUpload.css";
import {database} from "./firebase-config";
import {doc, setDoc} from "firebase/firestore";

export async function uploadEvents(eventName, eventDate, eventPlace, eventText) {
    try {
        const eventRef = doc(database, "events", eventName.toLowerCase().replace(/\s+/g, "_"));
        const eventData = {
            eventName: eventName,
            eventDate: eventDate,
            eventPlace: eventPlace,
            eventText: eventText,
        };

        await setDoc(eventRef, eventData);
        console.log("Esemény sikeresen mentve!");
        setTimeout(() => {
            location.reload();
        }, 500);
    } catch (error) {
        console.error('Hiba az esemény mentésekor:', error);
        alert("Hiba történt az esemény mentése során!");
    }
}