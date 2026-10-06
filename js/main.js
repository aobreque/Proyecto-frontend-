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

    localStorage.setItem('modoOscuro', activado);
});