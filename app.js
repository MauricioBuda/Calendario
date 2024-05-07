//   Declaro variables y asigno eventos ↓
let mesSeleccionado = document.getElementById("selectorMes");
mesSeleccionado.addEventListener("change", elegirMes);
let diaSeleccionado = 0;


let modalFormulario = document.getElementById("modal-formulario");
let mesPreExistenteEnLocalStorage = localStorage.getItem("mesElegido");

let selectores = document.querySelectorAll('.selectores');
let olCalendario = document.getElementById("ol-calendario");
let btnResumen = document.getElementById("resumen");

let btnAddSVG = `<svg xmlns="http://www.w3.org/2000/svg" id="add-formulario-svg" " fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
<path id="add-formulario-path" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
</svg>`











// Función para asignar los eventos dependiendo donde haga click ↓
function asignarEventosSegunDondeHagaClick() {
    // Asignar eventos a los botones
    document.addEventListener("click", (event) => {
  
        // Verificar si el clic ocurrió en un botón de editar
        if (event.target.id.startsWith("day-")) {
          // Extraer el ID de la tarea de la identificación del botón
          clickEnCasilla(event.target.id.split("-")[1]);
        } 

        else if (event.target.id.startsWith("close-formulario")) {
            cerrarElFormulario();
          } 

        else if (event.target.id.startsWith("add-formulario")) {
            formularioNuevaTarea(diaSeleccionado);
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
async function elegirMes() {

    // Elimino las clases que van a marcar que día empieza el mes, para luego asignarle la correcta
    primerDia = document.querySelector('.primerDia');
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
    setTimeout(() => {

        mostrarDiasYAsignarIds (diasEnMes);
        
    }, 0);

    localStorage.setItem("mesElegido", mesSeleccionado.value);


}








async function mostrarDiasYAsignarIds (diasEnMes){
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









// Renderizar modal con tareas ↓
function clickEnCasilla(dia){
    // Elimino el display none que venía arrastrando
    modalFormulario.classList.remove("aplicar-display-none");
    diaSeleccionado = dia;

    // Acomodo las clases para que el fondo quede borroso
    olCalendario.classList.add("poner-borroso");
    btnResumen.classList.add("poner-borroso");
    selectores.forEach(selector => {
        selector.classList.add('poner-borroso');
    });



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
  </div>
    `;
    
    contenedorParaModal.appendChild(nuevaTarea)
}







// Función para cerrar modal ↓
function cerrarElFormulario (){
    modalFormulario.classList.add("aplicar-display-none");

    // Saco lo borroso
        // Acomodo las clases para que el fondo quede borroso
        olCalendario.classList.remove("poner-borroso");
        btnResumen.classList.remove("poner-borroso");
        selectores.forEach(selector => {
            selector.classList.remove('poner-borroso');
        });
}