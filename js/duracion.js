// Convierte duraciones escritas en horas y minutos a un total de minutos.
// Si el texto usa un formato desconocido, devuelve NaN para no inventar un valor.
export function duracionEnMinutos(ruta) {
    const texto = ruta.duracion.toLocaleLowerCase("es-CL");
    const coincidenciaHoras = texto.match(/(\d+(?:[.,]\d+)?)\s*h(?:oras?)?(?=\s|\d|$)/);
    const coincidenciaMinutos = texto.match(/(\d+(?:[.,]\d+)?)\s*m(?:in(?:uto)?s?)?(?=\s|\d|$)/);
    if (!coincidenciaHoras && !coincidenciaMinutos)
        return Number.NaN;
    const horas = coincidenciaHoras
        ? Number.parseFloat(coincidenciaHoras[1].replace(",", "."))
        : 0;
    const minutos = coincidenciaMinutos
        ? Number.parseFloat(coincidenciaMinutos[1].replace(",", "."))
        : 0;
    return Math.round(horas * 60 + minutos);
}
// Presenta los minutos en un formato breve para las tarjetas de rutas.
export function formatearDuracion(minutos) {
    if (!Number.isFinite(minutos) || minutos < 0)
        return "Duración no disponible";
    const total = Math.round(minutos);
    const horas = Math.floor(total / 60);
    const restoMinutos = total % 60;
    if (horas > 0 && restoMinutos > 0)
        return `${horas} h ${restoMinutos} min`;
    if (horas > 0)
        return `${horas} h`;
    return `${restoMinutos} min`;
}
