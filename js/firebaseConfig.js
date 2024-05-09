import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDocs, collection } from "firebase/firestore"; 



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



async function traerLicenciasRestantes() {
  let datos = [];
  try {
      const querySnapshot = await getDocs(collection(db, 'licencias'));
      querySnapshot.forEach((doc) => {
          // console.log(doc.id, ' => ', doc.data());
          let data = doc.data();
          datos.push(data); // Almacena los datos en un array
      });
      return datos; // Devuelve el array de datos después de que se hayan agregado todos los documentos
  } catch (error) {
      console.error('Error obteniendo documentos: ', error);
      throw error; // Lanza el error para que sea manejado por la llamada de la función
  }
}
  

  export { traerLicenciasRestantes }

  