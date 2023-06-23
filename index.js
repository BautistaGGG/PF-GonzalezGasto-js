//Obteniendo Elementos a través del DOM
    const articleOne = document.getElementById("articleOneID")
    const ulContenedor = document.getElementById("ulContenedor")
    const input = document.getElementById("inputID")
    const button = document.getElementById("buttonID")
    const botonBorrar = document.getElementById("botonDeleteID")

    //LUXON 
    const dateTime = luxon.DateTime
    const local = dateTime.local()

//logica del sistema
    let arrayDeTurnos = []
    let turnoInicial = 1
    let topeDeTurnos = 10
    let intentoFallidoUno = false
    let intentoFallidoDos = false
    let turnosLlenos = false

    //Aviso: Todos los setTimeOut utilizados tienen el fin de sincronizar una acción con la otra. Ej: Una vez que termina el timer de un toast, se muestra otro alert.

function otorgandoTurnoAlUsuario(){
    //Mayuscula a primer letra del input
        let primerLetra = input.value.charAt(0).toUpperCase()
        let restoDeLaPalabra = input.value.slice(1)
        let nombreEnMayuscula = primerLetra + restoDeLaPalabra 
        let horarioActual = `
            ${local.toLocaleString(dateTime.DATE_HUGE)} a las ${dateTime.local().toFormat("HH:mm")}
        `
    //Pusheando data al array
        arrayDeTurnos.push({
            nombre: nombreEnMayuscula,
            turno: turnoInicial,
            id: Date.now(),
            horarioDeReserva: horarioActual,
        })

    //Agregando arrayDeTurnos al LocalStorage
        let arrayIntoString = JSON.stringify(arrayDeTurnos)
        localStorage.setItem("infoTurnos", arrayIntoString)
    
    //Retornando y renderizado la data de localStorage
        let retornandoData = localStorage.getItem("infoTurnos")
        let stringintoArray = JSON.parse(retornandoData)
        
    //Elementos a renderizar en el DOM
        let nombreRecibido = stringintoArray[turnoInicial -1].nombre
        let turnoDado = stringintoArray[turnoInicial -1].turno = turnoInicial++
        let liContenedor = document.createElement("li")

    //Simulando un chequeo para luego mostrar SweetAlert2 con los los inputs Radio y Select
        Swal.fire({
            icon: 'info',
            toast: true,
            position: 'top-end',
            title: `Revisando disponibilidad...`,
            timer: 2500,
            timerProgressBar:true,
            showConfirmButton: false
        })
        setTimeout(() => {
        //Llamando a la API para mostrar la data al usuario
            fetch("https://648b4e0217f1536d65eac242.mockapi.io/turnos/horariosDisponibles")
            .then(res => res.json())
            .then(data => {
        //Dia a seleccionar para reserva de turno usando SweetAlert2
            const sabado = 0
            const domingo = 1

            const opcionesDeDiasPorRadio = new Promise(resolve => {
                resolve({
                    'Sábado': data[sabado].Dia,
                    'Domingo': data[domingo].Dia
                })
            })
    
        //El usuario debe elegir el día a reservar mediante input, Sábado o Domingo
            Swal.fire({
                title:`¿ ${nombreRecibido}, qué día quieres reservar?`,
                input: 'radio',
                inputOptions: opcionesDeDiasPorRadio,
                inputValidator: (value) => {
                    //En caso de presionar 'OK' pero no seleccionar un día, será advertido
                    if(!value){
                        return `${nombreRecibido}, es necesario seleccionar un día para obtener tu turno.`
                    }else{ 
                        Swal.fire({
                            icon: 'info',
                            text:`Chequeando disponibilidad del ${value}....`,
                            showConfirmButton: false,
                            allowOutsideClick:false,
                            timer: 4000,
                            timerProgressBar:true,        
                        }) 
                        //En caso de seleccionar Sábado, podrá seleccionar un horario de ese día luego de 3 segundos
                        if(value === "Sábado"){
                            setTimeout(() => {
                                Swal.fire({
                                    title: 'Hay lugar disponible!',
                                    text: "Selecciona el horario para completar la reserva",
                                    input: 'select',
                                    inputOptions:{
                                        'Mañana':{
                                            '08:00': data[sabado].Horarios[0],
                                            '09:00': data[sabado].Horarios[1],
                                            '10:00': data[sabado].Horarios[2],
                                            '11:00': data[sabado].Horarios[3],
                                            '12:00': data[sabado].Horarios[4]
                                        },
                                        'Tarde':{
                                            '15:00': data[sabado].Horarios[5],
                                            '16:00': data[sabado].Horarios[6],
                                            '17:00': data[sabado].Horarios[7],
                                            '18:00': data[sabado].Horarios[8],
                                            '19:00': data[sabado].Horarios[9]
                                        }
                                    },
                                    inputPlaceholder: 'Elige un horario',
                                    showCancelButton: true,
                                }) 
                                .then(result => {
                                    const turnoElegido = result.value;
                                    if(result.isConfirmed){
                                        Swal.fire({
                                            toast: true,
                                            showConfirmButton: false,
                                            timer: 4000,
                                            timerProgressBar:true,
                                            icon: 'info',
                                            position:'top-end', 
                                            title: `Haciendo reserva para las ${turnoElegido}hs ...`,
                                        })
                                    }
                                    //Antes de renderizar, muestro la alerta con SweetAlert2 y luego el mensaje en el DOM
                                    setTimeout(() => {
                                        Swal.fire({
                                            toast: true,
                                            icon: 'success',
                                            position: 'top-end',
                                            title: `${nombreRecibido}, tu turno fue reservado correctamente`,
                                            timer: 2800,
                                            timerProgressBar:true,
                                            showConfirmButton: false
                                        })

                                        liContenedor.innerHTML = `
                                            <p> ${nombreRecibido} eligió el ${value}, con turno a las ${turnoElegido}hs. - Recibió el turno N° ${turnoDado} del día, reservado el ${horarioActual}</p>
                                        `
                                        ulContenedor.appendChild(liContenedor)
                                    },4000)

                                    //Vaciando el input y dandole focus automáticamente luego de presionar "Enviar"
                                    input.value = ""
                                    input.focus()

                                    //En caso de alcanzar el tope de turnos, inhabilitar el boton "Enviar" y mostrar SweetAlert de advertencia:
                                    if (stringintoArray.length === topeDeTurnos) {
                                        button.disabled = true
                                        input.disabled = true
                                        setTimeout(() => {
                                            Swal.fire({
                                                toast: true,
                                                icon: 'info',
                                                position: 'top-end',
                                                title: 'No más turnos!',
                                                text: 'Todos los turnos fueron reservados. Intente en otro momento',
                                                timer: 2800,
                                                timerProgressBar:true,
                                                showConfirmButton: false
                                            })
                                        }, 3000) 
                                    }
                                })
                            },4000)
                            //En caso de seleccionar Sábado, podrá seleccionar un horario de ese día luego de 3 segundos
                        } else if(value === "Domingo"){
                            setTimeout(() => {
                                Swal.fire({
                                    title: 'Hay lugar disponible!',
                                    text: "Selecciona el horario para completar la reserva",
                                    input: 'select',
                                    inputOptions:{
                                        'Mañana':{
                                            '10:00': data[domingo].Horarios[0],
                                            '10:30': data[domingo].Horarios[1],
                                            '11:00': data[domingo].Horarios[2],
                                            '11:30': data[domingo].Horarios[3],
                                            '12:00': data[domingo].Horarios[4]
                                        },
                                        'Tarde':{
                                            '16:00': data[domingo].Horarios[5],
                                            '16:30': data[domingo].Horarios[6],
                                            '17:00': data[domingo].Horarios[7],
                                            '17:30': data[domingo].Horarios[8],
                                            '18:00': data[domingo].Horarios[9]
                                        }
                                    },
                                    inputPlaceholder: 'Elige un horario',
                                    showCancelButton: true,
                                })
                                .then(result => {
                                    const turnoElegido = result.value;
                                    if(result.isConfirmed){
                                        Swal.fire({
                                            toast: true,
                                            showConfirmButton: false,
                                            timer: 4000,
                                            timerProgressBar:true,
                                            icon: 'info',
                                            position:'top-end', 
                                            title: `Haciendo reserva para las ${turnoElegido}hs ...`,
                                        })
                                    }
                                    //Antes de renderizar, muestro la alerta con SweetAlert2 y luego el mensaje en el DOM
                                    setTimeout(() => {
                                        Swal.fire({
                                            toast: true,
                                            icon: 'success',
                                            position: 'top-end',
                                            title: `${nombreRecibido}, tu turno fue reservado correctamente`,
                                            timer: 2800,
                                            timerProgressBar:true,
                                            showConfirmButton: false
                                        })

                                        liContenedor.innerHTML = `
                                            <p> ${nombreRecibido} eligió el ${value}, con turno a las ${turnoElegido}hs. - Recibió el turno N° ${turnoDado} del día, reservado el ${horarioActual} </p>    
                                        `
                                        ulContenedor.appendChild(liContenedor)

                                        //Agregando nuevas propiedades al arrayDeTurnos
                                        const arrayDeTurnosNuevo = arrayDeTurnos.map(nuevoObj => ({
                                            ...nuevoObj,
                                            fechaReservada: value,
                                            horarioReservado: turnoElegido,
                                        }))

                                        //Agregando nuevo arrayDeTurnos al LocalStorage
                                        let arrayIntoString2 = JSON.stringify(arrayDeTurnosNuevo)
                                        localStorage.setItem("infoNuevaTurnos", arrayIntoString2)
                                    },4000)
                        
                                    //Vaciando el input y dandole focus automáticamente luego de presionar "Enviar"
                                    input.value = ""
                                    input.focus()


                                    //En caso de alcanzar el tope de turnos, inhabilitar el boton "Enviar" y mostrar SweetAlert de advertencia:
                                    if (stringintoArray.length === topeDeTurnos) {
                                        button.disabled = true
                                        input.disabled = true
                                        setTimeout(() => {
                                            Swal.fire({
                                                toast: true,
                                                icon: 'info',
                                                position: 'top-end',
                                                title: 'No más turnos!',
                                                text: 'Todos los turnos fueron reservados. Intente en otro momento',
                                                timer: 2800,
                                                timerProgressBar:true,
                                                showConfirmButton: false
                                            })
                                        }, 3000) 
                                    }
                                })
                            },4000)
                        }
                    }
                }
            })       
        })
    }, 2500);
}

    function manejandoInputVacio(){
        intentoFallidoUno = true
            if (intentoFallidoUno && !intentoFallidoDos) {            
                intentoFallidoDos = true
                Swal.fire({
                    icon: 'warning',
                    title: 'Cuidado!',
                    text: 'No podemos asignarte un turno si no ingresas tu NOMBRE en el INPUT. Intenta de nuevo',
                    timerProgressBar:true,
                    timer: 3500,
                    allowOutsideClick:false,
                    showConfirmButton: false      
                })
            } else if(intentoFallidoUno && intentoFallidoDos){
                arrayDeTurnos.push({
                    nombre: "",
                    turno: turnoInicial
                })
                Swal.fire({
                    icon: 'error',
                    title: 'Turno Perdido!',
                    text: "Ya se te había pedido que completes el input y lo volviste a dejar vacío. Perdiste tu turno",
                    timerProgressBar:true,
                    timer: 4000,
                    allowOutsideClick:false,
                    showConfirmButton: false  
                })
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
        ulContenedor.innerText = ""
        button.disabled = false
        input.disabled = false
        turnoInicial = 1
        localStorage.removeItem("infoNuevaTurnos")
        localStorage.clear()
        Swal.fire({
            icon: 'error',
            title: 'Borrados',
            text: 'Todos los turnos han sido borrados!',
        })
    }

    button.addEventListener("click", () => {
        renderizandoData()
    })

    botonBorrar.addEventListener("click", () => {
        borrarTurnos()
    })

    //Manejo de datos del LocalStorage una vez que la pagina es reiniciada
    window.addEventListener("load", () => {
        let hayDataEnLS = localStorage.getItem("infoNuevaTurnos")
        if(hayDataEnLS){
            let stringintoArray = JSON.parse(hayDataEnLS)
            console.log(stringintoArray);
            
            stringintoArray.map(objeto => {
                let liContenedor = document.createElement("li")
                if (objeto.nombre != "") {
                    let nombre = objeto.nombre
                    let turno = objeto.turno
                    let horarioDeReserva = objeto.horarioDeReserva
                    let horarioReservado = objeto.horarioReservado
                    let fechaReservada = objeto.fechaReservada

                    liContenedor.innerHTML = `
                    <p> ${nombre} eligió el ${fechaReservada}, con turno a las ${horarioReservado}hs. - Recibió el turno N° ${turno} del día, reservado el ${horarioDeReserva} </p>    
                    `
                    ulContenedor.appendChild(liContenedor)
                } else{
                    liContenedor.innerHTML = `
                        <p> Se perdió el turno ${objeto.turno} por FALTA DE DATOS </p>
                    `
                    ulContenedor.appendChild(liContenedor)
                }
            })

        //En caso de alcanzar el tope de turnos, se deshabilitan "Enviar" y  
        //el Input, a la vez que se muestra el texto de alerta:
            if (stringintoArray.length === topeDeTurnos) {
                button.disabled = true
                setTimeout(() => {
                    Swal.fire({
                        toast: true,
                        icon: 'info',
                        position: 'top-end',
                        title: 'No más turnos!',
                        text: 'Todos los turnos fueron reservados. Intente en otro momento',
                        timer: 2800,
                        timerProgressBar:true,
                        showConfirmButton: false
                    })
                }, 1000) 
            }
        }
    })
        