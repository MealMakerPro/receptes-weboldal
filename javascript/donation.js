import { getFirestore, doc, runTransaction } from "firebase/firestore";

const database = getFirestore();

export async function submitDonation(amount) {
    const donationRef = doc(database, "donations", "summary");
    try {
        await runTransaction(database, async (transaction) => {
            const docSnap = await transaction.get(donationRef);
            let newTotal = Number(amount);

            if (docSnap.exists()) {
                const currentTotal = Number(docSnap.data().totalAmount);
                newTotal += currentTotal;
            }
            transaction.set(donationRef, {totalAmount: newTotal}, {merge: true});
        });
        console.log("Adomány sikeresen hozzáadva!");
        alert("Köszönjük az adományt!");
    } catch (error) {
        console.error("Hiba történt az adomány feldolgozása közben!", error);
    }
}