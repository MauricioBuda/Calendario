//   Declaro variables y asigno eventos ↓
let mesSeleccionado = document.getElementById("selectorMes");

mesSeleccionado.addEventListener("change", elegirMes);



  
  
//   mesSeleccionado.addEventListener("click", ()=>{console.log(mesSeleccionado)})
  
  
  
  
  
  // Función para asignar los eventos dependiendo donde haga click ↓
  function asignarEventosSegunDondeHagaClick() {
    // Asignar eventos a los botones
    document.addEventListener("click", (event) => {
  
        // Verificar si el clic ocurrió en un botón de editar
        if (event.target.id.startsWith("day-")) {
          // Extraer el ID de la tarea de la identificación del botón
          clickEnCasilla(event.target.id.split("-")[1]);
        } 
    })
}  

asignarEventosSegunDondeHagaClick();
elegirMes();









function clickEnCasilla(dia){
    let contenedorParaModal = document.getElementById("modal-formulario")
    let formulario = document.createElement("div");
    formulario.innerHTML = `
    <div class="formulario">
    <span class="formulario-close">X</span>
      <h1 class="h1-formulario"> ${dia} de ${mesSeleccionado.value}</h1>
    </div>
    `;
    
    contenedorParaModal.appendChild(formulario)
}









function pintarCuadro(id){
    let cuadroSeleccionado = document.getElementById(`day-${id}`);
    cuadroSeleccionado.classList.toggle("rojo")
}









// Función para renderizar mes elegido en pantalla ↓
function elegirMes() {
    primerDia = document.getElementById("day-1")
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

    // Obtener la lista de días del calendario
    const listaDias = document.querySelectorAll('.days');

    // Iterar sobre los elementos de la lista y mostrar/ocultar según la cantidad de días en el mes
    listaDias.forEach((dia, indice) => {
        if (indice + 1 <= diasEnMes) {
            // Mostrar días válidos
            dia.style.display = 'list-item';
        } else {
            // Ocultar días adicionales que no corresponden al mes seleccionado
            dia.style.display = 'none';
        }
    });
}