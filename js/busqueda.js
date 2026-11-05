import { normalizarTexto } from "./rutas-utils.js";
const buscador = document.querySelector("header search input[type='search']");
const botonBuscar = document.querySelector("header .btn-buscar");
const anuncioBusqueda = document.querySelector("#anuncios");
const elementosFiltrables = () => Array.from(document.querySelectorAll("main .card, main .emprendimiento"));
function filtrarContenido() {
    if (!buscador)
        return 0;
    const textoBuscado = normalizarTexto(buscador.value);
    const elementos = elementosFiltrables();
    let cantidadVisible = 0;
    elementos.forEach((elemento) => {
        const coincide = textoBuscado === "" ||
            normalizarTexto(elemento.textContent ?? "").includes(textoBuscado);
        elemento.hidden = !coincide;
        // Algunas tarjetas tienen display propio en CSS, así que se refuerza el ocultamiento.
        elemento.style.display = coincide ? "" : "none";
        if (coincide)
            cantidadVisible += 1;
    });
    return cantidadVisible;
}
function anunciarResultados() {
    const cantidad = filtrarContenido();
    if (!anuncioBusqueda || !buscador || elementosFiltrables().length === 0)
        return;
    anuncioBusqueda.textContent = buscador.value.trim() === ""
        ? "Se muestran todos los resultados."
        : `${cantidad} resultado(s) de búsqueda.`;
}
if (buscador) {
    buscador.addEventListener("input", () => {
        filtrarContenido();
    });
    buscador.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            evento.preventDefault();
            anunciarResultados();
        }
    });
    botonBuscar?.addEventListener("click", anunciarResultados);
    // Actualiza el filtro cuando una lista se completa desde la API.
    const contenidoPrincipal = document.querySelector("main");
    if (contenidoPrincipal) {
        const observador = new MutationObserver(() => filtrarContenido());
        observador.observe(contenidoPrincipal, { childList: true, subtree: true });
    }
}
