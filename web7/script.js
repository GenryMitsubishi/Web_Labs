const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restart');

let board;
let gameOver;

function initGame() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    gameOver = false;
    renderBoard();
    setMessage('Ваш ход (крестики)');
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.textContent = board[row][col];
            cell.addEventListener('click', onCellClick);
            boardElement.appendChild(cell);
        }
    }
}

function onCellClick(e) {
    if (gameOver) return;
    const row = +e.target.dataset.row;
    const col = +e.target.dataset.col;
    if (board[row][col] !== '') return;
    board[row][col] = 'X';
    renderBoard();
    if (checkWinner('X')) {
        setMessage('Вы победили!');
        gameOver = true;
        return;
    }
    if (isDraw()) {
        setMessage('Ничья!');
        gameOver = true;
        return;
    }
    setTimeout(computerMove, 400);
}

function computerMove() {
    if (gameOver) return;
    const emptyCells = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === '') {
                emptyCells.push({ row, col });
            }
        }
    }
    if (emptyCells.length === 0) return;
    const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[move.row][move.col] = 'O';
    renderBoard();
    if (checkWinner('O')) {
        setMessage('Компьютер победил!');
        gameOver = true;
        return;
    }
    if (isDraw()) {
        setMessage('Ничья!');
        gameOver = true;
        return;
    }
    setMessage('Ваш ход (крестики)');
}

function checkWinner(player) {
    // Проверка строк и столбцов
    for (let i = 0; i < 3; i++) {
        if (
            board[i][0] === player && board[i][1] === player && board[i][2] === player ||
            board[0][i] === player && board[1][i] === player && board[2][i] === player
        ) {
            return true;
        }
    }
    // Проверка диагоналей
    if (
        board[0][0] === player && board[1][1] === player && board[2][2] === player ||
        board[0][2] === player && board[1][1] === player && board[2][0] === player
    ) {
        return true;
    }
    return false;
}

function isDraw() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === '') return false;
        }
    }
    return true;
}

function setMessage(msg) {
    messageElement.textContent = msg;
}

restartButton.addEventListener('click', initGame);

initGame(); 