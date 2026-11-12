// Carrusel manual de la portada: no cambia de imagen automáticamente.
const carrusel = document.querySelector("#inicio .carrusel");
const pista = carrusel?.querySelector(".carrusel__track");
const contenedorPuntos = document.querySelector("#puntos");
const botonAnterior = document.querySelector("#anterior");
const botonSiguiente = document.querySelector("#siguiente");
const anunciosCarrusel = document.querySelector("#anuncios");
if (carrusel && pista && contenedorPuntos && botonAnterior && botonSiguiente) {
    const pistaCarrusel = pista;
    const imagenes = Array.from(pistaCarrusel.querySelectorAll("img"));
    if (imagenes.length > 0) {
        let indiceActual = 0;
        imagenes.forEach((imagen, indice) => {
            const punto = document.createElement("button");
            punto.type = "button";
            punto.classList.add("carrusel__punto");
            punto.setAttribute("aria-label", `Mostrar imagen ${indice + 1} de ${imagenes.length}`);
            punto.addEventListener("click", () => mostrarImagen(indice));
            contenedorPuntos.appendChild(punto);
        });
        const indicadores = Array.from(contenedorPuntos.querySelectorAll(".carrusel__punto"));
        function mostrarImagen(indice) {
            indiceActual = (indice + imagenes.length) % imagenes.length;
            pistaCarrusel.style.transform = `translateX(-${indiceActual * 100}%)`;
            indicadores.forEach((indicador, posicion) => {
                if (posicion === indiceActual) {
                    indicador.setAttribute("aria-current", "true");
                }
                else {
                    indicador.removeAttribute("aria-current");
                }
            });
            if (anunciosCarrusel) {
                const descripcion = imagenes[indiceActual].alt;
                anunciosCarrusel.textContent =
                    `Imagen ${indiceActual + 1} de ${imagenes.length}. ` +
                        (descripcion || "Sin descripción disponible.");
            }
        }
        botonAnterior.addEventListener("click", () => mostrarImagen(indiceActual - 1));
        botonSiguiente.addEventListener("click", () => mostrarImagen(indiceActual + 1));
        // Las flechas del teclado funcionan cuando el foco está dentro del carrusel.
        carrusel.addEventListener("keydown", (evento) => {
            if (evento.key === "ArrowLeft") {
                evento.preventDefault();
                mostrarImagen(indiceActual - 1);
            }
            else if (evento.key === "ArrowRight") {
                evento.preventDefault();
                mostrarImagen(indiceActual + 1);
            }
        });
        mostrarImagen(0);
    }
}
export {};
