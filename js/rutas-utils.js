// Quita tildes y pasa el texto a minúsculas para comparar ciudades.
export function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .trim()
        .toLocaleLowerCase("es-CL");
}
// Filtra las rutas por origen y destino sin distinguir tildes o mayúsculas.
export function filtrarRutas(rutas, origen, destino) {
    const origenBuscado = normalizarTexto(origen);
    const destinoBuscado = normalizarTexto(destino);
    return rutas.filter((ruta) => {
        const coincideOrigen = origenBuscado === "" || normalizarTexto(ruta.origen) === origenBuscado;
        const coincideDestino = destinoBuscado === "" || normalizarTexto(ruta.destino) === destinoBuscado;
        return coincideOrigen && coincideDestino;
    });
}
