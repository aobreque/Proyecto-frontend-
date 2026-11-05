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
  function mostrarEstado(mensaje) {
    const elemento = document.createElement("li");
    elemento.className = "card";
    elemento.textContent = mensaje;
    contenedor.replaceChildren(elemento);
  }

  mostrarEstado("Cargando rutas...");
  try {
    const datos = await obtener(ruta);
    if (datos.length > 0) {
      contenedor.innerHTML = datos.map(plantilla).join("");
    } else {
      mostrarEstado("No hay rutas disponibles.");
    }
  } catch (error) {
    mostrarEstado("No se pudieron cargar las rutas. Intenta nuevamente.");
  }
}

const tarjetaRuta = (r) => `
  <li class="card">
    <h3>${esc(r.nombre)}</h3>
    <p>${esc(r.origen)} → ${esc(r.destino)} · ${esc(r.duracion)} · ${esc(r.transporte)}</p>
    <ol>${esc(r.itinerario).split("; ").map((p) => `<li>${p}</li>`).join("")}</ol>
  </li>`;

const listaRutas = document.querySelector("#lista-destinos");
if (listaRutas) mostrarLista(listaRutas, "rutas", tarjetaRuta);
