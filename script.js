const roles = [
  { name: 'Impostor', icon: '🔪', color: '#ff1744' },
  { name: 'Inocente', icon: '🙂', color: '#00e676' },
  { name: 'Xerife', icon: '⭐', color: '#ffd600' },
  { name: 'Herói', icon: '🛡️', color: '#00e5ff' },
  { name: 'Palhaço', icon: '🤡', color: '#ff4081' },
  { name: 'Rastreador', icon: '🧭', color: '#ff9100' },
  { name: 'Falso Xerife', icon: '🎖️', color: '#ff5252' },
  { name: 'Médico', icon: '💉', color: '#40c4ff' },
  { name: 'Reportador', icon: '📢', color: '#b388ff' },
];

let gameMode = 'normal';

let totalPlayers = 0;
let currentPlayer = 1;

let playerRoles = [];

let currentRole = null;
let revealed = false;
let locked = false;

const card = document.getElementById('card');
const roleIcon = document.getElementById('roleIcon');
const roleName = document.getElementById('roleName');
const count = document.getElementById('count');

const flipSound = document.getElementById('flip');
const endSound = document.getElementById('endSound');
const music = document.getElementById('music');

const playerText = document.getElementById('playerText');

const startBtn = document.getElementById('startBtn');
const playerInput = document.getElementById('playerCount');
const warning = document.getElementById('playerWarning');

/* TROCAR TELAS */

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.add('hidden');
  });

  document.getElementById(id).classList.remove('hidden');
}

/* INTRO */

setTimeout(() => {
  showScreen('intro');
}, 500);

/* ABRIR MODOS */

function openModes() {
  showScreen('modeScreen');
}

/* ESCOLHER MODO */

function setMode(mode) {
  gameMode = mode;

  validatePlayers();

  showScreen('menu');
}

/* VALIDAR JOGADORES */

function validatePlayers() {
  let players = parseInt(playerInput.value);

  if (isNaN(players)) players = 2;

  warning.innerText = '';

  /* LIMITE MÁXIMO */

  if (players > 12) {
    players = 12;
    playerInput.value = 12;
  }

  /* MODO NORMAL */

  if (gameMode === 'normal') {
    if (players < 2) {
      players = 2;
      playerInput.value = 2;
    }

    if (players === 2) {
      warning.innerText =
        'Este jogo não foi feito para 2 jogadores. Algumas funções foram desativadas.';
    }
  }

  /* MODO XERIFE */

  if (gameMode === 'xerife') {
    if (players < 3) {
      players = 3;
      playerInput.value = 3;
    }
  }
}

playerInput.addEventListener('input', validatePlayers);

/* EMBARALHAR */

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
}

/* GERAR PAPÉIS */

function generateRoles(players) {
  let list = [];

  if (gameMode === 'normal') {
    let availableRoles = [...roles];

    if (players === 2) {
      availableRoles = roles.filter(
        r =>
          r.name !== 'Herói' &&
          r.name !== 'Rastreador' &&
          r.name !== 'Médico' &&
          r.name !== 'Reportador'
      );
    }

    for (let i = 0; i < players; i++) {
      let random = Math.floor(Math.random() * availableRoles.length);

      list.push(availableRoles[random]);
    }
  }

  /* MODO XERIFE */

  if (gameMode === 'xerife') {
    list.push(roles.find(r => r.name === 'Falso Xerife'));

    for (let i = 1; i < players; i++) {
      list.push(roles.find(r => r.name === 'Xerife'));
    }
  }

  shuffle(list);

  return list;
}

/* COMEÇAR JOGO */

startBtn.onclick = () => {
  music.play().catch(() => {});

  validatePlayers();

  totalPlayers = parseInt(playerInput.value);

  currentPlayer = 1;

  playerRoles = generateRoles(totalPlayers);

  playerText.innerText = `Player ${currentPlayer} você é`;

  showScreen('startGameScreen');
};

/* COMEÇAR REVELAÇÃO */

function beginGame() {
  showScreen('gameScreen');
}

/* PRÓXIMO PLAYER */

function nextPlayer() {
  currentPlayer++;

  if (currentPlayer > totalPlayers) {
    showScreen('finalScreen');

    return;
  }

  playerText.innerText = `Player ${currentPlayer} você é`;
}

/* REVELAR CARTA */

function handleTouch() {
  if (locked) return;

  if (!revealed) {
    currentRole = playerRoles[currentPlayer - 1];

    flipSound.play();

    card.classList.add('flip');

    roleIcon.innerText = currentRole.icon;

    roleName.innerText = currentRole.name;

    roleName.style.color = currentRole.color;

    card.style.borderColor = currentRole.color;

    revealed = true;

    locked = true;

    let time = 3;

    count.innerText = time;

    const timer = setInterval(() => {
      time--;

      count.innerText = time;

      if (time <= 0) {
        clearInterval(timer);

        endSound.play();

        setTimeout(() => {
          card.classList.remove('flip');

          revealed = false;

          locked = false;

          roleIcon.innerText = '';
          roleName.innerText = '';

          card.style.borderColor = '#ffffff22';

          nextPlayer();
        }, 1000);
      }
    }, 1000);
  }
}

/* EVENTOS */

card.addEventListener('click', handleTouch);
card.addEventListener('touchstart', handleTouch);

/* REINICIAR */

function restartGame() {
  location.reload();
}

/* SERVICE WORKER */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}
