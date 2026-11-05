import type { Ruta } from "./types.js";
import { API_RUTAS_BASE_URL, obtener } from "./api.js";
import { filtrarRutas, normalizarTexto } from "./rutas-utils.js";

const listaRutas = document.querySelector<HTMLUListElement>("#lista-destinos");
const formularioRuta = document.querySelector<HTMLFormElement>("#form-ruta");
const resultadoRuta = document.querySelector<HTMLElement>("#resultado-ruta");
const panelItinerario = document.querySelector<HTMLElement>("#panel-itinerario");
const detalleItinerario = document.querySelector<HTMLElement>("#detalle-itinerario");
const cerrarItinerario = document.querySelector<HTMLButtonElement>("#cerrar-itinerario");
const anunciosRuta = document.querySelector<HTMLElement>("#anuncios");

let rutasDisponibles: Ruta[] = [];
let falloCarga = false;

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

function mostrarItinerario(ruta: Ruta): void {
    if (!panelItinerario || !detalleItinerario) return;

    detalleItinerario.replaceChildren();
    const titulo = document.createElement("h3");
    titulo.textContent = ruta.nombre;
    detalleItinerario.appendChild(titulo);

    agregarTexto(detalleItinerario, "Origen", ruta.origen);
    agregarTexto(detalleItinerario, "Destino", ruta.destino);
    agregarTexto(detalleItinerario, "Duración", ruta.duracion);
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
            `${ruta.origen} → ${ruta.destino} · ${ruta.duracion} · ${ruta.transporte}`;

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
        falloCarga = false;
        mostrarRutas(rutasDisponibles);
    } catch (error: unknown) {
        falloCarga = true;
        const detalle = error instanceof Error ? error.message : "Error inesperado.";
        mostrarEstado(`No se pudieron cargar las rutas. ${detalle}`);
    }
}

if (formularioRuta && resultadoRuta) {
    const campoOrigen = formularioRuta.querySelector<HTMLSelectElement>("#origen");
    const campoDestino = formularioRuta.querySelector<HTMLSelectElement>("#destino");
    const campoFecha = formularioRuta.querySelector<HTMLInputElement>("#fecha-viaje");
    const campoPasajeros = formularioRuta.querySelector<HTMLInputElement>("#pasajeros");

    if (campoOrigen && campoDestino && campoFecha && campoPasajeros) {
        const hoy = new Date();
        campoFecha.min = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 10);

        formularioRuta.addEventListener("submit", (evento: SubmitEvent) => {
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
            if (anunciosRuta) anunciosRuta.textContent = resultadoRuta.textContent;
            resultadoRuta.focus();
        });
    }
}

cerrarItinerario?.addEventListener("click", () => {
    if (panelItinerario) panelItinerario.hidden = true;
});

void cargarRutas();
