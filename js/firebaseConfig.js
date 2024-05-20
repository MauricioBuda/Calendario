import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, addDoc, getDoc, doc, getDocs, collection, updateDoc } from "firebase/firestore"; 
import { sweetAlertOK } from "./sweetAlert";



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
      const querySnapshot = await getDocs(collection(db, 'LICENCIAS'));
      querySnapshot.forEach((doc) => {
          // console.log(doc.id, ' => ', doc.data());
          let data = doc.data();
          data.id = doc.id;
          datos.push(data); // Almacena los datos en un array
      });
      return datos; // Devuelve el array de datos después de que se hayan agregado todos los documentos
  } catch (error) {
      console.error('Error obteniendo documentos: ', error);
      throw error; // Lanza el error para que sea manejado por la llamada de la función
  }
}





// Cargar tarea en Firestore
async function cargarTareaFirestore (licencia, recepcionista, dia, mes, horasExtra, horasDeuda, fechaCreacionConFormato, fechaCreacionSinFormato, nuevaLicencia, fechaDeLicencia, id){

  try {
        let docRef = await addDoc(collection(db, "licenciasCalendario"), {
        licencia: nuevaLicencia.licencia,
        recepcionista: nuevaLicencia.recepcionista,
        dia: nuevaLicencia.dia,
        mes: nuevaLicencia.mes,
        horasExtra: nuevaLicencia.horasExtra,
        horasDeuda: nuevaLicencia.horasDeuda,
        fechaCreacionConFormato: nuevaLicencia.fechaCreacionConFormato,
        fechaCreacionSinFormato: nuevaLicencia.fechaCreacionSinFormato,
        fechaDeLicencia: nuevaLicencia.fechaDeLicencia,
        id: nuevaLicencia.id
        });
    } catch (error) {
        sweetAlertOK("Ocurrió un error, actualice página", "error");
        console.error("Error al agregar la tarea a Firestore", error);
        }
}









async function actualizarNotasMeses(mes, notaNueva) {

  try{

  let docRef =  doc(db, "notas", "vXxa4CEfZT1HKnhNOyre");

    await updateDoc(docRef, {
      [mes]: notaNueva 
    });

  } catch (error) {
      sweetAlertOK("Ocurrió un error, actualice página", "error");
      console.error('Error obteniendo documentos: ', error);
      throw error; // Lanza el error para que sea manejado por la llamada de la función
  }
}
  










async function mostrarNotasDeFirestore(mes) {
  let notaExistente
  try {
    // Obténgo la referencia del documento
    let docRef = doc(db, "notas", "vXxa4CEfZT1HKnhNOyre");

    // Obténgo el documento
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      // Imprime los campos del documento
        let data = docSnap.data();
        for (let campo in data) {
        if (campo.toUpperCase() === mes) {
        notaExistente = data[campo];
        }
      }
    } else {
        console.log("El documento no existe.");
        sweetAlertOK("Ocurrió un error, actualice página", "error");
    }

    return notaExistente; 
  } catch (error) {
    sweetAlertOK("Ocurrió un error, actualice página", "error");
    console.error('Error obteniendo documentos: ', error);
    throw error; 
  }
}
  




  export { traerLicenciasRestantes, cargarTareaFirestore, actualizarNotasMeses, mostrarNotasDeFirestore, db }

