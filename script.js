let board = Array(3).fill().map(() => Array(3).fill(' '));
const human = 'O';
const bot = 'X';
let currentPlayer = human;

document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const status = document.getElementById('status');
    const restartButton = document.getElementById('restart-button');

    function renderBoard() {
        gameBoard.innerHTML = '';
        board.forEach((row, r) => {
            row.forEach((cell, c) => {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'cell';
                cellDiv.textContent = cell;
                cellDiv.dataset.row = r;
                cellDiv.dataset.col = c;
                cellDiv.addEventListener('click', handleCellClick);
                gameBoard.appendChild(cellDiv);
            });
        });
    }

    function handleCellClick(e) {
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;

        if (board[row][col] === ' ' && currentPlayer === human) {
            makeMove(row, col, human);
            if (checkWinner(human)) {
                status.textContent = `${human} wins!`;
                endGame();
                return;
            }
            if (isBoardFull()) {
                status.textContent = "It's a tie!";
                endGame();
                return;
            }
            currentPlayer = bot;
            setTimeout(botMove, 500); // Delay bot move for better visual effect
        }
    }

    function makeMove(row, col, player) {
        board[row][col] = player;
        renderBoard();
        const cellDiv = gameBoard.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        cellDiv.classList.add('animated');
    }

    function botMove() {
        const bestMove = findBestMove();
        makeMove(bestMove.row, bestMove.col, bot);
        if (checkWinner(bot)) {
            status.textContent = `${bot} wins!`;
            endGame();
            return;
        }
        if (isBoardFull()) {
            status.textContent = "It's a tie!";
            endGame();
            return;
        }
        currentPlayer = human;
    }

    function checkWinner(player) {
        const winConditions = [
            [board[0][0], board[0][1], board[0][2]],
            [board[1][0], board[1][1], board[1][2]],
            [board[2][0], board[2][1], board[2][2]],
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],
            [board[0][0], board[1][1], board[2][2]],
            [board[2][0], board[1][1], board[0][2]]
        ];
        return winConditions.some(condition => condition.every(cell => cell === player));
    }

    function isBoardFull() {
        return board.every(row => row.every(cell => cell !== ' '));
    }

    function minimax(depth, isMaximizing) {
        if (checkWinner(bot)) return 10 - depth;
        if (checkWinner(human)) return depth - 10;
        if (isBoardFull()) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (const [r, c] of getAvailableMoves()) {
                board[r][c] = bot;
                const score = minimax(depth + 1, false);
                board[r][c] = ' ';
                bestScore = Math.max(score, bestScore);
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (const [r, c] of getAvailableMoves()) {
                board[r][c] = human;
                const score = minimax(depth + 1, true);
                board[r][c] = ' ';
                bestScore = Math.min(score, bestScore);
            }
            return bestScore;
        }
    }

    function findBestMove() {
        let bestScore = -Infinity;
        let bestMove = null;
        for (const [r, c] of getAvailableMoves()) {
            board[r][c] = bot;
            const score = minimax(0, false);
            board[r][c] = ' ';
            if (score > bestScore) {
                bestScore = score;
                bestMove = { row: r, col: c };
            }
        }
        return bestMove;
    }

    function getAvailableMoves() {
        return board.flatMap((row, r) => row.map((cell, c) => (cell === ' ' ? [r, c] : null)).filter(cell => cell));
    }

    window.restartGame = function() {
        board = Array(3).fill().map(() => Array(3).fill(' '));
        currentPlayer = human;
        status.textContent = '';
        renderBoard();
    }

    function endGame() {
        gameBoard.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleCellClick));
    }

    renderBoard();
});
