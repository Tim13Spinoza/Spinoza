function stepLife() {
    let newGameState = JSON.parse(JSON.stringify(gameState));
    for (let x = 1; x < size - 1; x++) {
        for (let y = 1; y < size - 1; y++) {
            let neighbors = countNeighbors(x, y);
            newGameState[x][y] = (gameState[x][y] && (neighbors === 2 || neighbors === 3)) || (!gameState[x][y] && neighbors === 3) ? 1 : 0;
        }
    }
    gameState = newGameState;
}
