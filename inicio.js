//*inicio
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = 400; // altura fija

// Mundo más grande que la pantalla
const mundo = {
    width: 30000, // largo del escenario
    height: canvas.height
};

// Cargar imagen de fondo
const fondo = new Image();
fondo.src = "/imagenes/Fondo 1.png"; // tu imagen de fondo

// Jugador
const jugador = {
    x: 150,
    y: canvas.height - 80,
    width: 40,
    height: 40,
    color: "red",
    velX: 0,
    velY: 0,
    enSuelo: false
};

// Cámara
let camara = {
    x: 0,
    y: 0
};

// Gravedad y salto
const gravedad = 0.5;
const salto = -10;
const velocidadMovimiento = 5;

// Controles
let teclas = {};
document.addEventListener("keydown", e => teclas[e.key] = true);
document.addEventListener("keyup", e => teclas[e.key] = false);

function actualizar() {
    // Movimiento horizontal
    if (teclas["ArrowRight"]) jugador.velX = velocidadMovimiento;
    else if (teclas["ArrowLeft"]) jugador.velX = -velocidadMovimiento;
    else jugador.velX = 0;

    // Salto
    if (teclas[" "] && jugador.enSuelo) {
        jugador.velY = salto;
        jugador.enSuelo = false;
    }

    // Aplicar movimiento
    jugador.x += jugador.velX;
    jugador.y += jugador.velY;

    // Gravedad
    jugador.velY += gravedad;

    // Suelo
    if (jugador.y + jugador.height >= canvas.height) {
        jugador.y = canvas.height - jugador.height;
        jugador.velY = 0;
        jugador.enSuelo = true;
    }

    // Limitar a los bordes del mundo
    if (jugador.x < 0) jugador.x = 0;
    if (jugador.x + jugador.width > mundo.width) jugador.x = mundo.width - jugador.width;

    // Mover cámara para seguir al jugador
    camara.x = jugador.x - canvas.width / 2 + jugador.width / 2;

    // Limitar cámara a los bordes del mundo
    if (camara.x < 0) camara.x = 0;
    if (camara.x > mundo.width - canvas.width) camara.x = mundo.width - canvas.width;
}

function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo: cubrir con 3 copias para evitar huecos
    let bgAncho = fondo.width;
    let bgAlto = fondo.height;

    let bgX = -camara.x * 1 % bgAncho; // multiplicador de velocidad

    let bgY = -camara.y % bgAlto; // para vertical

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            ctx.drawImage(
                fondo,
                bgX + i * bgAncho,
                bgY + j * bgAlto
            );
        }
    }

    // Dibujar jugador relativo a la cámara
    ctx.fillStyle = jugador.color;
    ctx.fillRect(
        jugador.x - camara.x,
        jugador.y - camara.y,
        jugador.width,
        jugador.height
    );
}

function actualizar() {
    // Movimiento horizontal
    if (teclas["ArrowRight"]) jugador.velX = velocidadMovimiento;
    else if (teclas["ArrowLeft"]) jugador.velX = -velocidadMovimiento;
    else jugador.velX = 0;

    // Movimiento vertical manual (flechas arriba/abajo)
    if (teclas["ArrowUp"]) jugador.velY = -velocidadMovimiento;
    else if (teclas["ArrowDown"]) jugador.velY = velocidadMovimiento;

    // Salto con espacio
    if (teclas[" "] && jugador.enSuelo) {
        jugador.velY = salto;
        jugador.enSuelo = false;
    }

    // Aplicar movimiento
    jugador.x += jugador.velX;
    jugador.y += jugador.velY;

    // Gravedad si no usamos flecha abajo
    if (!teclas["ArrowUp"] && !teclas["ArrowDown"]) {
        jugador.velY += gravedad;
    }

    // Suelo
    if (jugador.y + jugador.height >= mundo.height) {
        jugador.y = mundo.height - jugador.height;
        jugador.velY = 0;
        jugador.enSuelo = true;
    }

    // Límites del mundo
    if (jugador.x < 0) jugador.x = 0;
    if (jugador.x + jugador.width > mundo.width) jugador.x = mundo.width - jugador.width;
    if (jugador.y < 0) jugador.y = 0;
    if (jugador.y + jugador.height > mundo.height) jugador.y = mundo.height - jugador.height;

    // Mover cámara para seguir al jugador (X y Y)
    camara.x = jugador.x - canvas.width / 2 + jugador.width / 2;
    camara.y = jugador.y - canvas.height / 2 + jugador.height / 2;

    // Limitar cámara a los bordes del mundo
    if (camara.x < 0) camara.x = 0;
    if (camara.x > mundo.width - canvas.width) camara.x = mundo.width - canvas.width;
    if (camara.y < 0) camara.y = 0;
    if (camara.y > mundo.height - canvas.height) camara.y = mundo.height - canvas.height;
}


function bucle() {
    actualizar();
    dibujar();
    requestAnimationFrame(bucle);
}

fondo.onload = () => {
    bucle();
};
