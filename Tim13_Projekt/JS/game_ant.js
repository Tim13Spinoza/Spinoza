function stepAnt() {
    const { x, y, dir } = ant;
    const cell = gameState[x][y];
    gameState[x][y] = 1 - cell;
    ant.dir = (dir + (cell === 0 ? 1 : 3)) % 4;
    if (ant.dir === 0) ant.y = (ant.y - 1 + size) % size;
    else if (ant.dir === 1) ant.x = (ant.x + 1) % size;
    else if (ant.dir === 2) ant.y = (ant.y + 1) % size;
    else if (ant.dir === 3) ant.x = (ant.x - 1 + size) % size;
    antSteps++;
}
