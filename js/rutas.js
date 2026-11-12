import { API_RUTAS_BASE_URL, obtener } from "./api.js";
import { duracionEnMinutos, formatearDuracion } from "./duracion.js";
import { filtrarRutas, normalizarTexto } from "./rutas-utils.js";
const listaRutas = document.querySelector("#lista-destinos");
const formularioRuta = document.querySelector("#form-ruta");
const resultadoRuta = document.querySelector("#resultado-ruta");
const panelItinerario = document.querySelector("#panel-itinerario");
const detalleItinerario = document.querySelector("#detalle-itinerario");
const cerrarItinerario = document.querySelector("#cerrar-itinerario");
const anunciosRuta = document.querySelector("#anuncios");
let rutasDisponibles = [];
let falloCarga = false;
function esRuta(dato) {
    if (typeof dato !== "object" || dato === null)
        return false;
    const ruta = dato;
    return [
        "id",
        "createdAt",
        "nombre",
        "origen",
        "destino",
        "duracion",
        "transporte",
        "itinerario"
    ].every((campo) => typeof ruta[campo] === "string");
}
function mostrarEstado(mensaje) {
    if (!listaRutas)
        return;
    const elemento = document.createElement("li");
    elemento.className = "col-12 ecoruta-estado-rutas";
    elemento.textContent = mensaje;
    listaRutas.replaceChildren(elemento);
}
function agregarTexto(contenedor, etiqueta, texto) {
    const parrafo = document.createElement("p");
    parrafo.textContent = `${etiqueta}: ${texto}`;
    contenedor.appendChild(parrafo);
}
function textoDuracion(ruta) {
    const minutos = duracionEnMinutos(ruta);
    if (!Number.isFinite(minutos)) {
        return ruta.duracion || "Duración no indicada";
    }
    const aproximada = ruta.duracion.toLocaleLowerCase("es-CL").includes("aprox");
    return `${formatearDuracion(minutos)}${aproximada ? " aprox." : ""}`;
}
function mostrarItinerario(ruta) {
    if (!panelItinerario || !detalleItinerario)
        return;
    detalleItinerario.replaceChildren();
    const titulo = document.createElement("h3");
    titulo.textContent = ruta.nombre;
    detalleItinerario.appendChild(titulo);
    agregarTexto(detalleItinerario, "Origen", ruta.origen);
    agregarTexto(detalleItinerario, "Destino", ruta.destino);
    agregarTexto(detalleItinerario, "Duración", textoDuracion(ruta));
    agregarTexto(detalleItinerario, "Transporte", ruta.transporte);
    const pasos = document.createElement("ol");
    ruta.itinerario.split(";").map((paso) => paso.trim()).filter(Boolean).forEach((paso) => {
        const elemento = document.createElement("li");
        elemento.textContent = paso;
        pasos.appendChild(elemento);
    });
    detalleItinerario.appendChild(pasos);
    panelItinerario.hidden = false;
}
function mostrarRutas(rutas) {
    if (!listaRutas)
        return;
    if (rutas.length === 0) {
        mostrarEstado("No encontramos rutas que coincidan con ese origen y destino.");
        return;
    }
    const tarjetas = rutas.map((ruta) => {
        const tarjeta = document.createElement("li");
        tarjeta.className = "col";
        const contenido = document.createElement("article");
        contenido.className = "card h-100 ecoruta-ruta-card";
        const cuerpo = document.createElement("div");
        cuerpo.className = "card-body d-flex flex-column";
        const titulo = document.createElement("h3");
        titulo.textContent = ruta.nombre;
        titulo.className = "card-title h5";
        const resumen = document.createElement("p");
        resumen.textContent =
            `${ruta.origen} → ${ruta.destino} · ${textoDuracion(ruta)} · ${ruta.transporte}`;
        resumen.className = "card-text";
        const botonDetalle = document.createElement("button");
        botonDetalle.type = "button";
        botonDetalle.className = "btn btn-outline-success mt-auto align-self-start";
        botonDetalle.textContent = "Ver itinerario";
        botonDetalle.addEventListener("click", () => mostrarItinerario(ruta));
        cuerpo.append(titulo, resumen, botonDetalle);
        contenido.appendChild(cuerpo);
        tarjeta.appendChild(contenido);
        return tarjeta;
    });
    listaRutas.replaceChildren(...tarjetas);
}
async function cargarRutas() {
    if (!listaRutas)
        return;
    mostrarEstado("Cargando rutas...");
    try {
        const datos = await obtener(`${API_RUTAS_BASE_URL}/rutas`);
        if (!Array.isArray(datos) || !datos.every(esRuta)) {
            throw new Error("La respuesta no contiene una lista válida de rutas.");
        }
        rutasDisponibles = datos;
        falloCarga = false;
        mostrarRutas(rutasDisponibles);
    }
    catch (error) {
        falloCarga = true;
        const detalle = error instanceof Error ? error.message : "Error inesperado.";
        mostrarEstado(`No se pudieron cargar las rutas. ${detalle}`);
    }
}
if (formularioRuta && resultadoRuta) {
    const campoOrigen = formularioRuta.querySelector("#origen");
    const campoDestino = formularioRuta.querySelector("#destino");
    const campoFecha = formularioRuta.querySelector("#fecha-viaje");
    const campoPasajeros = formularioRuta.querySelector("#pasajeros");
    if (campoOrigen && campoDestino && campoFecha && campoPasajeros) {
        const hoy = new Date();
        campoFecha.min = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 10);
        formularioRuta.addEventListener("submit", (evento) => {
            evento.preventDefault();
            resultadoRuta.textContent = "";
            const origen = campoOrigen.value;
            const destino = campoDestino.value;
            const fecha = campoFecha.value;
            const pasajeros = Number(campoPasajeros.value);
            if (!origen || !destino) {
                resultadoRuta.textContent = "Selecciona una ciudad de origen y una de destino.";
                campoOrigen.focus();
                return;
            }
            if (normalizarTexto(origen) === normalizarTexto(destino)) {
                resultadoRuta.textContent = "El origen y el destino deben ser ciudades diferentes.";
                campoDestino.focus();
                return;
            }
            if (!fecha) {
                resultadoRuta.textContent = "Selecciona la fecha de tu viaje.";
                campoFecha.focus();
                return;
            }
            if (!Number.isInteger(pasajeros) || pasajeros < 1 || pasajeros > 20) {
                resultadoRuta.textContent = "Indica entre 1 y 20 pasajeros.";
                campoPasajeros.focus();
                return;
            }
            if (falloCarga) {
                resultadoRuta.textContent = "No se pudo consultar la lista de rutas. Intenta recargar la página.";
                resultadoRuta.focus();
                return;
            }
            const rutasFiltradas = filtrarRutas(rutasDisponibles, origen, destino);
            mostrarRutas(rutasFiltradas);
            resultadoRuta.textContent = rutasFiltradas.length > 0
                ? `Encontramos ${rutasFiltradas.length} ruta(s) publicada(s) para ${origen} → ${destino}. Fecha: ${fecha}. Pasajeros: ${pasajeros}.`
                : `No hay rutas publicadas para ${origen} → ${destino}.`;
            if (anunciosRuta)
                anunciosRuta.textContent = resultadoRuta.textContent;
            resultadoRuta.focus();
        });
    }
}
cerrarItinerario?.addEventListener("click", () => {
    if (panelItinerario)
        panelItinerario.hidden = true;
});
void cargarRutas();
