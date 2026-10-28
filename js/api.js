const BASE_URL = "https://6ad9530ff89c5702ed9a864f.mockapi.io/api/v1";

function esc(texto) {
  const p = document.createElement("p");
  p.textContent = texto ?? "";
  return p.innerHTML;
}

async function obtener(ruta) {
  const resp = await fetch(`${BASE_URL}/${ruta}`);
  if (!resp.ok) throw new Error(`Error ${resp.status}`);
  return resp.json();
}

async function enviar(recurso, datos) {
  const resp = await fetch(`${BASE_URL}/${recurso}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });
  if (!resp.ok) throw new Error(`Error ${resp.status}`);
  return resp.json();
}

async function mostrarLista(contenedor, ruta, plantilla) {
  contenedor.textContent = "Cargando...";
  try {
    const datos = await obtener(ruta);
    contenedor.innerHTML = datos.length
      ? datos.map(plantilla).join("")
      : "<li>No hay resultados.</li>";
  } catch (error) {
    contenedor.textContent = "Error al cargar datos. Intenta nuevamente.";
  }
}

const tarjetaRuta = (r) => `
  <li class="card">
    <h3>${esc(r.nombre)}</h3>
    <p>${esc(r.origen)} → ${esc(r.destino)} · ${esc(r.duracion)} · ${esc(r.transporte)}</p>
    <ol>${esc(r.itinerario).split("; ").map((p) => `<li>${p}</li>`).join("")}</ol>
  </li>`;

const listaRutas = document.querySelector("#lista-rutas");
if (listaRutas) mostrarLista(listaRutas, "rutas", tarjetaRuta);