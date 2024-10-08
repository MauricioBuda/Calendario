import { traerLicenciasRestantes, cargarTareaFirestore, actualizarNotasMeses, mostrarNotasDeFirestore } from "./firebaseConfig";

import { deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig'; 

import { sweetAlertOK, sweetAlertConfirm } from "./sweetAlert";

//   Declaro variables y asigno eventos ↓




import {  collection, getDocs } from 'firebase/firestore';


// Calendario
let selectores = document.querySelectorAll('.selectores');
let selectorDeMes = document.getElementById("selectorMes");
selectorDeMes.addEventListener("change", elegirMes);
let numeroDeMesSeleccionado
let añoSeleccionado

let olCalendario = document.getElementById("ol-calendario");
let selectorRecepcionista = document.getElementById("selectorRecepcionista");
let selectorLicencia = document.getElementById("selectorActividad");
let diaSeleccionado = 0;
let mesPreExistenteEnLocalStorage = localStorage.getItem("mesElegido");


// Asigno eventos a selectores
selectorRecepcionista.addEventListener("change", ()=> { recepcionistaSeleccionada = selectorRecepcionista.value })
selectorLicencia.addEventListener("change", ()=> { licenciaSeleccionada =  selectorLicencia.value })

// Variables de lo que selecciona el usuario
let recepcionistaSeleccionada = selectorRecepcionista.value;
let licenciaSeleccionada =  selectorLicencia.value;

// Tareas
let modalTareas = document.getElementById("contenedor-tareas");
let modalConTareas
let tareaAInsertar

// Formulario
let contenedorFormulario = document.getElementById("contenedor-formulario");
let modalConFormulario
let arrayLicencias = [];
let nuevaLicencia 

// Declaro contadores de licencias
let licenciaAngie = {deuda: 0, estudio: 0 , extra: 0, vacaciones: 0};
let licenciaAnto = {deuda: 0, estudio: 0 , extra: 0, vacaciones: 0};
let licenciaRo = {deuda: 0, estudio: 0 , extra: 0, vacaciones: 0};
let licenciaQuimey = {deuda: 0, estudio: 0 , extra: 0, vacaciones: 0};


// Resumen
let btnResumen = document.getElementById("resumen");
btnResumen.addEventListener("click", desplegarResumen);
let contenedorResumen = document.getElementById("section-contenedor-resumen");

// Detalles
let divContenedorDetalles = document.getElementById("div-para-detalles");

// Asigno evento a los selectores para que vayan filtrando
selectores.forEach(selector => {
    selector.addEventListener("change", ()=> { obtenerLicenciasDesdeFirestore (selectorDeMes.value, selectorRecepcionista.value, selectorLicencia.value)});
});

// Notas
let pNotas = document.getElementById("p-notas");
let spanParaNotas = document.getElementById("p-para-notas");
let btnAgregarGuardarNotas = document.getElementById("boton-add-notas");
let bordeNotas = document.getElementById("span-borde-notas");
btnAgregarGuardarNotas.addEventListener("click", agregarGuardarNotas);

//  SVG
let btnAddSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="add-formulario-svg" id="add-formulario-svg" " fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
<path id="add-formulario-path" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
</svg>`

// let btnTrashSVG = `<svg xmlns="http://www.w3.org/2000/svg" id="btnTrash" class="trash-card" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
// <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
// </svg>`





// Clase para ir cargando las licencias:
class Licencia {
    constructor( licencia, recepcionista, dia, mes, año, horasExtra, horasDeuda, fechaCreacionConFormato, fechaCreacionSinFormato, fechaDeLicencia, id) {
      this.licencia = licencia;
      this.recepcionista = recepcionista;
      this.dia = dia;
      this.mes = mes;
      this.año = año;
      this.horasExtra = horasExtra;
      this.horasDeuda = horasDeuda;
      this.fechaCreacionConFormato = fechaCreacionConFormato;
      this.fechaCreacionSinFormato = fechaCreacionSinFormato;
      this.fechaDeLicencia = fechaDeLicencia;
      this.id = id;
    }
  }
  







function mostrarCarga() {
    modalCarga.style.display = 'flex';
  }
  // Ocultar el modal de carga
function ocultarCarga() {
    modalCarga.style.display = 'none';
  }















// Función para asignar los eventos dependiendo donde haga click ↓
function asignarEventosSegunDondeHagaClick() {
    // Asignar eventos a los botones
    document.addEventListener("click", (event) => {
  
        // Verificar si el clic ocurrió en un botón de editar
        if (event.target.id.startsWith("day-")) {
          clickEnCasilla(event.target.id.split("-")[1]);
        } 

        else if (event.target.id.startsWith("close-formulario") || event.target.id.startsWith("clasePara")) {
          cerrarModalDeTareas();
          } 

        else if (event.target.id.startsWith("add-formulario")) {
          formularioNuevaTarea(diaSeleccionado);
        } 

        else if (event.target.id.startsWith("aceptar-formulario")) {
          cargarTarea();
        } 

        else if (event.target.id.startsWith("btn-close-resumen")) {
          closeResumen();
        } 

        else if (event.target.id.startsWith("sumar-contador")) {
          sumarHoras();
        } 

        else if (event.target.id.startsWith("restar-contador")) {
          restarHoras();
        } 

        else if (event.target.id.startsWith("eliminarTarea-")) {
          eliminarTareaDeFirestore(event.target.id.split("-")[1]);
        } 

        else if (event.target.id.startsWith("btnTrash-")) {
          eliminarTareaDeFirestore(event.target.id.split("-")[1]);
        } 
        
        else if (event.target.id.startsWith("btnTrashPath-")) {
          eliminarTareaDeFirestore(event.target.id.split("-")[1]);
        } 

        else if (event.target.classList.contains("tarea-renderizada")) {
          let id = event.target.getAttribute("data-id");
          clickEnCasilla(id);
        } 

        else if (event.target.classList.contains("btn-close-detalles")) {
            cerrarModalDetalles();
          } 
    })
}  




// Ejecuto la función que define funcionalidad de muchos botones
asignarEventosSegunDondeHagaClick();












// Cargo el último mes que vieron, si es que existe ↓
if (mesPreExistenteEnLocalStorage){
    selectorDeMes.value = mesPreExistenteEnLocalStorage;
    elegirMes();
} 


obtenerLicenciasDesdeFirestore (selectorDeMes.value, selectorRecepcionista.value, selectorLicencia.value);

// Función para renderizar mes elegido en pantalla ↓
function elegirMes() {

    // Elimino las clases que van a marcar que día empieza el mes, para luego asignarle la correcta
    let primerDia = document.querySelector('.primerDia');
    primerDia.classList.remove("empiezaLunes");
    primerDia.classList.remove("empiezaMartes");
    primerDia.classList.remove("empiezaMiercoles");
    primerDia.classList.remove("empiezaJueves");
    primerDia.classList.remove("empiezaViernes");
    primerDia.classList.remove("empiezaSabado");
    primerDia.classList.remove("empiezaDomingo");


    // Obtener el número de días para el mes seleccionado
    let diasEnMes = 0;

    switch (selectorDeMes.value) {
        case "Enero 2024":
            diasEnMes = 31;
            primerDia.classList.add("empiezaLunes");
            numeroDeMesSeleccionado = 1;
            añoSeleccionado = 2024;
            break;
        case "Febrero 2024":
            diasEnMes = 29;
            primerDia.classList.add("empiezaJueves");
            numeroDeMesSeleccionado = 2;
            añoSeleccionado = 2024;
            break;
        case "Marzo 2024":
            diasEnMes = 31;
            primerDia.classList.add("empiezaViernes");
            numeroDeMesSeleccionado = 3;
            añoSeleccionado = 2024;
            break;
        case "Abril 2024":
            diasEnMes = 30;
            primerDia.classList.add("empiezaLunes");
            numeroDeMesSeleccionado = 4;
            añoSeleccionado = 2024;
            break;
        case "Mayo 2024":
            diasEnMes = 31;
            primerDia.classList.add("empiezaMiercoles");
            numeroDeMesSeleccionado = 5;
            añoSeleccionado = 2024;
            break;
        case "Junio 2024":
            diasEnMes = 30;
            primerDia.classList.add("empiezaSabado");
            numeroDeMesSeleccionado = 6;
            añoSeleccionado = 2024;
            break;
        case "Julio 2024":
            diasEnMes = 31;
            primerDia.classList.add("empiezaLunes");
            numeroDeMesSeleccionado = 7;
            añoSeleccionado = 2024;
            break;
        case "Agosto 2024":
            diasEnMes = 31;
            primerDia.classList.add("empiezaJueves");
            numeroDeMesSeleccionado = 8;
            añoSeleccionado = 2024;
            break;
        case "Septiembre 2024":
            diasEnMes = 30;
            primerDia.classList.add("empiezaDomingo");
            numeroDeMesSeleccionado = 9;
            añoSeleccionado = 2024;
            break;
        case "Octubre 2024":
            diasEnMes = 31;
            primerDia.classList.add("empiezaMartes");
            numeroDeMesSeleccionado = 10;
            añoSeleccionado = 2024;
            break;
        case "Noviembre 2024":
            diasEnMes = 30;
            primerDia.classList.add("empiezaViernes");
            numeroDeMesSeleccionado = 11;
            añoSeleccionado = 2024;
            break;
        case "Diciembre 2024":
            diasEnMes = 31;
            primerDia.classList.add("empiezaDomingo");
            añoSeleccionado = 2024;
            numeroDeMesSeleccionado = 12;

            case "Enero 2025":
              diasEnMes = 31;
              primerDia.classList.add("empiezaMiercoles");
              numeroDeMesSeleccionado = 1;
              añoSeleccionado = 2025;
            break;
          case "Febrero 2025":
              diasEnMes = 29;
              primerDia.classList.add("empiezaSabado");
              numeroDeMesSeleccionado = 2;
              añoSeleccionado = 2025;
            break;
          case "Marzo 2025":
              diasEnMes = 31;
              primerDia.classList.add("empiezaSabado");
              numeroDeMesSeleccionado = 3;
              añoSeleccionado = 2025;
            break;
          case "Abril 2025":
              diasEnMes = 30;
              primerDia.classList.add("empiezaMartes");
              numeroDeMesSeleccionado = 4;
            añoSeleccionado = 2025;
            break;
          case "Mayo 2025":
              diasEnMes = 31;
              primerDia.classList.add("empiezaJueves");
              numeroDeMesSeleccionado = 5;
            añoSeleccionado = 2025;
            break;
          case "Junio 2025":
              diasEnMes = 30;
              primerDia.classList.add("empiezaDomingo");
              numeroDeMesSeleccionado = 6;
            añoSeleccionado = 2025;
            break;
          case "Julio 2025":
              diasEnMes = 31;
              primerDia.classList.add("empiezaMartes");
              numeroDeMesSeleccionado = 7;
            añoSeleccionado = 2025;
            break;
          case "Agosto 2025":
              diasEnMes = 31;
              primerDia.classList.add("empiezaViernes");
              numeroDeMesSeleccionado = 8;
            añoSeleccionado = 2025;
            break;
          case "Septiembre 2025":
              diasEnMes = 30;
              primerDia.classList.add("empiezaLunes");
              numeroDeMesSeleccionado = 9;
            añoSeleccionado = 2025;
            break;
          case "Octubre 2025":
              diasEnMes = 31;
              primerDia.classList.add("empiezaMiercoles");
              numeroDeMesSeleccionado = 10;
            añoSeleccionado = 2025;
            break;
          case "Noviembre 2025":
              diasEnMes = 30;
              primerDia.classList.add("empiezaSabado");
              numeroDeMesSeleccionado = 11;
            añoSeleccionado = 2025;
            break;
          case "Diciembre 2025":
              diasEnMes = 31;
              primerDia.classList.add("empiezaLunes");
              numeroDeMesSeleccionado = 12;
            añoSeleccionado = 2025;

            break;
        default:
            diasEnMes = 0; // Manejar el caso de un mes inválido
    }

    localStorage.setItem("mesElegido", selectorDeMes.value);


    // Obtener la lista de días del calendario
    const listaDias = document.querySelectorAll('.days');
    // Iterar sobre los elementos de la lista y mostrar/ocultar según la cantidad de días en el mes
    listaDias.forEach((dia, indice) => {
        if (indice + 1 <= diasEnMes) {
            dia.id = `day-${dia.firstChild.textContent}-${selectorDeMes.value}`;
            // Mostrar días válidos
            dia.style.display = 'list-item';
        } else {
            // Ocultar días adicionales que no corresponden al mes seleccionado
            dia.style.display = 'none';
        }
    });
}








function ponerSacarBorroso () {
    // Acomodo las clases para que el fondo quede borroso
    pNotas.classList.toggle("poner-borroso");
    btnAgregarGuardarNotas.classList.toggle("poner-borroso");
    olCalendario.classList.toggle("poner-borroso");
    btnResumen.classList.toggle("poner-borroso");

    btnAgregarGuardarNotas.disabled = !btnAgregarGuardarNotas.disabled;
    btnResumen.disabled = !btnResumen.disabled;

    let casillasDias = document.querySelectorAll('.days');

    casillasDias.forEach(dia => {
      dia.classList.toggle("days-disabled")
    });

    selectores.forEach(selector => {
        selector.classList.toggle('poner-borroso');
        // Los dehabilito ↓
        selector.disabled = !selector.disabled;
    });
}






function ponerSacarBorrosoCuandoAgregoNota () {
  // Acomodo las clases para que el fondo quede borroso
  olCalendario.classList.toggle("poner-borroso");
  btnResumen.classList.toggle("poner-borroso");

  btnResumen.disabled = !btnResumen.disabled;

  let casillasDias = document.querySelectorAll('.days');

  casillasDias.forEach(dia => {
    dia.classList.toggle("days-disabled")
  });

  selectores.forEach(selector => {
      selector.classList.toggle('poner-borroso');
      // Los dehabilito ↓
      selector.disabled = !selector.disabled;
  });
}













// Renderizar modal con tareas ↓
async function clickEnCasilla(dia){
    // Elimino el display none que venía arrastrando
    modalTareas.classList.remove("aplicar-display-none");
    diaSeleccionado = dia;
    let desglosarMes = selectorDeMes.value.split(" ")
    añoSeleccionado = desglosarMes[1] === "2024"? "2024" : desglosarMes[1] === "2025"? "2025" : ""


    ponerSacarBorroso();

    modalConTareas = document.createElement("div");
    modalConTareas.innerHTML = `
    <div id="div-contenedor-tareas" class="formulario">
      <button id="add-formulario" class="formulario-add">${btnAddSVG}</i></button>
      <button id="close-formulario" class="formulario-close">X</button>
        <h1 class="h1-formulario"> ${dia} de ${selectorDeMes.value}</h1>
        <div id="contenedor-cards">

        </div>
      </div>
    `;
    modalTareas.appendChild(modalConTareas)

    let tareasDelDia = await obtenerLicenciasDesdeFirestoreModal(dia, selectorDeMes.value);
    let contenedorParaCards = document.getElementById("contenedor-cards")

    tareasDelDia.forEach(element => {

        let tareaAInsertarCard = document.createElement("div");
        tareaAInsertarCard.classList.add ("div-tareas-modal");

        tareaAInsertarCard.innerHTML = `
            <span> ${element.recepcionista}</span>
            <span> ${element.horasDeuda!=0?element.horasDeuda + "HS":element.horasExtra!=0?element.horasExtra + "HS":element.licencia}</span>
            <span>
                  <button id="eliminarTarea-${element.id}" class="btn-trash-card">
                        <svg xmlns="http://www.w3.org/2000/svg" id="btnTrash-${element.id}" class="trash-card" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path id="btnTrashPath-${element.id}" d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                  </button>
            </span>

        `

        contenedorParaCards.appendChild(tareaAInsertarCard)
    });
}







// Abrir formulario para nueva tarea ↓
async function formularioNuevaTarea(dia){

    modalConFormulario = document.createElement("div");
    modalConFormulario.innerHTML = `
    <div class="formulario-nueva-tarea">
      <button id="close-formulario-nueva-tarea" class="formulario-close-nueva-tarea">X</button>
      <h1  class="h1-formulario-nueva-tarea"> Nueva tarea para:
       ${dia} de ${selectorDeMes.value}</h1>
      <div class="div-selectores-formulario">
        <select class="selectores-formulario" id="recepcionistaFormulario" name="selectorRecepcionistaFormulario" >
          <option disabled selected> RECEPCIONISTA </option>
          <option value="Angie"> ANGIE </option>
          <option value="Anto"> ANTO </option>
          <option value="Ro"> RO </option>
          <option value="Quimi"> QUIMI </option>
        </select>
  
        <select class="selectores-formulario" id="selectorActividadFormulario" name="selectorActividadFormulario" >
          <option disabled selected> TIPO DE LICENCIA</option>
          <option value="HomeOffice" >HOME OFFICE</option>
          <option value="Estudio" >DÍA DE ESTUDIO </option>
          <option value="Vacaciones" >VACACIONES </option>
          <option value="HorasExtra" >HORAS EXTRA </option>
          <option value="HorasDeuda" >HORAS ADEUDADAS </option>
          <option value="Enfermedad">ENFERMEDAD</option>
          <option value="FaltaProgramada" >FALTA PROGRAMADA </option>
          <option value="Otras" >OTRAS LICENCIAS </option>
        </select>
      </div>


        <div id="contenedor-contador" class="div-contador-formulario aplicar-display-none">
          <button id="restar-contador" disabled class="btn-contador"> - </button>
          <div class="div-span-contador">
            <span id="horas-contador" class="span-contador">0</span>
            <span class="span-hs">HS</span>
          </div>
          <button id="sumar-contador" class="btn-contador"> + </button>
        </div>



      <div class="div-botones-formulario">
        <button id="aceptar-formulario" class="botones-formulario">ACEPTAR</button>
        <button id="cancelar-formulario" class="botones-formulario">CANCELAR</button>
      </div>
    </div>
  </section>
    `;

    
    contenedorFormulario.appendChild(modalConFormulario);

    
    let selectorActividadFormulario = document.getElementById("selectorActividadFormulario");
    selectorActividadFormulario.addEventListener("change", mostrarContador);
}







function mostrarContador () {

  let selectorActividadFormulario = document.getElementById("selectorActividadFormulario");
  let selectorActividadFormularioElegido = selectorActividadFormulario.value;

  let contenedorContador = document.getElementById("contenedor-contador");

  if (selectorActividadFormularioElegido === "HorasExtra" || selectorActividadFormularioElegido === "HorasDeuda") {
      contenedorContador.classList.remove("aplicar-display-none");
  } else {
    contenedorContador.classList.add("aplicar-display-none");
  }
}







// Ver si habilito o no el restar
function restarTogle (horas) {
  let btnRestar = document.getElementById("restar-contador");
  if (parseFloat(horas) === 0) {
    btnRestar.disabled = true;
  } else {
    btnRestar.disabled= false;
  }

}







// Sumar horas en el contador, de a media hora
function sumarHoras () {

  let contadorHoras = document.getElementById("horas-contador");
  
  let horas = parseFloat(contadorHoras.textContent); // Convertir a número
  contadorHoras.innerText = horas + 0.5; // Incrementar el contador

  restarTogle(horas + 0.5);
}







// Restar horas en el contador, de a media hora
function restarHoras () {

  let contadorHoras = document.getElementById("horas-contador");
  
  let horas = parseFloat(contadorHoras.textContent); // Convertir a número
  contadorHoras.innerText = horas - 0.5; // Incrementar el contador

  restarTogle(horas - 0.5);
}







// Función para cerrar modal ↓
function cerrarModalDeTareas (){

  ponerSacarBorroso();

    if (modalConTareas && modalTareas) {
    modalTareas.removeChild(modalConTareas);
    }

    if (modalConFormulario && contenedorFormulario) {
    contenedorFormulario.removeChild(modalConFormulario);
    }

}









// Cerrar resumen ↓
function closeResumen () {

  contenedorResumen.classList.add("aplicar-display-none");

  ponerSacarBorroso();
}







// Cargar tarea en db ↓
async function cargarTarea () {
  // console.log(añoSeleccionado)
  try {

    mostrarCarga();
    let recepcionistaFormulario = document.getElementById("recepcionistaFormulario");
    let selectorActividadFormulario = document.getElementById("selectorActividadFormulario");

    let recepcionistaElegida = recepcionistaFormulario.value;
    let selectorActividadFormularioElegido = selectorActividadFormulario.value;

    if (recepcionistaElegida === "RECEPCIONISTA" || selectorActividadFormularioElegido === "TIPO DE LICENCIA") {
      sweetAlertOK("Completar ambos campos", "error");
      ocultarCarga();
      return;
    } else {
        let licencia = selectorActividadFormularioElegido;
        let recepcionista = recepcionistaElegida;
        let dia = diaSeleccionado;
        let mes = selectorDeMes.value;
        let año = añoSeleccionado;
        let horasExtra = 0;
        let horasDeuda = 0;
        let formatoFecha = { year: 'numeric', month: 'numeric', day: 'numeric', hour12: false };
        let fechaCreacionConFormato = new Date();
        let fechaCreacionSinFormato = new Date().toLocaleDateString('es-AR', formatoFecha);
        let id = '';
        let fechaDeLicencia = `${numeroDeMesSeleccionado}/${dia}/${añoSeleccionado}`;



        if(selectorActividadFormularioElegido === "HorasDeuda") {
            let contadorHoras = document.getElementById("horas-contador");
            horasDeuda = contadorHoras.textContent;
        }

        if (selectorActividadFormularioElegido === "HorasExtra") {
            let contadorHoras = document.getElementById("horas-contador");
            horasExtra = contadorHoras.textContent;
        }

        if (selectorActividadFormularioElegido === "HorasExtra" || selectorActividadFormularioElegido === "HorasDeuda" ) {
            if (parseFloat(horasDeuda) === 0 && parseFloat(horasExtra) === 0) {
                sweetAlertOK("El valor debe ser distinto a 0", "error");
                ocultarCarga();
                return;
            }
        }

        let horasDeudaEnNegativo = parseFloat(horasDeuda) * -1;
  

        nuevaLicencia = new Licencia(licencia, recepcionista, dia, mes, año, parseFloat(horasExtra), horasDeudaEnNegativo, fechaCreacionConFormato, fechaCreacionSinFormato, fechaDeLicencia, id);

        arrayLicencias.push(nuevaLicencia);

        await cargarTareaFirestore (licencia, recepcionista, dia, mes, año, parseFloat(horasExtra), horasDeudaEnNegativo, fechaCreacionConFormato, fechaCreacionSinFormato, nuevaLicencia, fechaDeLicencia, id);

        sweetAlertOK("Licencia cargada!", "success")
        cerrarModalDeTareas();
        obtenerLicenciasDesdeFirestore (selectorDeMes.value, selectorRecepcionista.value, selectorLicencia.value);
        ocultarCarga();
        
    }
  } catch (error) {
    console.error("Error al obtener documentos: ", error);
  }
}












// Función para obtener las cards desde Firestore
async function obtenerLicenciasDesdeFirestore(mes, recepcionista, licencia) {
  let mesParaNotas = mes.toUpperCase();

  ponerMesEnBordeDeNotas(mesParaNotas);
  traerNotasExistentesDeFirestore(mesParaNotas);

  try {

    mostrarCarga();
    // Limpiar el array de cards antes de obtener las nuevas desde Firestore
    arrayLicencias = [];

    let casillasEliminar = document.querySelectorAll(".tarea-renderizada");

    casillasEliminar.forEach(element => {
        element.remove();
        });
  
    // Obtener todas las tareas desde Firestore
    const querySnapshot = await getDocs(collection(db, "licenciasCalendario"));
  
    // Iterar sobre las tareas y agregarlas al array y al contenedor
    querySnapshot.forEach((doc) => {
      const tarjetaFirestore = doc.data();
  
      if (tarjetaFirestore.mes === mes ) {

        if (recepcionista === "Todas" && licencia === "Todas") {
            tarjetaFirestore.id = doc.id;
            arrayLicencias.push(tarjetaFirestore);
        }

        if (recepcionista === "Todas" && tarjetaFirestore.licencia === licencia ) {
            tarjetaFirestore.id = doc.id;
            arrayLicencias.push(tarjetaFirestore);
        }
        if (tarjetaFirestore.recepcionista === recepcionista && licencia === "Todas" ) {
            tarjetaFirestore.id = doc.id;
            arrayLicencias.push(tarjetaFirestore);
        }
        if (tarjetaFirestore.recepcionista === recepcionista && tarjetaFirestore.licencia === licencia ) {
            tarjetaFirestore.id = doc.id;
            arrayLicencias.push(tarjetaFirestore);
        }
        

      }
    });
  
    // Iterar sobre las tarjetas y agregarlas al contenedor
    arrayLicencias.forEach(tarjeta => {
      renderizarTareasEnCalendario(tarjeta);
    });
    ocultarCarga();
  } catch (error) {
    console.error("Error al obtener documentos: ", error);
  }
}










// Función para obtener las cards desde Firestore
async function obtenerLicenciasDesdeFirestoreModal(dia, mes) {
  try {
    mostrarCarga();
    // Limpiar el array de cards antes de obtener las nuevas desde Firestore
    arrayLicencias = [];
  
    // Obtener todas las tareas desde Firestore
    const querySnapshot = await getDocs(collection(db, "licenciasCalendario"));
  
    // Iterar sobre las tareas y agregarlas al array y al contenedor
    querySnapshot.forEach((doc) => {
      const tarjetaFirestore = doc.data();
  
      if (tarjetaFirestore.mes === mes ) {

        if (tarjetaFirestore.dia === dia) {
          tarjetaFirestore.id = doc.id;
          arrayLicencias.push(tarjetaFirestore);
        }
        

      }
    });
    ocultarCarga();
  
   return arrayLicencias;

  } catch (error) {
    console.error("Error al obtener documentos: ", error);
  }
}










function ponerMesEnBordeDeNotas (mes){
 bordeNotas.innerText = `NOTAS DE ${mes}`;
}









async function traerNotasExistentesDeFirestore (mes) {
  try {
    let notasExistentes = await mostrarNotasDeFirestore(mes);

    spanParaNotas.textContent = notasExistentes;


  } catch (error) {
    sweetAlertOK("Error, actualizar página por favor", "error");
  }
}


















  


function renderizarTareasEnCalendario (tarea){

    let casilla = document.getElementById(`day-${tarea.dia}-${tarea.mes}`);
    let claseSegunLicencia
    tareaAInsertar = document.createElement("div");
    tareaAInsertar.classList.add("div-tareas-renderizadas")

    switch (tarea.licencia) {
            case "HomeOffice":
                claseSegunLicencia = "home";

            break;
            case "Estudio":
                claseSegunLicencia = "estudio";
            
            break;
            case "Vacaciones":
                claseSegunLicencia = "vacaciones";
            
            break;
            case "HorasExtra":
                claseSegunLicencia = "extra";
            
            break;
            case "HorasDeuda":
                claseSegunLicencia = "deuda";
            
            break;
            case "Enfermedad":
                claseSegunLicencia = "enfermedad";
            
            break;
            case "FaltaProgramada":
                claseSegunLicencia = "programada";
            
            break;
            case "Otras":
                claseSegunLicencia = "otras";
            
            break;
        default:
            break;
    }

    tareaAInsertar.innerHTML = `
        <p id="${tarea.id}" data-id="${tarea.dia}" class="tarea-renderizada ${claseSegunLicencia}"> ${tarea.recepcionista}  <span class="span-licencia-calendario">  |  ${tarea.horasDeuda!=0?tarea.horasDeuda + "HS":tarea.horasExtra!=0?tarea.horasExtra + "HS":tarea.licencia} </span></p>
    `

    casilla.appendChild(tareaAInsertar);
}










async function eliminarTareaDeFirestore (idEliminar) {
  mostrarCarga();
  let tarea = arrayLicencias.find((t) => t.id === idEliminar);
    if (tarea) {
        let respuesta = await sweetAlertConfirm();

        if (respuesta) {
            await deleteDoc(doc(db, "licenciasCalendario", tarea.id));
            sweetAlertOK("Tarea eliminada", "success");
            obtenerLicenciasDesdeFirestore (selectorDeMes.value, selectorRecepcionista.value, selectorLicencia.value);
            setTimeout(() => {
                location.reload();;
            }, 800);
        } else {
            // sweetAlertOK("Ocurrió un error, actualizar página", "error");
            ocultarCarga();
        }
    }
}








function agregarGuardarNotas () {
   mostrarCarga();
   if (spanParaNotas.contentEditable === "true") {
    mostrarCarga();


    let notaNueva = spanParaNotas.textContent;

    actualizarNotasMeses(selectorDeMes.value, notaNueva);


    ponerSacarBorrosoCuandoAgregoNota();
    btnAgregarGuardarNotas.classList.remove("boton-guardar-notas");
    btnAgregarGuardarNotas.classList.add("boton-agregar-notas");
    btnAgregarGuardarNotas.textContent = "AGREGAR NOTAS";
    spanParaNotas.classList.remove("span-con-notas-editando");
    spanParaNotas.contentEditable = false;
    
    ocultarCarga();
    
   } else {

    ponerSacarBorrosoCuandoAgregoNota();
    btnAgregarGuardarNotas.classList.add("boton-guardar-notas");
    btnAgregarGuardarNotas.classList.remove("boton-agregar-notas");
    btnAgregarGuardarNotas.textContent = "GUARDAR";
    spanParaNotas.contentEditable = true;
    spanParaNotas.classList.add("span-con-notas-editando");
    spanParaNotas.focus();
    
    ocultarCarga();
    
   }
       
   ocultarCarga();
    
}













// Traer licencias restantes de la db
async function actualizarLicenciasRestantes () {

  // Declaro contadores de licencias
licenciaAngie = {deuda: 0, estudio: 0 , extra: 0, vacaciones: 0};
licenciaAnto = {deuda: 0, estudio: 0 , extra: 0, vacaciones: 0};
licenciaRo = {deuda: 0, estudio: 0 , extra: 0, vacaciones: 0};
licenciaQuimey = {deuda: 0, estudio: 0 , extra: 0, vacaciones: 0};

  mostrarCarga();
  
  try {
    // Obtener todas las tareas desde Firestore
    const querySnapshot = await getDocs(collection(db, "licenciasCalendario"));
  
    // Iterar sobre las tareas y agregarlas al array y al contenedor
    querySnapshot.forEach((doc) => {
      const tarjetaFirestore = doc.data();
      if (tarjetaFirestore.recepcionista === "Angie") {
        
      switch (tarjetaFirestore.licencia) {
        case "Vacaciones":
          licenciaAngie.vacaciones += 1;
        break;
        case "Estudio":
          licenciaAngie.estudio += 1;
        break;
        case "HorasExtra":
          licenciaAngie.extra += tarjetaFirestore.horasExtra;
        break;
        case "HorasDeuda":
          licenciaAngie.deuda += tarjetaFirestore.horasDeuda;
        break;
      default:
        break;
      }
    } else if (tarjetaFirestore.recepcionista === "Anto") {
        
      switch (tarjetaFirestore.licencia) {
        case "Vacaciones":
          licenciaAnto.vacaciones += 1;
        break;
        case "Estudio":
          licenciaAnto.estudio += 1;
        break;
        case "HorasExtra":
          licenciaAnto.extra += tarjetaFirestore.horasExtra;
        break;
        case "HorasDeuda":
          licenciaAnto.deuda += tarjetaFirestore.horasDeuda;
        break;
      default:
        break;
      }
    } else if (tarjetaFirestore.recepcionista === "Ro") {
      switch (tarjetaFirestore.licencia) {
        case "Vacaciones":
          licenciaRo.vacaciones += 1;
        break;
        case "Estudio":
          licenciaRo.estudio += 1;
        break;
          case "HorasExtra":
            licenciaRo.extra += tarjetaFirestore.horasExtra;
          break;
          case "HorasDeuda":
            licenciaRo.deuda += tarjetaFirestore.horasDeuda;
          break;
      default:
        break;
      }
    } else if (tarjetaFirestore.recepcionista === "Quimi") {
        
      switch (tarjetaFirestore.licencia) {
        case "Vacaciones":
          licenciaQuimey.vacaciones += 1;
        break;
        case "Estudio":
          licenciaQuimey.estudio += 1;
        break;
        case "HorasExtra":
          licenciaQuimey.extra += tarjetaFirestore.horasExtra;
        break;
        case "HorasDeuda":
          licenciaQuimey.deuda += tarjetaFirestore.horasDeuda;
        break;
    
      default:
        break;
      }
    }
  
    });


    ocultarCarga();
  } catch (error) {
    console.error("Error al obtener documentos: ", error);
    ocultarCarga();
  }
  ocultarCarga();
}










async function desplegarResumen () {
  contenedorResumen.classList.remove("aplicar-display-none");

  ponerSacarBorroso();

  await actualizarLicenciasRestantes();

  let cardsResumen = document.createElement("div");
  cardsResumen.innerHTML = `
  <button class="btn-close-resumen" id="btn-close-resumen">X</button>
  <div class="cards-resumen">

      <div class="card-resumen card-angie">
        <h1 class="h1-cards">Resumen Angie</h1>
        <div class="div-p-cards">
          <span class="span-dentro-resumen">
            <p class="p-resumen"> Vacaciones tomadas: ${licenciaAngie.vacaciones} </p>
            <button data-id="Angie" data-id2="Vacaciones" class="button-en-resumen"> Detalle </button>
          </span> 
          <span class="span-dentro-resumen">
            <p class="p-resumen"> Días estudio: ${licenciaAngie.estudio}/10 </p>
            <button data-id="Angie" data-id2="Estudio" class="button-en-resumen"> Detalle </button>
          </span>
        </div>
      </div>

      <div class="card-resumen card-cami">
        <h1 class="h1-cards">Resumen Anto</h1>
        <div class="div-p-cards">
          <span class="span-dentro-resumen">
            <p class="p-resumen"> Vacaciones tomadas: ${licenciaAnto.vacaciones} </p>
            <button data-id="Anto" data-id2="Vacaciones" class="button-en-resumen"> Detalle </button>
          </span>
          <span class="span-dentro-resumen">
            <p class="p-resumen"> Días estudio: ${licenciaAnto.estudio}/10 </p>
            <button data-id="Anto" data-id2="Estudio" class="button-en-resumen"> Detalle </button>
          </span>
        </div>
      </div>

      <div class="card-resumen card-ro">
        <h1 class="h1-cards">Resumen Ro</h1>
        <div class="div-p-cards">
          <span class="span-dentro-resumen">
            <p class="p-resumen"> Vacaciones tomadas: ${licenciaRo.vacaciones} </p>
            <button data-id="Ro" data-id2="Vacaciones" class="button-en-resumen"> Detalle </button>
          </span>
          <span class="span-dentro-resumen">
            <p class="p-resumen"> Días estudio: ${licenciaRo.estudio}/10 </p>
            <button data-id="Ro" data-id2="Estudio" class="button-en-resumen"> Detalle </button>
          </span>
        </div>
      </div>

      <div class="card-resumen card-quimey">
        <h1 class="h1-cards">Resumen Quimi</h1>
        <div class="div-p-cards">
          <span class="span-dentro-resumen">
            <p class="p-resumen"> Vacaciones tomadas: ${licenciaQuimey.vacaciones} </p>
            <button data-id="Quimi" data-id2="Vacaciones" class="button-en-resumen"> Detalle </button>
          </span>
          <span class="span-dentro-resumen">
            <p class="p-resumen"> Días estudio: ${licenciaQuimey.estudio}/10 </p>
            <button data-id="Quimi" data-id2="Estudio" class="button-en-resumen"> Detalle </button>
          </span>
        </div>
      </div>

  </div>
  `
  contenedorResumen.appendChild(cardsResumen)

  let btnEnResumen = document.querySelectorAll(".button-en-resumen");
  btnEnResumen.forEach(element => {
    element.addEventListener("click", desplegarDetalles);
  });

}












async function desplegarDetalles(event) {
    

    mostrarCarga();

    let recepcionistaDataId = event.target.getAttribute("data-id");
    let licenciaDataId = event.target.getAttribute("data-id2");
    let divConCadaDetalle = document.createElement("div");
    let variableParaRenderizarLicencia

    borrosoTogleCuandoAbroDetalle();

    divConCadaDetalle.classList.add("div-con-detalles");
    divContenedorDetalles.classList.remove("aplicar-display-none");
    divContenedorDetalles.classList.add("div-contenedor-detalles-licencias");
    divContenedorDetalles.innerHTML = '';




    switch (licenciaDataId) {
            case "Estudio":
                variableParaRenderizarLicencia = "Día de estudio ";
            break;

            case "Vacaciones":
                variableParaRenderizarLicencia = "Vacaciones ";
            break;

            case "HorasExtra":
                variableParaRenderizarLicencia = "Horas extra ";
            break;

            case "HorasDeuda":
                variableParaRenderizarLicencia = "Horas adeudadas ";
            break;
    
        default:
            break;
    }

    divContenedorDetalles.innerHTML += `
    <button class="btn-close-detalles"> X </button>
    <h1 class="h1-detalle-resumen"> ${variableParaRenderizarLicencia}  ${recepcionistaDataId} </h1>
    `;


    try {
        // Obtener todas las tareas desde Firestore
        const querySnapshot = await getDocs(collection(db, "licenciasCalendario"));
        let tarjetasOrdenadas = [];

        // Iterar sobre las tareas y agregarlas al array
        querySnapshot.forEach((doc) => {
            const tarjetaFirestore = doc.data();

            if (tarjetaFirestore.licencia === licenciaDataId && tarjetaFirestore.recepcionista === recepcionistaDataId) {
                tarjetasOrdenadas.push(tarjetaFirestore);
            }
        });

        // Ordenar las tarjetas según la fecha de licencia
        tarjetasOrdenadas.sort((a, b) => {
            // Convertir las fechas de licencia a objetos Date
            let fechaA = new Date(a.fechaDeLicencia);
            let fechaB = new Date(b.fechaDeLicencia);
            // Comparar las fechas
            return fechaA - fechaB;
        });

        // Renderizar las tarjetas ordenadas en el contenedor
        
        tarjetasOrdenadas.forEach((tarjeta) => {
            let elAño = tarjeta.año?"":"2024"
            divConCadaDetalle.innerHTML += `
            <p class="p-detalle-resumen">${tarjeta.dia} de ${tarjeta.mes} ${elAño}</p>
            `;
        });

        if (tarjetasOrdenadas.length === 0) {
            divConCadaDetalle.innerHTML += `
            <p class="p-detalle-resumen">Todavía no hay ninguna cargada</p>
            `;
        }


        divContenedorDetalles.appendChild(divConCadaDetalle)
        // divContenedorDetalles.appendChild(divConDetalles)
        
        ocultarCarga();
    } catch (error) {
        console.error("Error al obtener documentos: ", error);
        ocultarCarga();
    }
}











function cerrarModalDetalles () {
    
    divContenedorDetalles.classList.add("aplicar-display-none");

    borrosoTogleCuandoAbroDetalle();
}








function  borrosoTogleCuandoAbroDetalle() {
    let btnCloseResumen = document.getElementById("btn-close-resumen");
    let cardsDelResumen = document.querySelectorAll(".card-resumen");
    let btnDetalle = document.querySelectorAll(".button-en-resumen");

    btnCloseResumen.disabled = !btnCloseResumen.disabled;

    btnCloseResumen.classList.toggle("filtro-borroso-para-detalle");
    cardsDelResumen.forEach(element => {
    element.classList.toggle("filtro-borroso-para-detalle");
    });

    btnDetalle.forEach(element => {
        element.disabled = !element.disabled;
    })
}