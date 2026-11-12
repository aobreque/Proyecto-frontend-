import { API_COMERCIOS_BASE_URL, obtener } from "./api.js";
const listaComercios = document.querySelector("#lista-comercios");
function mostrarEstado(texto, tipo) {
    if (!listaComercios)
        return;
    const estado = document.createElement("p");
    estado.className = `col-12 alert alert-${tipo} mb-0`;
    estado.textContent = texto;
    estado.setAttribute("role", tipo === "danger" ? "alert" : "status");
    listaComercios.replaceChildren(estado);
}
function esComercio(dato) {
    if (typeof dato !== "object" || dato === null)
        return false;
    const comercio = dato;
    return ["id", "nombre", "descripcion", "ciudad", "direccion", "contacto"]
        .every((campo) => typeof comercio[campo] === "string");
}
function crearTarjeta(comercio) {
    const articulo = document.createElement("article");
    articulo.className = "emprendimiento card h-100";
    // El formulario no solicita fotografías: no atribuir imágenes ajenas a un negocio.
    const imagen = document.createElement("div");
    imagen.className = "comercio-sin-foto card-img-top";
    const inicial = document.createElement("span");
    inicial.textContent = (comercio.nombre?.trim().charAt(0) || "E").toLocaleUpperCase("es");
    inicial.setAttribute("aria-hidden", "true");
    const aviso = document.createElement("p");
    aviso.textContent = "Sin fotografía del emprendimiento";
    imagen.append(inicial, aviso);
    const nombre = document.createElement("h2");
    nombre.className = "card-title h5 emprendimiento__nombre";
    nombre.textContent = comercio.nombre || "Sin nombre";
    const ciudad = document.createElement("p");
    ciudad.className = "card-subtitle emprendimiento__ciudad";
    ciudad.textContent = comercio.ciudad || "Ciudad no indicada";
    const informacion = document.createElement("div");
    informacion.className = "card-body emprendimiento__info d-flex flex-column";
    const descripcion = document.createElement("p");
    descripcion.className = "card-text";
    descripcion.textContent = comercio.descripcion || "Sin descripción";
    const direccion = document.createElement("p");
    direccion.className = "card-text";
    direccion.textContent = `Dirección: ${comercio.direccion || "No indicada"}`;
    const contacto = document.createElement("p");
    contacto.className = "card-text";
    contacto.textContent = `Contacto: ${comercio.contacto || "No indicado"}`;
    informacion.append(nombre, ciudad, descripcion, direccion, contacto);
    const enlaceContacto = crearEnlaceContacto(comercio.contacto);
    if (enlaceContacto)
        informacion.append(enlaceContacto);
    articulo.append(imagen, informacion);
    return articulo;
}
// Crea la acción de correo solo cuando el contacto tiene un formato básico válido.
function crearEnlaceContacto(contacto) {
    const correo = contacto.trim();
    const partes = correo.split("@");
    if (partes.length !== 2 || !partes[0] || !partes[1] || /\s/.test(correo))
        return null;
    const enlace = document.createElement("a");
    enlace.className = "btn btn-outline-ecoruta mt-auto align-self-start";
    enlace.href = `mailto:${encodeURIComponent(partes[0])}@${encodeURIComponent(partes[1])}`;
    enlace.textContent = "Enviar correo";
    enlace.setAttribute("aria-label", `Enviar correo a ${correo}`);
    return enlace;
}
async function cargarComercios() {
    if (!listaComercios)
        return;
    mostrarEstado("Cargando comercios...", "info");
    try {
        const datos = await obtener(API_COMERCIOS_BASE_URL);
        if (!Array.isArray(datos) || !datos.every(esComercio)) {
            throw new Error("La respuesta no contiene una lista válida de comercios.");
        }
        if (datos.length === 0) {
            mostrarEstado("Todavía no hay comercios registrados.", "secondary");
            return;
        }
        listaComercios.replaceChildren(...datos.map(crearTarjeta));
    }
    catch (error) {
        const detalle = error instanceof Error ? error.message : "Error inesperado.";
        mostrarEstado(`No se pudieron cargar los comercios. ${detalle}`, "danger");
    }
}
void cargarComercios();
