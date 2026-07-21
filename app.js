let invitados = [];
let invitadoActual = null;

/* CARGAR INVITADOS */

fetch("invitados.json")
.then(response => response.json())
.then(data => {

    invitados = data;

})
.catch(error => {

    console.error(
        "Error cargando invitados:",
        error
    );

});

/* BUSCAR INVITADO */

function buscarInvitado(){

    const texto = document
        .getElementById("nombre")
        .value
        .trim()
        .toLowerCase();

    const mensaje =
        document.getElementById("mensaje");

    document
        .getElementById("datosInvitado")
        .style.display = "none";

    if(texto === ""){

        mensaje.innerHTML =
        '<p class="error">Escribe tu nombre</p>';

        return;

    }

    const coincidencias =
    invitados.filter(inv =>
        inv.nombre.toLowerCase().includes(texto)
    );

    if(coincidencias.length === 0){

        mensaje.innerHTML =
        '<p class="error">Invitado no encontrado</p>';

        return;

    }

    if(coincidencias.length === 1){

        seleccionarInvitado(
            coincidencias[0]
        );

        return;

    }

    let html =
    "<p><strong>Selecciona tu nombre:</strong></p>";

    coincidencias.forEach((persona,index)=>{

        html += `
        <button onclick="seleccionarInvitadoPorIndice(${index})">
            ${persona.nombre}
        </button>
        `;

    });

    mensaje.innerHTML = html;

    window.resultadosBusqueda =
    coincidencias;

}

/* SELECCIONAR INVITADO */

function seleccionarInvitadoPorIndice(indice){

    seleccionarInvitado(
        window.resultadosBusqueda[indice]
    );

}

function seleccionarInvitado(persona){

    invitadoActual = persona;

    document.getElementById("mensaje")
    .innerHTML = `
        <p class="bienvenida">
            Bienvenido ${persona.nombre}
        </p>
    `;

    document
        .getElementById("datosInvitado")
        .style.display = "block";

    const adultos =
    document.getElementById("adultos");

    adultos.innerHTML = "";

    for(let i = 0; i <= persona.adultos; i++){

        adultos.innerHTML +=
        `<option value="${i}">${i}</option>`;

    }

    const ninos =
    document.getElementById("ninos");

    ninos.innerHTML = "";

    if(persona.ninos > 0){

        document
        .getElementById("bloqueNinos")
        .style.display = "block";

        for(let i = 0; i <= persona.ninos; i++){

            ninos.innerHTML +=
            `<option value="${i}">${i}</option>`;

        }

    }else{

        document
        .getElementById("bloqueNinos")
        .style.display = "none";

    }

}

/* CONFIRMAR */

function confirmar(){

    const adultos =
    parseInt(
        document.getElementById("adultos").value
    );

    let ninos = 0;

    if(invitadoActual.ninos > 0){

        ninos = parseInt(
            document.getElementById("ninos").value
        );

    }

    const datos = {

        nombre: invitadoActual.nombre,
        adultos: adultos,
        ninos: ninos

    };

    fetch(
    "https://script.google.com/macros/s/AKfycbyHn5FTayAqeyX7p3byIpYiAlfHKCyFjhqjRNz4s_kU5AhjvKl_xC7vxOKZ2REKHDaF/exec",
    {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(datos)
    })

    .then(() => {

        const mensajeFinal =
        (adultos === 0 && ninos === 0)
        ? "Comprendemos, gracias por avisarnos ❤️"
        : "Será un honor compartir este día contigo ❤️";

        document.querySelector(".contenedor")
        .innerHTML = `

            <img
                src="logo.png"
                alt="Logo Boda"
                class="logo">

            <h1>¡Gracias!</h1>

            <p class="subtitulo">
                Hemos recibido tu confirmación.
            </p>

            <p style="text-align:center;">
                <strong>${invitadoActual.nombre}</strong>
            </p>

            <p style="text-align:center;">
                Adultos: ${adultos}<br>
                Niños: ${ninos}
            </p>

            <p style="text-align:center;">
                Si anteriormente habías confirmado,
                tu información fue actualizada correctamente.
            </p>

            <p style="text-align:center;">
                ${mensajeFinal}
            </p>

        `;

    })

    .catch(error => {

        console.error(error);

        alert(
            "Error enviando la confirmación."
        );

    });

}