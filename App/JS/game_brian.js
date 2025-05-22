function stepBrian() {
    let newGameState = JSON.parse(JSON.stringify(gameState));
    for (let x = 1; x < size - 1; x++) {
        for (let y = 1; y < size - 1; y++) {
            let neighbors = countNeighbors(x, y);
            newGameState[x][y] = gameState[x][y] === 0 && neighbors === 2 ? 1 : gameState[x][y] === 1 ? 2 : gameState[x][y] === 2 ? 0 : 0;
        }
    }
    gameState = newGameState;
}
