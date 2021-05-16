//
const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const imageCoin = document.querySelector("#image-coin");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

// Promises
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();

  formulario.addEventListener("submit", submitFormulario);
  criptomonedasSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
});

// Consulta la API para obtener un listado de Criptomonedas
function consultarCriptomonedas() {
  // Ir  AtoPLISTS Y Despues market capp
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(url)
    .then((respuesta) => respuesta.json()) // Consulta exitosa...
    .then((resultado) => obtenerCriptomonedas(resultado.Data)) //
    .then((criptomonedas) => selectCriptomonedas(criptomonedas))
    .catch((error) => console.log(error));
}
// llena el select
function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;
    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    // insertar el HTML
    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
  e.preventDefault();

  // Extraer los valores
  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("BOTH FIELDS ARE REQUIRED");
    return;
  }

  consultarAPI();
}

function mostrarAlerta(mensaje) {
  // Crea el div
  const divMensaje = document.createElement("div");
  divMensaje.classList.add("error");

  // Mensaje de error
  divMensaje.textContent = mensaje;

  // Insertar en el DOM
  formulario.appendChild(divMensaje);

  // Quitar el alert despues de 3 segundos
  setTimeout(() => {
    divMensaje.remove();
  }, 3000);
}

function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();
  setTimeout(() => {
    fetch(url)
      .then((respuesta) => respuesta.json())
      .then((cotizacion) => {
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
      });
  }, 700);
}

function mostrarCotizacionHTML(cotizacion) {
  limpiarHTML();

  console.log(cotizacion);
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE, IMAGEURL } =
    cotizacion;

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `The price is: <span> ${PRICE} </span>`;

  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `<p>Highest price of the day: <span>${HIGHDAY}</span> </p>`;

  const precioBajo = document.createElement("p");
  precioBajo.innerHTML = `<p>Lowest price of the day: <span>${LOWDAY}</span> </p>`;

  const ultimasHoras = document.createElement("p");
  ultimasHoras.innerHTML = `<p>Variation in the last 24 hours: <span>${CHANGEPCT24HOUR}%</span></p>`;

  const ultimaActualizacion = document.createElement("p");
  ultimaActualizacion.innerHTML = `<p>Last update: <span>${LASTUPDATE}</span></p>`;
  imageCoin.classList.add("img_coin", "col-12", "col-md-6");
  imageCoin.innerHTML = `<img src="https://www.cryptocompare.com/${IMAGEURL}" alt="cripto">`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(ultimaActualizacion);
}

function mostrarSpinner() {
  limpiarHTML();
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>    
    `;
  resultado.appendChild(spinner);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}
