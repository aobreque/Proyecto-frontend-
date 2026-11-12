import type { Comercio } from "./types.js";
import { API_COMERCIOS_BASE_URL, obtener } from "./api.js";

const listaComercios = document.querySelector<HTMLElement>("#lista-comercios");

function esComercio(dato: unknown): dato is Comercio {
    if (typeof dato !== "object" || dato === null) return false;

    const comercio = dato as Record<string, unknown>;
    return ["id", "nombre", "descripcion", "ciudad", "direccion", "contacto"]
        .every((campo) => typeof comercio[campo] === "string");
}

function crearTarjeta(comercio: Comercio): HTMLElement {
    const articulo = document.createElement("article");
    articulo.className = "emprendimiento card h-100";

    const ficha = document.createElement("div");
    ficha.className = "emprendimiento__ficha";

    // El formulario no solicita fotografías: no atribuir imágenes ajenas a un negocio.
    const imagen = document.createElement("div");
    imagen.className = "comercio-sin-foto";
    const inicial = document.createElement("span");
    inicial.textContent = (comercio.nombre?.trim().charAt(0) || "E").toLocaleUpperCase("es");
    inicial.setAttribute("aria-hidden", "true");
    const aviso = document.createElement("p");
    aviso.textContent = "Sin fotografía del emprendimiento";
    imagen.append(inicial, aviso);

    const nombre = document.createElement("h2");
    nombre.className = "emprendimiento__nombre";
    nombre.textContent = comercio.nombre || "Sin nombre";

    const ciudad = document.createElement("p");
    ciudad.className = "emprendimiento__ciudad";
    ciudad.textContent = comercio.ciudad || "Ciudad no indicada";

    const informacion = document.createElement("div");
    informacion.className = "emprendimiento__info";

    const descripcion = document.createElement("p");
    descripcion.textContent = comercio.descripcion || "Sin descripción";
    const direccion = document.createElement("p");
    direccion.textContent = `Dirección: ${comercio.direccion || "No indicada"}`;
    const contacto = document.createElement("p");
    contacto.textContent = `Contacto: ${comercio.contacto || "No indicado"}`;

    ficha.append(imagen, nombre, ciudad);
    informacion.append(descripcion, direccion, contacto);
    articulo.append(ficha, informacion);
    return articulo;
}

async function cargarComercios(): Promise<void> {
    if (!listaComercios) return;
    listaComercios.textContent = "Cargando comercios...";

    try {
        const datos = await obtener<unknown>(API_COMERCIOS_BASE_URL);
        if (!Array.isArray(datos) || !datos.every(esComercio)) {
            throw new Error("La respuesta no contiene una lista válida de comercios.");
        }

        if (datos.length === 0) {
            listaComercios.textContent = "Todavía no hay comercios registrados.";
            return;
        }

        listaComercios.replaceChildren(...datos.map(crearTarjeta));
    } catch (error: unknown) {
        const detalle = error instanceof Error ? error.message : "Error inesperado.";
        listaComercios.textContent = `No se pudieron cargar los comercios. ${detalle}`;
    }
}

void cargarComercios();
