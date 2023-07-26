enum TickTacToeTile {
    X = 'X',
    O = 'O',
    Empty = 'Empty'
}

enum GameState {
    CrossesWin,
    CirclesWin,
    Draw,
    InProgress
}

const setupNewGame = () => {
    return [
        [TickTacToeTile.Empty, TickTacToeTile.Empty, TickTacToeTile.Empty],
        [TickTacToeTile.Empty, TickTacToeTile.Empty, TickTacToeTile.Empty],
        [TickTacToeTile.Empty, TickTacToeTile.Empty, TickTacToeTile.Empty]
    ]
};

const getWhoseTurn = (grid:any) => {
    let xCount = 0;
    let oCount = 0;
    for (let i = 0; i < 3; i++) {
        xCount += grid[i].filter((tile:any) => tile === TickTacToeTile.X).length;
        oCount += grid[i].filter((tile:any) => tile === TickTacToeTile.O).length;
    }
    if (xCount === oCount) {
        return TickTacToeTile.X;
    } else {
        return TickTacToeTile.O;
    }
};

const getGameState = (grid:any) => {
    // Check for horizontal win
    for (let i = 0; i < 3; i++) {
        if (grid[i][0] === grid[i][1] && grid[i][0] === grid[i][2] && grid[i][0] !== TickTacToeTile.Empty) {
            if (grid[i][0] === TickTacToeTile.X) {
                return GameState.CrossesWin;
            } else {
                return GameState.CirclesWin;
            }
        }
    }

    // Check for vertical win
    for (let i = 0; i < 3; i++) {
        if (grid[0][i] === grid[1][i] && grid[0][i] === grid[2][i] && grid[0][i] !== TickTacToeTile.Empty) {
            if (grid[0][i] === TickTacToeTile.X) {
                return GameState.CrossesWin;
            } else {
                return GameState.CirclesWin;
            }
        }
    }

    // Check for diagonal win
    if (grid[0][0] === grid[1][1] && grid[0][0] === grid[2][2] && grid[0][0] !== TickTacToeTile.Empty) {
        if (grid[0][0] === TickTacToeTile.X) {
            return GameState.CrossesWin;
        }
        else {
            return GameState.CirclesWin;
        }
    }

    if (grid[0][2] === grid[1][1] && grid[0][2] === grid[2][0] && grid[0][2] !== TickTacToeTile.Empty) {
        if (grid[0][2] === TickTacToeTile.X) {
            return GameState.CrossesWin;
        } else {
            return GameState.CirclesWin;
        }
    }

    // Check for draw
    let isDraw = true;
    for (let i = 0; i < 3; i++) {
        if (grid[i].includes(TickTacToeTile.Empty)) {
            isDraw = false;
        }
    }
    if (isDraw) {
        return GameState.Draw;
    }

    return GameState.InProgress;
};

const makeRandomMove = (grid:any) => {
    const whoseTurn = getWhoseTurn(grid);

    const emptyTileCoods:any[] = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] === TickTacToeTile.Empty) {
                emptyTileCoods.push([i, j]);
            }
        }
    }

    const randomTile = emptyTileCoods[Math.floor(Math.random() * emptyTileCoods.length)];
    grid[randomTile[0]][randomTile[1]] = whoseTurn;
};

const printGrid = (grid:any) => {
    console.log(`${grid[0].join(' | ')}\n---------\n${grid[1].join(' | ')}\n---------\n${grid[2].join(' | ')}`);
};  

const cloneGrid = (grid:any) => {
    return grid.map((row:any) => row.map((tile:any) => tile));
};

export {
    TickTacToeTile,
    GameState,
    setupNewGame,
    getGameState,
    getWhoseTurn,
    makeRandomMove,
    printGrid,
    cloneGrid,
}