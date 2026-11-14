import { filtrarRutasPublicadas } from "./rutas.js";
import { propuestas } from "./rutas-catalogo.js";

const imagenesDestinos = {
    villarrica: "../assets/imagenes/fondo villarrica.jpg",
    pucon: "../assets/imagenes/fondo pucon.jpg",
    conguillio: "../assets/imagenes/fondo conguillio.jpg",
    malalcahuello: "../assets/imagenes/fondo malalcahuello.jpg",
    nahuelbuta: "../assets/imagenes/fondo nahuelbuta.jpg",
    budi: "../assets/imagenes/fondo lago budi.jpg"
};

const ubicacionesDestinos = {
    villarrica: {
        nombre: "Villarrica",
        latitud: -39.2857,
        longitud: -72.2279
    },
    pucon: {
        nombre: "Pucón",
        latitud: -39.2823,
        longitud: -71.9543
    },
    conguillio: {
        nombre: "Parque Nacional Conguillío",
        latitud: -38.65,
        longitud: -71.65
    },
    malalcahuello: {
        nombre: "Reserva Nacional Malalcahuello",
        latitud: -38.45,
        longitud: -71.58
    },
    nahuelbuta: {
        nombre: "Parque Nacional Nahuelbuta",
        latitud: -37.8,
        longitud: -73.0
    },
    budi: {
        nombre: "Lago Budi",
        latitud: -38.86,
        longitud: -73.2
    }
};

export function filtrarPropuestas(rutas, filtros) {
    return rutas.filter(ruta =>
        (!filtros.destino || ruta.destino === filtros.destino)
        && (!filtros.modalidad || ruta.modalidad === filtros.modalidad)
        && (!filtros.transporte || ruta.transporte === filtros.transporte)
    );
}

const formulario = document.querySelector("#form-ruta");
const listado = document.querySelector("#lista-destinos");
const estado = document.querySelector("#resultado-ruta");

const preferencias = document.querySelector("#preferencias-avanzadas");
const seccionPropuestas = document.querySelector("#seccion-propuestas");
const seccionPublicadas = document.querySelector("#seccion-publicadas");

const seccionMapa = document.querySelector("#seccion-mapa");
const contenedorMapa = document.querySelector("#mapa-rutas");
const descripcionMapa = document.querySelector("#descripcion-mapa");

if (
    formulario &&
    listado &&
    estado &&
    preferencias &&
    seccionPropuestas &&
    seccionPublicadas &&
    seccionMapa &&
    contenedorMapa &&
    descripcionMapa
) {
    const form = formulario;
    const lista = listado;
    const mensaje = estado;
    

    function campo(id) {
        const elemento = form.querySelector(`#${id}`);

        if (
            !(elemento instanceof HTMLInputElement ||
            elemento instanceof HTMLSelectElement)
        ) {
            throw new Error(`Falta el campo ${id}`);
        }

        return elemento;
    }

    const origen = campo("origen");
    const destino = campo("destino");
    const fecha = campo("fecha-viaje");
    const modalidad = campo("modalidad");
    const transporte = campo("transporte");

    let mapa = null;
    let marcadorDestino = null;

    function mostrarMapa(destinoSeleccionado) {
        const ubicacion = ubicacionesDestinos[destinoSeleccionado];

        if (!ubicacion) {
            seccionMapa.hidden = true;
            return;
        }

        seccionMapa.hidden = false;

        descripcionMapa.textContent =
            `Ubicación referencial de ${ubicacion.nombre}.`;

        if (!mapa) {
            mapa = L.map("mapa-rutas").setView(
                [ubicacion.latitud, ubicacion.longitud],
                11
            );

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(mapa);

            marcadorDestino = L.marker([
                ubicacion.latitud,
                ubicacion.longitud
            ]).addTo(mapa);

        } else {
            mapa.setView(
                [ubicacion.latitud, ubicacion.longitud],
                11
            );

            marcadorDestino.setLatLng([
                ubicacion.latitud,
                ubicacion.longitud
            ]);
        }

        marcadorDestino.bindPopup(
            `<strong>${ubicacion.nombre}</strong><br>Ubicación referencial`
        );

        requestAnimationFrame(() => {
            mapa.invalidateSize();
        });
    }    

    const hoy = new Date();

    fecha.setAttribute(
        "min",
        `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`
    );

    function parrafo(texto) {
        const p = document.createElement("p");
        p.textContent = texto;
        return p;
    }

    function renderizar(rutas) {
        lista.replaceChildren();

        if (!rutas.length) {
            lista.append(
                parrafo(
                    "No hay propuestas para esa combinación. Prueba otro destino, modalidad o medio de desplazamiento. No se ha realizado ninguna reserva."
                )
            );
            return;
        }

        rutas.forEach(ruta => {
            const tarjeta = document.createElement("article");
            tarjeta.className = "ec-propuesta card h-100";

            const imagen = document.createElement("img");
            imagen.src = imagenesDestinos[ruta.destino];
            imagen.alt = `Paisaje de ${ruta.localidad}`;
            imagen.className = "ec-propuesta-imagen";
            imagen.loading = "lazy";

            const enlacesDestinos = {
                villarrica: "turismo.html#titulo-villarrica",
                pucon: "turismo.html#titulo-pucon",
                conguillio: "turismo.html#titulo-conguillio",
                malalcahuello: "turismo.html#titulo-malalcahuello",
                nahuelbuta: "turismo.html#titulo-nahuelbuta",
                budi: "turismo.html#titulo-budi"
            };

            const titulo = document.createElement("h3");
            titulo.textContent = ruta.nombre;

            const localidad = document.createElement("p");
            localidad.className = "ec-localidad";
            localidad.textContent = `📍 ${ruta.localidad}`;

            const caracteristicas = document.createElement("div");
            caracteristicas.className = "ec-caracteristicas";

            const modalidadEtiqueta = document.createElement("span");
            modalidadEtiqueta.className = "ec-caracteristica ec-modalidad";
            modalidadEtiqueta.textContent =
                ruta.modalidad === "guiada" ? "Con guía" : "Autoguiada";

            const transporteEtiqueta = document.createElement("span");
            transporteEtiqueta.className = "ec-caracteristica ec-transporte";
            transporteEtiqueta.textContent =
                ruta.transporte === "pie" ? "A pie" : "En vehículo";

            caracteristicas.append(modalidadEtiqueta, transporteEtiqueta);

            const etiqueta = parrafo("Recorrido sugerido");
            etiqueta.className = "ec-etiqueta";

            const detalle = document.createElement("details");
            const resumen = document.createElement("summary");

            resumen.textContent = "Ver propuesta de recorrido";

            detalle.append(
                resumen,
                parrafo(
                    `Punto de referencia: ${ruta.localidad}. Explora el entorno del destino y confirma los accesos antes de viajar.`
                ),
                parrafo(
                    "La modalidad y el medio de desplazamiento son opciones para planificar; no confirman guías ni transporte disponibles."
                )
            );

            const fuente = document.createElement("a");
            fuente.href = ruta.fuente;
            fuente.textContent = "Consultar información oficial";

            detalle.append(fuente);

            const botonDestino = document.createElement("a");
            botonDestino.href = enlacesDestinos[ruta.destino];
            botonDestino.className = "ec-boton-destino";
            botonDestino.textContent = "Ver destino";

            tarjeta.append(
                imagen,
                etiqueta,
                titulo,
                localidad,
                parrafo(ruta.descripcion),
                caracteristicas,
                detalle,
                botonDestino
            );

            lista.append(tarjeta);
        });
    }

    function buscar() {
        const resultados = filtrarPropuestas(propuestas, {
            destino: destino.value,
            modalidad: modalidad.value,
            transporte: transporte.value
        });

        renderizar(resultados);
        mostrarMapa(destino.value);
        const destinosPublicados = {
            conguillio: "Conguillío",
            malalcahuello: "Malalcahuello",
            nahuelbuta: "Nahuelbuta",
            budi: "Lago Budi"
        };

        const localidad =
            destinosPublicados[destino.value]
            ?? propuestas.find(ruta => ruta.destino === destino.value)?.localidad
            ?? "";

        filtrarRutasPublicadas(origen.value, localidad);

        // Mostrar los resultados y las opciones adicionales.
        preferencias.hidden = false;
        seccionPropuestas.hidden = false;
        seccionPublicadas.hidden = false;

        mensaje.textContent =
            `${resultados.length} propuestas. Origen de planificación: ${origen.value}. Fecha deseada: ${fecha.value}. No confirma cupos ni servicios.`;

        mensaje.focus();
    }

    // Permite recibir un destino seleccionado desde la página Turismo.
    const parametro = new URLSearchParams(window.location.search).get("destino");

    if (parametro && propuestas.some(ruta => ruta.destino === parametro)) {
        destino.value = parametro;

        mensaje.textContent =
            "Destino seleccionado desde Turismo. Completa origen y fecha para buscar rutas.";
    }

    // No mostrar resultados automáticamente al cargar la página.
    preferencias.hidden = true;
    seccionPropuestas.hidden = true;
    seccionPublicadas.hidden = true;
    seccionMapa.hidden = true;
    form.addEventListener("submit", evento => {
        evento.preventDefault();

        if (form.reportValidity()) {
            buscar();
        }
    });

    form.addEventListener("reset", () => {
        // Esperar a que el navegador restablezca los campos.
        queueMicrotask(() => {
            preferencias.hidden = true;
            seccionPropuestas.hidden = true;
            seccionPublicadas.hidden = true;
            seccionMapa.hidden = true;
            lista.replaceChildren();

            filtrarRutasPublicadas("", "");

            mensaje.textContent =
                "Búsqueda limpiada. Completa los campos para buscar nuevas rutas.";
        });
    });
}
