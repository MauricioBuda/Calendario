import Swal from 'sweetalert2'

function sweetAlertOK (title, successOrError){
    Swal.fire({
        position: "center",
        icon: successOrError,
        title: title,
        showConfirmButton: false,
        timer: 2000
      });
}

function sweetAlertConfirm () {
    return new Promise((resolve) => {
        Swal.fire({
          title: "Eliminar licencia",
          text: "No se puede recuperar",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, eliminar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            resolve(true); // Resuelve la promesa con true si el usuario confirma
          } else {
            resolve(false); // Resuelve la promesa con false si el usuario cancela
          }
        });
      });
}

export { sweetAlertOK, sweetAlertConfirm }