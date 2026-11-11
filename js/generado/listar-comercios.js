function esComercio(valor) {
    if (typeof valor !== "object" || valor === null)
        return false;
    const comercio = valor;
    return ["nombre", "ciudad", "descripcion", "direccion", "contacto"].every(campo => comercio[campo] === undefined || typeof comercio[campo] === "string");
}
const API_COMERCIOS = "https://6ae15049be3bc8fead98617f.mockapi.io/comercios";
const listaComercios = document.getElementById("lista-comercios");
function crearTarjeta(comercio) {
    const articulo = document.createElement("article");
    articulo.className = "emprendimiento";
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
    descripcion.textContent =
        comercio.descripcion || "Sin descripción";
    const direccion = document.createElement("p");
    direccion.textContent =
        `Dirección: ${comercio.direccion || "No indicada"}`;
    const contacto = document.createElement("p");
    contacto.textContent =
        `Contacto: ${comercio.contacto || "No indicado"}`;
    ficha.append(imagen, nombre, ciudad);
    informacion.append(descripcion, direccion, contacto);
    articulo.append(ficha, informacion);
    return articulo;
}
async function cargarComercios() {
    const lista = listaComercios;
    if (!lista)
        return;
    lista.textContent = "Cargando comercios...";
    try {
        const respuesta = await fetch(API_COMERCIOS);
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        const comercios = await respuesta.json();
        if (!Array.isArray(comercios) || !comercios.every(esComercio)) {
            throw new Error("La API no devolvió una lista.");
        }
        lista.replaceChildren();
        if (comercios.length === 0) {
            lista.textContent =
                "Todavía no hay comercios registrados.";
            return;
        }
        comercios.forEach((comercio) => {
            const tarjeta = crearTarjeta(comercio);
            lista.appendChild(tarjeta);
        });
    }
    catch (error) {
        console.error("Error al cargar comercios:", error);
        lista.textContent =
            "No se pudieron cargar los comercios. Intenta nuevamente.";
    }
}
cargarComercios();
export {};
