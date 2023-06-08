/*function abstracto(number){
    let acumulador = number
    for(let i = 1; i <= 10; i++){
        console.log(acumulador += i)
    }
}

abstracto(5)

function mayorQue(x, y){
    return  x > y
}

console.log(mayorQue(10, 8))*/

/* function calculadora(operacion){
    if(operacion === "sumar"){
       return (a, b) => a + b
    }else if(operacion === "resta"){
       return (a, b) => a - b
    } else if(operacion === "multiplicacion"){
       return (a, b) => a * b
    }else if(operacion === "division"){
       return (a, b) => a / b
    }
}

let suma = calculadora("sumar")
let resta = calculadora("resta")
let multiplicacion = calculadora("multiplicacion")
let division = calculadora("division")

console.log(suma(10,10))
console.log(resta(10,10))
console.log(multiplicacion(10,10))
console.log(division(10,10)) */

let nombreDelSolicitante = "luis"
let primeraLetra = nombreDelSolicitante.charAt(0).toUpperCase()
let restoDePalabra = nombreDelSolicitante.slice(1)
let nombreMayuscula = primeraLetra + restoDePalabra

console.log(nombreMayuscula);

// usando PROMPT Y CONSOLA a la vez que renderizando en el DOM

/*const ulContenedor = document.getElementById("contenedor-datos")
const liContenedor = document.getElementById("contenedor-dato")

const mensajeBienvenida = alert("Bienvenido a la página para la reserva de turnos. A continuación solicitaremos sus datos para darle su turno correspondiente.")
let arrayContenedor = []

function otorgandoTurnoAlUsuario(){
    let nombreDelSolicitante = prompt("Ingrese su NOMBRE y APELLIDO")
        for(let i = 1; i < 11; i++){
            if (i > 10) {
                alert("Se acabaron los turnos!. Presione F5 para reiniciar el sistema")
            }
            if (nombreDelSolicitante !== "") {
                let primerLetra = nombreDelSolicitante.charAt(0).toUpperCase()
                let restoDeLaPalabra = nombreDelSolicitante.slice(1)
                let nombreEnMayuscula = primerLetra + restoDeLaPalabra 
                arrayContenedor.push({
                    nombre: nombreEnMayuscula,
                    numeroTurno: i
                })
                console.log(arrayContenedor);
                console.log(`${nombreEnMayuscula} recibió el turno N° ${i}`);
                let liConNombre = document.createElement("li")
                liConNombre.innerHTML = `
                    <p> ${nombreEnMayuscula} recibió el turno N° ${i} </p> 
                `
                ulContenedor.appendChild(liConNombre)

                nombreDelSolicitante = prompt("Ingrese su NOMBRE y APELLIDO")
            } else {   
                arrayContenedor.push({
                    nombre: "vacío",
                    numeroTurno: `Turno N° ${i} PERDIDO por FALTA de DATOS.`
                })
                alert("No reservaste turno y el lugar se perdió. Intenta de nuevo")
                console.log(arrayContenedor);
                console.log(`Turno N° ${i} PERDIDO por FALTA de DATOS.`);
                let liConAusente = document.createElement("li")
                liConAusente.innerHTML = `
                    <p> Turno N° ${i} PERDIDO por FALTA de DATOS. </p>
                `
                ulContenedor.appendChild(liConAusente)

                nombreDelSolicitante = prompt("Ingrese su NOMBRE y APELLIDO")
            }
        }
}

otorgandoTurnoAlUsuario() */
