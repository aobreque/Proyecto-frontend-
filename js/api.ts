// Las APIs pertenecen a proyectos MockAPI distintos y usan bases diferentes.
export const API_RUTAS_BASE_URL = "https://6ad9530ff89c5702ed9a864f.mockapi.io/api/v1";
export const API_COMERCIOS_BASE_URL = "https://6ae15049be3bc8fead98617f.mockapi.io/comercios";

async function solicitar<T>(url: string, opciones?: RequestInit): Promise<T> {
    let respuesta: Response;

    try {
        respuesta = await fetch(url, opciones);
    } catch {
        throw new Error("No se pudo conectar con el servidor. Comprueba tu conexión.");
    }

    if (!respuesta.ok) {
        throw new Error(`La solicitud falló (HTTP ${respuesta.status}).`);
    }

    try {
        return await respuesta.json() as T;
    } catch {
        throw new Error("El servidor devolvió una respuesta JSON no válida.");
    }
}

// Obtiene una respuesta y la devuelve con el tipo indicado por el módulo que la usa.
export function obtener<T>(url: string): Promise<T> {
    return solicitar<T>(url);
}

// Envía datos JSON y devuelve la respuesta con el tipo indicado por el módulo.
export function enviar<T>(url: string, datos: object): Promise<T> {
    return solicitar<T>(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });
}
