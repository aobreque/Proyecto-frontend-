import { API_RUTAS_BASE_URL, obtener } from "./api.js";
import { duracionEnMinutos, formatearDuracion } from "./duracion.js";
import { filtrarRutas } from "./rutas-utils.js";
const listaRutas = document.querySelector("#lista-rutas-publicadas");
const panelItinerario = document.querySelector("#panel-itinerario");
const detalleItinerario = document.querySelector("#detalle-itinerario");
const cerrarItinerario = document.querySelector("#cerrar-itinerario");
const anunciosRuta = document.querySelector("#anuncios");
let rutasDisponibles = [];
let cargandoPublicadas = true;
let errorPublicadas = "";
let filtrosPublicados = { origen: "", destino: "" };
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
        cargandoPublicadas = false;
        mostrarRutas(filtrarRutas(rutasDisponibles, filtrosPublicados.origen, filtrosPublicados.destino));
    }
    catch (error) {
        const detalle = error instanceof Error ? error.message : "Error inesperado.";
        cargandoPublicadas = false;
        errorPublicadas = `No se pudieron cargar las rutas. ${detalle}`;
        mostrarEstado(errorPublicadas);
    }
}
// Reutiliza el filtro de origen/destino de integración desde el formulario ampliado.
export function filtrarRutasPublicadas(origen, destino) {
    filtrosPublicados = { origen, destino };
    if (panelItinerario)
        panelItinerario.hidden = true;
    if (cargandoPublicadas)
        mostrarEstado("Cargando rutas...");
    else if (errorPublicadas)
        mostrarEstado(errorPublicadas);
    else
        mostrarRutas(filtrarRutas(rutasDisponibles, origen, destino));
    if (anunciosRuta)
        anunciosRuta.textContent = "Se actualizaron las propuestas y las rutas publicadas.";
}
cerrarItinerario?.addEventListener("click", () => {
    if (panelItinerario)
        panelItinerario.hidden = true;
});
void cargarRutas();
