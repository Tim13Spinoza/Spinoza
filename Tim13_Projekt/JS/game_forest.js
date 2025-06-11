function stepForest() {
    let newGameState = JSON.parse(JSON.stringify(gameState));
    for (let x = 1; x < size - 1; x++) {
        for (let y = 1; y < size - 1; y++) {
            if (gameState[x][y] === 2) {
                newGameState[x][y] = 0;
            } else if (gameState[x][y] === 1) {
                const burningNeighbors = countSpecificNeighbors(x, y, 2);
                newGameState[x][y] = burningNeighbors > 0 || Math.random() < 0.0005 ? 2 : 1;
            } else if (gameState[x][y] === 0) {
                newGameState[x][y] = Math.random() < 0.01 ? 1 : 0;
            }
        }
    }
    gameState = newGameState;
}
