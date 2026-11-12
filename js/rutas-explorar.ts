import { filtrarRutasPublicadas } from "./rutas.js";
import { propuestas, type PropuestaRuta } from "./rutas-catalogo.js";

export interface FiltrosRuta { destino: string; modalidad: string; transporte: string; }
export function filtrarPropuestas(rutas: PropuestaRuta[], filtros: FiltrosRuta): PropuestaRuta[] {
    return rutas.filter(ruta => (!filtros.destino || ruta.destino === filtros.destino)
        && (!filtros.modalidad || ruta.modalidad === filtros.modalidad)
        && (!filtros.transporte || ruta.transporte === filtros.transporte));
}

const formulario = document.querySelector<HTMLFormElement>("#form-ruta");
const listado = document.querySelector<HTMLDivElement>("#lista-destinos");
const estado = document.querySelector<HTMLParagraphElement>("#resultado-ruta");
if (formulario && listado && estado) {
    const form = formulario, lista = listado, mensaje = estado;
    function campo(id: string): HTMLInputElement | HTMLSelectElement {
        const elemento = form.querySelector(`#${id}`);
        if (!(elemento instanceof HTMLInputElement || elemento instanceof HTMLSelectElement)) {
            throw new Error(`Falta el campo ${id}`);
        }
        return elemento;
    }
    const origen = campo("origen"), destino = campo("destino"), fecha = campo("fecha-viaje");
    const modalidad = campo("modalidad"), transporte = campo("transporte");
    const hoy = new Date();
    fecha.setAttribute("min", `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,"0")}-${String(hoy.getDate()).padStart(2,"0")}`);

    function parrafo(texto: string): HTMLParagraphElement {
        const p = document.createElement("p"); p.textContent = texto; return p;
    }
    function renderizar(rutas: PropuestaRuta[]): void {
        lista.replaceChildren();
        if (!rutas.length) {
            lista.append(parrafo("No hay propuestas para esa combinación. Prueba otro destino, modalidad o medio de desplazamiento. No se ha realizado ninguna reserva."));
            return;
        }
        rutas.forEach(ruta => {
            const tarjeta = document.createElement("article"); tarjeta.className = "ec-propuesta";
            const titulo = document.createElement("h3"); titulo.textContent = ruta.nombre;
            const etiqueta = parrafo("Recorrido sugerido"); etiqueta.className = "ec-etiqueta";
            const detalle = document.createElement("details"), resumen = document.createElement("summary");
            resumen.textContent = "Ver propuesta de recorrido";
            detalle.append(resumen, parrafo(`Punto de referencia: ${ruta.localidad}. Explora el entorno del destino y confirma los accesos antes de viajar.`), parrafo("La modalidad y el medio de desplazamiento son opciones para planificar; no confirman guías ni transporte disponibles."));
            const fuente = document.createElement("a"); fuente.href = ruta.fuente; fuente.textContent = "Consultar información oficial";
            detalle.append(fuente);
            tarjeta.append(etiqueta,titulo,parrafo(ruta.descripcion),parrafo(`${ruta.modalidad === "guiada" ? "Modalidad sugerida: con guía" : "Modalidad sugerida: autoguiada"} · ${ruta.transporte === "pie" ? "Recorrido a pie" : "Desplazamiento en vehículo"}`),detalle);
            lista.append(tarjeta);
        });
    }
    function buscar(): void {
        const resultados = filtrarPropuestas(propuestas, {destino: destino.value, modalidad: modalidad.value, transporte: transporte.value});
        renderizar(resultados);
        const destinosPublicados: Record<string, string> = { conguillio: "Conguillío", malalcahuello: "Malalcahuello", nahuelbuta: "Nahuelbuta", budi: "Lago Budi" };
        const localidad = destinosPublicados[destino.value] ?? propuestas.find(ruta => ruta.destino === destino.value)?.localidad ?? "";
        filtrarRutasPublicadas(origen.value, localidad);
        mensaje.textContent = `${resultados.length} propuestas. Origen de planificación: ${origen.value}. Fecha deseada: ${fecha.value}. No confirma cupos ni servicios.`;
        mensaje.focus();
    }
    const parametro = new URLSearchParams(window.location.search).get("destino");
    if (parametro && propuestas.some(ruta => ruta.destino === parametro)) destino.value = parametro;
    renderizar(filtrarPropuestas(propuestas,{destino: destino.value,modalidad:"",transporte:""}));
    if (parametro && destino.value) mensaje.textContent = "Destino seleccionado desde Turismo. Completa origen, fecha y tus preferencias para filtrar las propuestas.";
    form.addEventListener("submit", evento => {
        evento.preventDefault();
        if (form.reportValidity()) buscar();
    });
    form.addEventListener("reset", () => {
        // Espera a que el navegador restablezca los valores del formulario.
        queueMicrotask(() => { renderizar(propuestas); filtrarRutasPublicadas("", ""); mensaje.textContent = "Filtros restablecidos. Se muestran todas las propuestas."; });
    });
}
