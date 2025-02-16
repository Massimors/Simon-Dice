

const menu = document.getElementById('menu');
const juego = document.getElementById('juego');
const iniciarBtn = document.getElementById('iniciar');
const registrarBtn = document.getElementById('registrar');
const reiniciarBtn = document.getElementById("reiniciar");
const nombreInput = document.getElementById('nombre');
const registro = document.getElementById('registro');
const tablero = document.getElementById('tablero');
const puntuacion = document.getElementById('puntuacion');

const sonidos = {
    verde: new Audio("nota-simon.mp3"),
    rojo: new Audio("nota-simon.mp3"),
    amarillo: new Audio("nota-simon.mp3"),
    azul: new Audio("nota-simon.mp3"),
}

let secuencia = [];
let secuenciaUsuario = [];
let nivel = 0;
let jugando = false;
let jugador = null;
let jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];

registrarBtn.addEventListener('click', registrarJugador);
iniciarBtn.addEventListener('click', iniciarJuego);
reiniciarBtn.addEventListener("click", reiniciarJuego);

// Guarda el nombre del jugador 
function registrarJugador() {
    const nombre = nombreInput.value.trim();
    if (nombre === '') {
        alert('Por favor, ingresa un nombre.');
        return;
    }
    jugador = nombre;
    menu.style.display = 'none';
    juego.style.display = 'block';
    registro.style.display = 'block';
    actualizarRegistro();
}
// Comienza el juego 
function iniciarJuego() {
    if (jugando) return;
    jugando = true;
    secuencia = [];
    nivel = 1;
    puntuacion.textContent = "Puntuación: 0";
    reiniciarBtn.classList.remove("hidden");
    mostrarSecuencia();
}
// patron del nivel 
function mostrarSecuencia() {
    tablero.classList.add('desactivado');
    secuencia.push(obtenerColorAleatorio());
    let i = 0;
    const intervalo = setInterval(() => {
        resaltarColor(secuencia[i]);
        i++;
        if (i === secuencia.length) {
            clearInterval(intervalo);
            tablero.classList.remove('desactivado');
            secuenciaUsuario = [];
        }
    }, 1000);
}

function reiniciarJuego() {
    jugando = false;
    secuencia = [];
    secuenciaUsuario = [];
    nivel = 0;
    puntuacion.textContent = "Puntuación: 0";
    juego.classList.add("hidden");
    menu.classList.remove("hidden");
    reiniciarBtn.classList.add("hidden"); 
}
// Generador del nivel 
function obtenerColorAleatorio() {
    const colores = document.querySelectorAll('.color');
    return colores[Math.floor(Math.random() * colores.length)];
}

function resaltarColor(color) {
    color.classList.add('activo');
    
    if(color.classList.contains('verde')) sonidos.verde.play();
    if(color.classList.contains('rojo')) sonidos.rojo.play();
    if(color.classList.contains('amarillo')) sonidos.amarillo.play();
    if(color.classList.contains('azul')) sonidos.azul.play();

    setTimeout(() => {
        color.classList.remove('activo');
    }, 500);
}
// Verificar si el usuario sigue secuencia  
tablero.addEventListener('click', (e) => {
    if (!jugando || !e.target.classList.contains('color')) return;
    
    const colorClicado = e.target;
    secuenciaUsuario.push(colorClicado);
    resaltarColor(colorClicado);
    
    if (!compararSecuencia()) {
        alert('¡Perdiste!');
        jugando = false;
        guardarPuntuacion();
        actualizarRegistro();
        return;
    }
    
    if (secuenciaUsuario.length === secuencia.length) {
        nivel++;
        actualizarPuntuacion();
        setTimeout(mostrarSecuencia, 100);
    }
});

function compararSecuencia() {
    return secuenciaUsuario.every((color, index) => color === secuencia[index]);
}
// Guardar los datos del juego 
function guardarPuntuacion() {
    jugadores.push({ nombre: jugador, puntuacion: nivel - 1 });
    jugadores.sort((a, b) => b.puntuacion - a.puntuacion);
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
}
// pasar los datos al registro del top 
function actualizarRegistro() {
    const tabla = document.querySelector('#registro table tbody');
    tabla.innerHTML = '';
    jugadores.forEach(jugador => {
        const fila = tabla.insertRow();
        const celdaNombre = fila.insertCell();
        const celdaPuntuacion = fila.insertCell();
        celdaNombre.textContent = jugador.nombre;
        celdaPuntuacion.textContent = jugador.puntuacion;
    });
}

function actualizarPuntuacion() {
    puntuacion.textContent = `Puntuación: ${nivel - 1}`;
}

function verificarLogros(nivel) {
    if (nivel === 5) alert("¡Sigue asi!");
    if (nivel === 10) alert("¡Eres un experto!");
    if (nivel === 100) alert("¡WOW terminaste el juego!");
}

