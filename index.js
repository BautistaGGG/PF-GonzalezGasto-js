// implementando LUXON
const dateTime = luxon.DateTime;
const now = dateTime.now()
const local = dateTime.local()

const minutoLuxon = now.c.minute
const horaLuxon = now.c.hour

const diaLuxon = now.c.day
const nombreDelDiaLuxon = now.weekdayLong

const mesLuxon = now.c.month
const nombreDelMesLuxon = now.monthLong

const añoLuxon = now.c.year

const fechaCompleta = now.toLocaleString(dateTime.DATE_FULL)

const mensajeConfechaDeReserva = `
    El ${nombreDelDiaLuxon} ${fechaCompleta}, a las ${horaLuxon}:${minutoLuxon} hs.
`

//RENDERIZANDO data ingresada CON INPUTS a través del DOM
    const articleOne = document.getElementById("articleOneID")
    const ulContenedor = document.getElementById("ulContenedor")
    const input = document.getElementById("inputID")
    const button = document.getElementById("buttonID")
    const botonBorrar = document.getElementById("botonDeleteID")


//logica del sistema
    let arrayDeTurnos = []
    let turnoInicial = 1
    let topeDeTurnos = 10
    let intentoFallidoUno = false
    let intentoFallidoDos = false
    let turnosLlenos = false
    let infoTurnos = document.createElement("pre")

function otorgandoTurnoAlUsuario(){
    //Mayuscula a primer letra del input
        let primerLetra = input.value.charAt(0).toUpperCase()
        let restoDeLaPalabra = input.value.slice(1)
        let nombreEnMayuscula = primerLetra + restoDeLaPalabra 
        let horarioActual = `
            ${local.toLocaleString(dateTime.DATE_HUGE)} a las${dateTime.local().toFormat("HH:mm")}
        `
    //Pusheando data al array
        arrayDeTurnos.push({
            nombre: nombreEnMayuscula,
            turno: turnoInicial,
            id: Date.now(),
            horarioDeReserva: horarioActual
        })
    //Agregando arrayDeData al LocalStorage
        let arrayIntoString = JSON.stringify(arrayDeTurnos)
        localStorage.setItem("infoTurnos", arrayIntoString)
    
    //Retornando y renderizado la data de localStorage
        let retornandoData = localStorage.getItem("infoTurnos")
        let stringintoArray = JSON.parse(retornandoData)
        
    //Renderizando en el DOM
        let nombreRecibido = stringintoArray[turnoInicial -1].nombre
        let turnoDado = stringintoArray[turnoInicial -1].turno = turnoInicial++
        let liContenedor = document.createElement("li")
        liContenedor.innerHTML = `
            <p> ${nombreRecibido} recibió el turno N° ${turnoDado} - ${horarioActual}</p>
        `
        ulContenedor.appendChild(liContenedor)

    //Vaciando el input y dandole focus automáticamente luego de presionar "Enviar"
        input.value = ""
        input.focus()

    //En caso de alcanzar el tope de turnos, inhabilitar el boton "Enviar" y mostrar el texto:
        if (stringintoArray.length === topeDeTurnos) {
            button.disabled = true
            infoTurnos.innerText = "Todos los turnos están reservados. Intente en otro momento"
            articleOne.appendChild(infoTurnos) 
        }else {
            infoTurnos.innerText = ""
        }
}

function manejandoInputVacio(){
    intentoFallidoUno = true
        if (intentoFallidoUno && !intentoFallidoDos) {
            alert("No podemos asignarte un turno si no ingresas tu NOMBRE en el INPUT. Intenta de nuevo")         
            intentoFallidoDos = true
        } else if(intentoFallidoUno && intentoFallidoDos){
            arrayDeTurnos.push({
                nombre: "",
                turno: turnoInicial
            })
            alert("Ya se te había pedido que completes el input y lo volviste a dejar vacío. Perdiste tu turno")
            let liContenedor = document.createElement("li")
            liContenedor.innerHTML = `
                <p> Se perdió el turno ${turnoInicial++} por FALTA DE DATOS </p>
            `
            ulContenedor.appendChild(liContenedor)
            input.value = ""
            intentoFallidoUno = false
            intentoFallidoDos = false
        }
}

function renderizandoData() {
    !input.value == "" ? otorgandoTurnoAlUsuario() : manejandoInputVacio()
}
    
function borrarTurnos(){
    arrayDeTurnos = []
    infoTurnos.innerText = "Todos los turnos han sido borrados exitosamente"
    articleOne.appendChild(infoTurnos)
    setTimeout(() => {
        infoTurnos.remove()
    }, 2500)
    ulContenedor.innerText = ""
    button.disabled = false
    turnoInicial = 1
    localStorage.removeItem("infoTurnos")
    localStorage.clear()
}

button.addEventListener("click", () => {
    renderizandoData()
})

botonBorrar.addEventListener("click", () => {
    borrarTurnos()
})

//manejo de datos del localStorage una vez que la pagina es reiniciada

window.addEventListener("load", () => {
    let hayDataEnLS = localStorage.getItem("infoTurnos")
    if(hayDataEnLS){
        let stringintoArray = JSON.parse(hayDataEnLS)
        console.log(stringintoArray);
        
        stringintoArray.map(objeto => {
            let liContenedor = document.createElement("li")
            if (objeto.nombre != "") {
                
                let nombre = objeto.nombre
                let turno = objeto.turno
                let horario = objeto.horarioDeReserva
                liContenedor.innerHTML = `
                    <p> ${nombre} recibió el turno N° ${turno} - ${horario} </p>
                `
                ulContenedor.appendChild(liContenedor)
            } else{
                liContenedor.innerHTML = `
                    <p> Se perdió el turno ${objeto.turno} por FALTA DE DATOS </p>
                `
                ulContenedor.appendChild(liContenedor)
            }
        })

        //En caso de alcanzar el tope de turnos, se inhabilita "Enviar" y se muestra el texto de alerta:
            if (stringintoArray.length === topeDeTurnos) {
                button.disabled = true
                infoTurnos.innerText = "Todos los turnos están reservados. Intente en otro momento"
                articleOne.appendChild(infoTurnos) 
            }else {
                infoTurnos.innerText = ""
            }
    }
})

/*//testeo

const btnTesteo = document.getElementById("testeo")

btnTesteo.addEventListener("click", () => {
    let tiempoActual = dateTime.local().toFormat("dd/MM/yyyy HH:mm:ss");
    console.log(tiempoActual);
})*/