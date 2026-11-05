import type { Comercio } from "./types.js";

const URL_COMERCIOS = "https://6ae15049be3bc8fead98617f.mockapi.io/comercios";
const listaComercios = document.querySelector<HTMLElement>("#lista-comercios");

function esComercio(dato: unknown): dato is Comercio {
    if (typeof dato !== "object" || dato === null) return false;

    const comercio = dato as Record<string, unknown>;
    return ["id", "nombre", "descripcion", "ciudad", "direccion", "contacto"]
        .every((campo) => typeof comercio[campo] === "string");
}

function crearTarjeta(comercio: Comercio): HTMLElement {
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
    const indiceImagen = (Number(comercio.id) || 1) - 1;
    imagen.src = imagenes[indiceImagen % imagenes.length];
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
        const respuesta = await fetch(URL_COMERCIOS);
        if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);

        const datos: unknown = await respuesta.json();
        if (!Array.isArray(datos) || !datos.every(esComercio)) {
            throw new Error("La respuesta no contiene una lista válida de comercios.");
        }

        if (datos.length === 0) {
            listaComercios.textContent = "Todavía no hay comercios registrados.";
            return;
        }

        listaComercios.replaceChildren(...datos.map(crearTarjeta));
    } catch {
        listaComercios.textContent = "No se pudieron cargar los comercios. Intenta nuevamente.";
    }
}

void cargarComercios();
