import { traerLicenciasRestantes } from "./firebaseConfig";
//   Declaro variables y asigno eventos ↓


// Calendario
let selectores = document.querySelectorAll('.selectores');
let mesSeleccionado = document.getElementById("selectorMes");
let olCalendario = document.getElementById("ol-calendario");
mesSeleccionado.addEventListener("change", elegirMes);
let diaSeleccionado = 0;
let mesPreExistenteEnLocalStorage = localStorage.getItem("mesElegido");

// Formulario
let modalFormulario = document.getElementById("modal-formulario");

// Resumen
let btnResumen = document.getElementById("resumen");
btnResumen.addEventListener("click", desplegarResumen);
let contenedorResumen = document.getElementById("section-contenedor-resumen");

// Declaro contadores de licencias
let licenciaAngie = {deuda: 0, estudio: 0 , extra: 0, vacaciones: 0};
let licenciaCami = {deuda: 0, estudio: 0 , extra: 0, vacaciones: 0};
let licenciaRo = {deuda: 0, estudio: 0 , extra: 0, vacaciones: 0};
let licenciaQuimey = {deuda: 0, estudio: 0 , extra: 0, vacaciones: 0};

//  SVG
let btnAddSVG = `<svg xmlns="http://www.w3.org/2000/svg" id="add-formulario-svg" " fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
<path id="add-formulario-path" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
</svg>`







function mostrarCarga() {
    modalCarga.style.display = 'flex';
  }
  // Ocultar el modal de carga
  function ocultarCarga() {
    modalCarga.style.display = 'none';
  }




  





// Traer licencias restantes de la db
async function actualizarLicenciasRestantes () {
  mostrarCarga();
 try {
    let datos = await traerLicenciasRestantes();
    datos.forEach(element => {

      if (element.id === "Angie") {
        licenciaAngie.vacaciones = element.vacaciones;
        licenciaAngie.estudio = element.estudio;
        licenciaAngie.extra = element.extra;
        licenciaAngie.deuda = element.deuda;
      }
      if (element.id === "Cami") {
      licenciaCami.vacaciones = element.vacaciones;
      licenciaCami.estudio = element.estudio;
      licenciaCami.extra = element.extra;
      licenciaCami.deuda = element.deuda;
      }

      if (element.id === "Rocio") {
      licenciaRo.vacaciones = element.vacaciones;
      licenciaRo.estudio = element.estudio; 
      licenciaRo.extra = element.extra;
      licenciaRo.deuda = element.deuda;
      }

      if (element.id === "Quimey") {
        licenciaQuimey.vacaciones = element.vacaciones;
        licenciaQuimey.estudio = element.estudio;
        licenciaQuimey.extra = element.extra;
        licenciaQuimey.deuda = element.deuda;
      }

    });
    ocultarCarga();
  } catch (error) {
    ocultarCarga();
    console.error('Error al actualizar las licencias restantes: ', error);
  }
}










// Función para asignar los eventos dependiendo donde haga click ↓
function asignarEventosSegunDondeHagaClick() {
    // Asignar eventos a los botones
    document.addEventListener("click", (event) => {
  
        // Verificar si el clic ocurrió en un botón de editar
        if (event.target.id.startsWith("day-")) {
          // Extraer el ID de la tarea de la identificación del botón
          clickEnCasilla(event.target.id.split("-")[1]);
        } 

        else if (event.target.id.startsWith("close-formulario") || event.target.id.startsWith("cancelar-formulario")) {
            cerrarElFormulario();
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
    })
}  




// Ejecuto la función que define funcionalidad de muchos botones
asignarEventosSegunDondeHagaClick();









// Cargo el último mes que vieron, si es que existe ↓
if (mesPreExistenteEnLocalStorage){
    mesSeleccionado.value = mesPreExistenteEnLocalStorage;
    elegirMes();
} 



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

    switch (mesSeleccionado.value) {
        case "Enero":
            diasEnMes = 31;
            primerDia.classList.add("empiezaLunes");
            break;
        case "Febrero":
            diasEnMes = 29;
            primerDia.classList.add("empiezaJueves");
            break;
        case "Marzo":
            diasEnMes = 31;
            primerDia.classList.add("empiezaViernes");
            break;
        case "Abril":
            diasEnMes = 30;
            primerDia.classList.add("empiezaMiercoles");
            break;
        case "Mayo":
            diasEnMes = 31;
            primerDia.classList.add("empiezaMiercoles");
            break;
        case "Junio":
            diasEnMes = 30;
            primerDia.classList.add("empiezaSabado");
            break;
        case "Julio":
            diasEnMes = 31;
            primerDia.classList.add("empiezaLunes");
            break;
        case "Agosto":
            diasEnMes = 31;
            primerDia.classList.add("empiezaJueves");
            break;
        case "Septiembre":
            diasEnMes = 30;
            primerDia.classList.add("empiezaDomingo");
            break;
        case "Octubre":
            diasEnMes = 31;
            primerDia.classList.add("empiezaMiercoles");
            break;
        case "Noviembre":
            diasEnMes = 30;
            primerDia.classList.add("empiezaViernes");
            break;
        case "Diciembre":
            diasEnMes = 31;
            primerDia.classList.add("empiezaDomingo");
            break;
        default:
            diasEnMes = 0; // Manejar el caso de un mes inválido
    }

    localStorage.setItem("mesElegido", mesSeleccionado.value);


    // Obtener la lista de días del calendario
    const listaDias = document.querySelectorAll('.days');

    // Iterar sobre los elementos de la lista y mostrar/ocultar según la cantidad de días en el mes
    listaDias.forEach((dia, indice) => {
        if (indice + 1 <= diasEnMes) {
            dia.id = `day-${dia.textContent}-${mesSeleccionado.value}`;
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
    olCalendario.classList.toggle("poner-borroso");
    btnResumen.classList.toggle("poner-borroso");
    selectores.forEach(selector => {
        selector.classList.toggle('poner-borroso');
        selector.disabled = !selector.disabled;
    });
}













// Renderizar modal con tareas ↓
function clickEnCasilla(dia){
    // Elimino el display none que venía arrastrando
    modalFormulario.classList.remove("aplicar-display-none");
    diaSeleccionado = dia;

    ponerSacarBorroso();

    let contenedorParaModal = document.getElementById("modal-formulario");
    let formulario = document.createElement("div");
    formulario.innerHTML = `
    <div id="modal-formulario" class="formulario">
    <button id="add-formulario" class="formulario-add">${btnAddSVG}</i></button>
    <button id="close-formulario" class="formulario-close">X</button>
      <h1 class="h1-formulario"> ${dia} de ${mesSeleccionado.value}</h1>
    </div>
    `;
    
    contenedorParaModal.appendChild(formulario)
}







// Abrir formulario para nueva tarea ↓
function formularioNuevaTarea(dia){

    let contenedorParaModal = document.getElementById("modal-formulario");
    let nuevaTarea = document.createElement("div");
    nuevaTarea.innerHTML = `
    <div class="formulario-nueva-tarea">
      <button id="close-formulario-nueva-tarea" class="formulario-close-nueva-tarea">X</button>
      <h1 class="h1-formulario-nueva-tarea"> Nueva tarea para ${dia} de ${mesSeleccionado.value}</h1>
      <div class="div-selectores-formulario">
        <select class="selectores-formulario" id="recepcionistaFormulario" name="selectorRecepcionista" >
          <option disabled selected> RECEPCIONISTA </option>
          <option value="Angela"> ÁNGELA</option>
          <option value="Camila">CAMILA</option>
          <option value="Quimey">QUIMEY</option>
          <option value="Rocío">ROCÍO</option>
        </select>
  
        <select class="selectores-formulario" id="selectorActividadFormulario" name="selectorActividad" >
          <option disabled selected> TIPO DE LICENCIA</option>
          <option value="HomeOffice" >HOME OFFICE</option>
          <option value="DiaEstudio" >DÍA DE ESTUDIO </option>
          <option value="Vacaciones" >VACACIONES </option>
          <option value="HorasExtra" >HORAS EXTRA </option>
          <option value="HorasDeuda" >HORAS ADUDADAS </option>
          <option value="Enfermedad" >ENFERMEDAD</option>
          <option value="FaltaProgramada" >FALTA PROGRAMADA </option>
          <option value="Otras" >OTRAS LICENCIAS </option>
        </select>
      </div>

      <div class="div-botones-formulario">
        <button id="aceptar-formulario" class="botones-formulario">ACEPTAR</button>
        <button id="cancelar-formulario" class="botones-formulario">CANCELAR</button>
      </div>
    </div>
    `;
    
    contenedorParaModal.appendChild(nuevaTarea)
}







// Función para cerrar modal ↓
function cerrarElFormulario (){
    modalFormulario.classList.add("aplicar-display-none");
    ponerSacarBorroso();

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
      <h1 class="h1-cards">Resumen licencias Angie</h1>
      <div class="div-p-cards">
        <p>Vacaciones: ${licenciaAngie.vacaciones}/14 </p>
        <p>Días estudio: ${licenciaAngie.estudio}/10</p>
        <p>Horas extra: ${licenciaAngie.extra}</p>
        <p>Horas adeudadas: ${licenciaAngie.deuda} </p>
      </div>
    </div>

    <div class="card-resumen card-cami">
      <h1 class="h1-cards">Resumen licencias Cami</h1>
      <div class="div-p-cards">
      <p>Vacaciones: ${licenciaCami.vacaciones}/14 </p>
      <p>Días estudio: ${licenciaCami.estudio}/10</p>
      <p>Horas extra: ${licenciaCami.extra}</p>
      <p>Horas adeudadas: ${licenciaCami.deuda} </p>
      </div>
    </div>

    <div class="card-resumen card-ro">
      <h1 class="h1-cards">Resumen licencias Ro</h1>
      <div class="div-p-cards">
      <p>Vacaciones: ${licenciaRo.vacaciones}/21 </p>
      <p>Días estudio: ${licenciaRo.estudio}/10</p>
      <p>Horas extra: ${licenciaRo.extra}</p>
      <p>Horas adeudadas: ${licenciaRo.deuda} </p>
      </div>
    </div>

    <div class="card-resumen card-quimey">
      <h1 class="h1-cards">Resumen licencias Quimi</h1>
      <div class="div-p-cards">
      <p>Vacaciones: ${licenciaQuimey.vacaciones}/14 </p>
      <p>Días estudio: ${licenciaQuimey.estudio}/10</p>
      <p>Horas extra: ${licenciaQuimey.extra}</p>
      <p>Horas adeudadas: ${licenciaQuimey.deuda} </p>
      </div>
    </div>
  </div>
    `
    btnResumen.disabled = true;
    contenedorResumen.appendChild(cardsResumen)
}






// Cerrar resumen ↓
function closeResumen () {
  btnResumen.disabled = false;

  contenedorResumen.classList.add("aplicar-display-none");

  ponerSacarBorroso();
}







// Cargar tarea en db ↓
function cargarTarea () {
    let recepcionistaFormulario = document.getElementById("recepcionistaFormulario");
    let selectorActividadFormulario = document.getElementById("selectorActividadFormulario");

    let recepcionistaElegida = recepcionistaFormulario.value;
    let selectorActividadFormularioElegido = selectorActividadFormulario.value;

    if (recepcionistaElegida === "RECEPCIONISTA" || selectorActividadFormularioElegido === "TIPO DE LICENCIA") {
      console.log("NO")
    } else {
      
    }
}