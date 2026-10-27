const btnModoOscuro = document.getElementById('btn-modo-oscuro');

if (localStorage.getItem('modoOscuro') === 'true') {
    document.body.classList.add('modo-oscuro');
    btnModoOscuro.setAttribute('aria-pressed', 'true');
    btnModoOscuro.textContent = '☀️';
}

btnModoOscuro.addEventListener('click', () => {
    document.body.classList.toggle('modo-oscuro');
    const activado = document.body.classList.contains('modo-oscuro');

    btnModoOscuro.setAttribute('aria-pressed', activado);
    btnModoOscuro.textContent = activado ? '☀️' : '🌙';
    anuncios.textContent = activado ? 'Modo oscuro activado' : 'Modo oscuro desactivado';

    localStorage.setItem('modoOscuro', activado);
});

const btnLetraMas = document.getElementById('btn-letra-mas');
const btnLetraMenos = document.getElementById('btn-letra-menos');
const anuncios = document.getElementById('anuncios');

let tamanoBase = parseInt(localStorage.getItem('tamanoLetra')) || 100;
document.documentElement.style.fontSize = tamanoBase + '%';

function actualizarTamano() {
    document.documentElement.style.fontSize = tamanoBase + '%';
    localStorage.setItem('tamanoLetra', tamanoBase);
    anuncios.textContent = 'Tamaño de letra: ' + tamanoBase + '%';
}

btnLetraMas.addEventListener('click', () => {
    if (tamanoBase < 200) {
        tamanoBase += 10;
        actualizarTamano();
    }
});

btnLetraMenos.addEventListener('click', () => {
    if (tamanoBase > 80) {
        tamanoBase -= 10;
        actualizarTamano();
    }
});