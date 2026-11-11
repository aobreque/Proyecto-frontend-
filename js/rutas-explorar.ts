import { propuestas, type PropuestaRuta } from "./rutas-catalogo.js";

export interface FiltrosRuta { destino: string; modalidad: string; transporte: string; integrantes: number; }
export function filtrarPropuestas(rutas: PropuestaRuta[], filtros: FiltrosRuta): PropuestaRuta[] {
    return rutas.filter(ruta => (!filtros.destino || ruta.destino === filtros.destino)
        && (!filtros.modalidad || ruta.modalidad === filtros.modalidad)
        && (!filtros.transporte || ruta.transporte === filtros.transporte)
        && Number.isInteger(filtros.integrantes) && filtros.integrantes >= 1
        && filtros.integrantes <= ruta.maxIntegrantes);
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
    const integrantes = campo("pasajeros"), modalidad = campo("modalidad"), transporte = campo("transporte");
    const hoy = new Date();
    fecha.setAttribute("min", `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,"0")}-${String(hoy.getDate()).padStart(2,"0")}`);

    function parrafo(texto: string): HTMLParagraphElement {
        const p = document.createElement("p"); p.textContent = texto; return p;
    }
    function renderizar(rutas: PropuestaRuta[]): void {
        lista.replaceChildren();
        if (!rutas.length) {
            lista.append(parrafo("No hay propuestas para esa combinación. Prueba otra modalidad, otro transporte o una cantidad de integrantes menor. No se ha realizado ninguna reserva."));
            return;
        }
        rutas.forEach(ruta => {
            const tarjeta = document.createElement("article"); tarjeta.className = "ec-propuesta";
            const titulo = document.createElement("h3"); titulo.textContent = ruta.nombre;
            const etiqueta = parrafo("Recorrido sugerido"); etiqueta.className = "ec-etiqueta";
            const detalle = document.createElement("details"), resumen = document.createElement("summary");
            resumen.textContent = "Ver propuesta de recorrido";
            detalle.append(resumen, parrafo(`Punto de referencia: ${ruta.localidad}. Explora el entorno del destino y confirma los accesos antes de viajar.`), parrafo("La modalidad y el tamaño del grupo son orientativos. Coordina guía y transporte con un prestador; no están incluidos ni confirmados."));
            const fuente = document.createElement("a"); fuente.href = ruta.fuente; fuente.textContent = "Consultar información oficial";
            detalle.append(fuente);
            tarjeta.append(etiqueta,titulo,parrafo(ruta.descripcion),parrafo(`${ruta.modalidad === "guiada" ? "Con guía" : "Autoguiada"} · ${ruta.transporte === "pie" ? "A pie en el destino" : "Transporte vehicular"} · Grupo propuesto: hasta ${ruta.maxIntegrantes} integrantes`),detalle);
            lista.append(tarjeta);
        });
    }
    function buscar(): void {
        const cantidad = Number(integrantes.value);
        const resultados = filtrarPropuestas(propuestas, {destino: destino.value, modalidad: modalidad.value, transporte: transporte.value, integrantes: cantidad});
        renderizar(resultados);
        mensaje.textContent = `${resultados.length} propuestas para ${cantidad} integrante(s). Origen de planificación: ${origen.value}. Fecha deseada: ${fecha.value}. No confirma cupos ni servicios.`;
        mensaje.focus();
    }
    const parametro = new URLSearchParams(window.location.search).get("destino");
    if (parametro && propuestas.some(ruta => ruta.destino === parametro)) destino.value = parametro;
    renderizar(filtrarPropuestas(propuestas,{destino: destino.value,modalidad:"",transporte:"",integrantes:1}));
    if (parametro && destino.value) mensaje.textContent = "Destino seleccionado desde Turismo. Completa origen, fecha y tus preferencias para filtrar las propuestas.";
    form.addEventListener("submit", evento => {
        evento.preventDefault();
        if (form.reportValidity()) buscar();
    });
    form.addEventListener("reset", () => {
        // Espera a que el navegador restablezca los valores del formulario.
        queueMicrotask(() => { renderizar(propuestas); mensaje.textContent = "Filtros restablecidos. Se muestran todas las propuestas."; });
    });
}
