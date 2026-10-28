
"use strict";

const API_COMERCIOS =
    "https://6ae15049be3bc8fead98617f.mockapi.io/comercios";

const listaComercios = document.getElementById("lista-comercios");

function crearTarjeta(comercio) {
    const articulo = document.createElement("article");
    articulo.className = "emprendimiento";
    
    const ficha = document.createElement("div");
    ficha.className = "emprendimiento__ficha";

    const imagen = document.createElement("img");

    imagen.className = "emprendimiento__imagen";

   const imagenes = [
    "../assets/imagenes/emprendimiento1_frontend.png",
    "../assets/imagenes/emprendimiento2_frontend.png"
    ];

    const indice = Number(comercio.id) || 1;

    imagen.src = imagenes[(indice - 1) % imagenes.length];

    imagen.alt = "Imagen ilustrativa de comercio local";

    imagen.loading = "lazy";

    const nombre = document.createElement("h2");
    nombre.className = "emprendimiento__nombre";
    nombre.textContent = comercio.nombre || "Sin nombre";

    const ciudad = document.createElement("p");
    ciudad.className = "emprendimiento__ciudad";
    ciudad.textContent = comercio.ciudad || "Ciudad no indicada";

    const informacion = document.createElement("div");
    informacion.className = "emprendimiento__info";

    const descripcion = document.createElement("p");
    descripcion.textContent =
        comercio.descripcion || "Sin descripción";

    const direccion = document.createElement("p");
    direccion.textContent =
        `Dirección: ${comercio.direccion || "No indicada"}`;

    const contacto = document.createElement("p");
    contacto.textContent =
        `Contacto: ${comercio.contacto || "No indicado"}`;

    ficha.append(imagen, nombre, ciudad);
    informacion.append(descripcion, direccion, contacto);
    articulo.append(ficha, informacion);

    return articulo;
}

async function cargarComercios() {
    listaComercios.textContent = "Cargando comercios...";

    try {
        const respuesta = await fetch(API_COMERCIOS);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const comercios = await respuesta.json();

        if (!Array.isArray(comercios)) {
            throw new Error("La API no devolvió una lista.");
        }

        listaComercios.replaceChildren();

        if (comercios.length === 0) {
            listaComercios.textContent =
                "Todavía no hay comercios registrados.";
            return;
        }

        comercios.forEach((comercio) => {
            const tarjeta = crearTarjeta(comercio);
            listaComercios.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("Error al cargar comercios:", error);

        listaComercios.textContent =
            "No se pudieron cargar los comercios. Intenta nuevamente.";
    }
}

cargarComercios();
