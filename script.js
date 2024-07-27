document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.querySelector('.reset-button');
    const winsDisplay = document.getElementById('wins');
    const lossesDisplay = document.getElementById('losses');
    let currentPlayer = 'X';
    let gameState = Array(9).fill(null);
    let wins = localStorage.getItem('wins') ? parseInt(localStorage.getItem('wins')) : 0;
    let losses = localStorage.getItem('losses') ? parseInt(localStorage.getItem('losses')) : 0;

    const updateScore = () => {
        winsDisplay.textContent = `Wins: ${wins}`;
        lossesDisplay.textContent = `Losses: ${losses}`;
    };

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const checkWin = (player) => {
        return winningCombinations.some(combination => {
            return combination.every(index => gameState[index] === player);
        });
    };

    const checkDraw = () => {
        return gameState.every(cell => cell !== null);
    };

    const aiMove = () => {
        let availableCells = [];
        gameState.forEach((cell, index) => {
            if (cell === null) {
                availableCells.push(index);
            }
        });

        // Improved AI logic: Block player's winning move
        const playerWinMoves = availableCells.filter(index => {
            gameState[index] = 'X';
            const isWinningMove = checkWin('X');
            gameState[index] = null;
            return isWinningMove;
        });

        let moveIndex;
        if (playerWinMoves.length > 0) {
            moveIndex = playerWinMoves[0];
        } else {
            // Otherwise, choose a random move
            moveIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        }

        gameState[moveIndex] = 'O';
        cells[moveIndex].textContent = 'O';

        if (checkWin('O')) {
            setTimeout(() => {
                alert('AI wins!');
                losses++;
                localStorage.setItem('losses', losses);
                updateScore();
            }, 100);
            return true;
        }

        if (checkDraw()) {
            setTimeout(() => alert('It\'s a draw!'), 100);
            return true;
        }

        return false;
    };

    const handleClick = (e) => {
        const index = e.target.dataset.index;
        if (gameState[index] || checkWin('X') || checkWin('O')) return;

        gameState[index] = currentPlayer;
        e.target.textContent = currentPlayer;

        if (checkWin('X')) {
            setTimeout(() => {
                alert('Player wins!');
                wins++;
                localStorage.setItem('wins', wins);
                updateScore();
            }, 100);
            return;
        }

        if (checkDraw()) {
            setTimeout(() => alert('It\'s a draw!'), 100);
            return;
        }

        if (!aiMove()) {
            currentPlayer = 'X';
        }
    };

    const resetGame = () => {
        gameState = Array(9).fill(null);
        currentPlayer = 'X';
        cells.forEach(cell => {
            cell.textContent = '';
        });
    };

    cells.forEach(cell => {
        cell.addEventListener('click', handleClick);
    });

    resetButton.addEventListener('click', resetGame);

    updateScore();
});
