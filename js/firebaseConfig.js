import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 



const firebaseConfig = {
  apiKey: "AIzaSyBRH5BYZQxdIA050jpfcHFH3z8XGAKy6CA",
  authDomain: "calendario-affd4.firebaseapp.com",
  projectId: "calendario-affd4",
  storageBucket: "calendario-affd4.appspot.com",
  messagingSenderId: "930157714609",
  appId: "1:930157714609:web:f95c4c46bed9796fa89690",
  measurementId: "G-T1ZXT6N2G7"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

await setDoc(doc(db, "cities", "LA"), {
    name: "Los Angeles",
    state: "CA",
    country: "USdA"
  });