const carrusel = document.querySelector('#inicio .carrusel') as HTMLElement | null;
const track = carrusel?.querySelector('.carrusel__track') as HTMLElement | null;
const puntos = document.getElementById('puntos');
const btnAnterior = document.getElementById('anterior');
const btnSiguiente = document.getElementById('siguiente');

if (carrusel && track && puntos && btnAnterior && btnSiguiente) {
    const imagenes = track.querySelectorAll('img');

    if (imagenes.length > 0) {
        let indiceActual: number = 0;

        //crear los indicadores de las imaegnes
        imagenes.forEach((imagen, indice) => {
            const punto = document.createElement('button');

            punto.type = 'button';
            punto.classList.add('carrusel__punto');
            punto.setAttribute('aria-label',
                `Mostrar imagen ${indice + 1} de ${imagenes.length}`);

            punto.addEventListener('click', () => {
                mostrarImagen(indice);
            });

            puntos.appendChild(punto);
        });

        const indicadores = puntos.querySelectorAll('.carrusel__punto');

        // Mostrar una imagen y actualizar lso inficadores
        function mostrarImagen(indice: number): void {
            indiceActual = (indice + imagenes.length) % imagenes.length;

            track.style.transform = `translateX(-${indiceActual * 100}%)`;

            indicadores.forEach((indicador, posicion) => {
                if (posicion === indiceActual) {
                    indicador.setAttribute('aria-current', 'true');
                } else {
                    indicador.removeAttribute('aria-current');
                }
            });
            // falta la mitad pero squi la primera parte