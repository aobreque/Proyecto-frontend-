import type { Ruta } from "./types.js";
import { API_RUTAS_BASE_URL, obtener } from "./api.js";
import { duracionEnMinutos, formatearDuracion } from "./duracion.js";
import { filtrarRutas } from "./rutas-utils.js";

const listaRutas = document.querySelector<HTMLUListElement>("#lista-rutas-publicadas");
const panelItinerario = document.querySelector<HTMLElement>("#panel-itinerario");
const detalleItinerario = document.querySelector<HTMLElement>("#detalle-itinerario");
const cerrarItinerario = document.querySelector<HTMLButtonElement>("#cerrar-itinerario");
const anunciosRuta = document.querySelector<HTMLElement>("#anuncios");

let rutasDisponibles: Ruta[] = [];
let cargandoPublicadas = true;
let errorPublicadas = "";
let filtrosPublicados = { origen: "", destino: "" };

function esRuta(dato: unknown): dato is Ruta {
    if (typeof dato !== "object" || dato === null) return false;

    const ruta = dato as Record<string, unknown>;
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

function mostrarEstado(mensaje: string): void {
    if (!listaRutas) return;

    const elemento = document.createElement("li");
    elemento.className = "card";
    elemento.textContent = mensaje;
    listaRutas.replaceChildren(elemento);
}

function agregarTexto(contenedor: HTMLElement, etiqueta: string, texto: string): void {
    const parrafo = document.createElement("p");
    parrafo.textContent = `${etiqueta}: ${texto}`;
    contenedor.appendChild(parrafo);
}

function textoDuracion(ruta: Ruta): string {
    const minutos = duracionEnMinutos(ruta);

    if (!Number.isFinite(minutos)) {
        return ruta.duracion || "Duración no indicada";
    }

    const aproximada = ruta.duracion.toLocaleLowerCase("es-CL").includes("aprox");
    return `${formatearDuracion(minutos)}${aproximada ? " aprox." : ""}`;
}

function mostrarItinerario(ruta: Ruta): void {
    if (!panelItinerario || !detalleItinerario) return;

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

function mostrarRutas(rutas: readonly Ruta[]): void {
    if (!listaRutas) return;

    if (rutas.length === 0) {
        mostrarEstado("No encontramos rutas que coincidan con ese origen y destino.");
        return;
    }

    const tarjetas = rutas.map((ruta) => {
        const tarjeta = document.createElement("li");
        tarjeta.className = "card";

        const titulo = document.createElement("h3");
        titulo.textContent = ruta.nombre;

        const resumen = document.createElement("p");
        resumen.textContent =
            `${ruta.origen} → ${ruta.destino} · ${textoDuracion(ruta)} · ${ruta.transporte}`;

        const botonDetalle = document.createElement("button");
        botonDetalle.type = "button";
        botonDetalle.textContent = "Ver itinerario";
        botonDetalle.addEventListener("click", () => mostrarItinerario(ruta));

        tarjeta.append(titulo, resumen, botonDetalle);
        return tarjeta;
    });

    listaRutas.replaceChildren(...tarjetas);
}

async function cargarRutas(): Promise<void> {
    if (!listaRutas) return;

    mostrarEstado("Cargando rutas...");
    try {
        const datos = await obtener<unknown>(`${API_RUTAS_BASE_URL}/rutas`);
        if (!Array.isArray(datos) || !datos.every(esRuta)) {
            throw new Error("La respuesta no contiene una lista válida de rutas.");
        }

        rutasDisponibles = datos;
        cargandoPublicadas = false;
        mostrarRutas(filtrarRutas(rutasDisponibles, filtrosPublicados.origen, filtrosPublicados.destino));
    } catch (error: unknown) {

        const detalle = error instanceof Error ? error.message : "Error inesperado.";
        cargandoPublicadas = false;
        errorPublicadas = `No se pudieron cargar las rutas. ${detalle}`;
        mostrarEstado(errorPublicadas);
    }
}

// Reutiliza el filtro de origen/destino de integración desde el formulario ampliado.
export function filtrarRutasPublicadas(origen: string, destino: string): void {
    filtrosPublicados = { origen, destino };
    if (panelItinerario) panelItinerario.hidden = true;
    if (cargandoPublicadas) mostrarEstado("Cargando rutas...");
    else if (errorPublicadas) mostrarEstado(errorPublicadas);
    else mostrarRutas(filtrarRutas(rutasDisponibles, origen, destino));
    if (anunciosRuta) anunciosRuta.textContent = "Se actualizaron las propuestas y las rutas publicadas.";
}

cerrarItinerario?.addEventListener("click", () => {
    if (panelItinerario) panelItinerario.hidden = true;
});

void cargarRutas();
