const carrusel = document.querySelector('#inicio .carrusel');
const track = carrusel?.querySelector('.carrusel__track');
const puntos = document.getElementById('puntos');
const btnAnterior = document.getElementById('anterior');
const btnSiguiente = document.getElementById('siguiente');

if (carrusel && track && puntos && btnAnterior && btnSiguiente) {
    const imagenes = track.querySelectorAll('img');

    if (imagenes.length > 0) {
        let indiceActual = 0;

        // Crear los indicadores de las imagenes.
        imagenes.forEach((imagen, indice) => {
            const punto = document.createElement('button');

            punto.type = 'button';
            punto.classList.add('carrusel__punto');
            punto.setAttribute(
                'aria-label',
                `Mostrar imagen ${indice + 1} de ${imagenes.length}`
            );

            punto.addEventListener('click', () => {
                mostrarImagen(indice);
            });

            puntos.appendChild(punto);
        });

        const indicadores = puntos.querySelectorAll('.carrusel__punto');

        // Mostrar una imagen y actualizar los indicadores.
        function mostrarImagen(indice) {
            indiceActual = (indice + imagenes.length) % imagenes.length;

            track.style.transform = `translateX(-${indiceActual * 100}%)`;

            indicadores.forEach((indicador, posicion) => {
                if (posicion === indiceActual) {
                    indicador.setAttribute('aria-current', 'true');
                } else {
                    indicador.removeAttribute('aria-current');
                }
            });

            if (anuncios) {
                const descripcion = imagenes[indiceActual].alt;

                anuncios.textContent =
                    `Imagen ${indiceActual + 1} de ${imagenes.length}. ` +
                    (descripcion ? descripcion : 'Sin descripción disponible.');
            }
        }

        // Ir a la imagen anterior.
        btnAnterior.addEventListener('click', () => {
            mostrarImagen(indiceActual - 1);
        });

        // Ir a la imagen siguiente.
        btnSiguiente.addEventListener('click', () => {
            mostrarImagen(indiceActual + 1);
        });

        // Configurar el carrusel al cargar la pagina.
        mostrarImagen(0);
    }
}