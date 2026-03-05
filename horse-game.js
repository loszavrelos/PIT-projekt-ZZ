// Game state
let horseStats = {
    energy: 100,
    water: 100,
    clean: 100
};

let gameInterval;
const DECREMENT_RATE = 2; // How much stats drop every tick
const TICK_MS = 1000; // 1 second

// DOM Elements
const barEnergy = document.getElementById('bar-energy');
const barWater = document.getElementById('bar-water');
const barClean = document.getElementById('bar-clean');
const horseImg = document.getElementById('horse-img');

const btnFeed = document.getElementById('btn-feed');
const btnWater = document.getElementById('btn-water');
const btnGroom = document.getElementById('btn-groom');

const messageOverlay = document.getElementById('message-overlay');
const btnRestart = document.getElementById('btn-restart');
const endTitle = document.getElementById('end-title');
const endDesc = document.getElementById('end-desc');

// Initialize game
function initGame() {
    horseStats = { energy: 100, water: 100, clean: 100 };
    updateUI();
    messageOverlay.classList.add('hidden');
    horseImg.classList.add('happy');

    // Clear old interval if exists
    if (gameInterval) clearInterval(gameInterval);

    // Start game loop
    gameInterval = setInterval(gameLoop, TICK_MS);
}

// Main game loop (runs every second)
function gameLoop() {
    // Decrease stats
    horseStats.energy = Math.max(0, horseStats.energy - DECREMENT_RATE * 1.5); // Gets hungry faster
    horseStats.water = Math.max(0, horseStats.water - DECREMENT_RATE * 1.2);
    horseStats.clean = Math.max(0, horseStats.clean - DECREMENT_RATE * 0.8);

    updateUI();
    checkGameOver();
}

// Update progress bars
function updateUI() {
    updateBar(barEnergy, horseStats.energy);
    updateBar(barWater, horseStats.water);
    updateBar(barClean, horseStats.clean);

    // Stop horse bouncing if stats are low
    const avgStats = (horseStats.energy + horseStats.water + horseStats.clean) / 3;
    if (avgStats < 40) {
        horseImg.classList.remove('happy');
    } else {
        horseImg.classList.add('happy');
    }
}

function updateBar(element, value) {
    element.style.width = value + '%';

    if (value <= 20) {
        element.classList.add('low');
    } else {
        element.classList.remove('low');
    }
}

// Check if any stat reached 0
function checkGameOver() {
    if (horseStats.energy <= 0 || horseStats.water <= 0 || horseStats.clean <= 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(gameInterval);
    horseImg.classList.remove('happy');

    let reason = "Tvému koni něco chybělo.";
    if (horseStats.energy <= 0) reason = "Tvůj kůň omdlel z nedostatku jídla!";
    else if (horseStats.water <= 0) reason = "Tvůj kůň byl tak žíznivý, že utekl k řece!";
    else if (horseStats.clean <= 0) reason = "Kůň byl tak špinavý, že ho odvezli do myčky a nevrátili!";

    endTitle.innerText = "Konec hry!";
    endDesc.innerText = reason;
    messageOverlay.classList.remove('hidden');
}

// Actions
function feed() {
    horseStats.energy = Math.min(100, horseStats.energy + 20);
    updateUI();
}

function water() {
    horseStats.water = Math.min(100, horseStats.water + 20);
    updateUI();
}

function groom() {
    horseStats.clean = Math.min(100, horseStats.clean + 25);
    updateUI();
}

// Event Listeners
btnFeed.addEventListener('click', feed);
btnWater.addEventListener('click', water);
btnGroom.addEventListener('click', groom);
btnRestart.addEventListener('click', initGame);

// Start game on load
initGame();
