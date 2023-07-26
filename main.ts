import * as tickTacToe from './ticktactoe';

const simulateGame = () => {
    const grid = tickTacToe.setupNewGame();
    let gameState = tickTacToe.getGameState(grid);

    const history:any = [];

    while (gameState === tickTacToe.GameState.InProgress) {
        tickTacToe.makeRandomMove(grid);

        history.push(tickTacToe.cloneGrid(grid));

        gameState = tickTacToe.getGameState(grid);
    }

    return [gameState, history];
}

export {
    simulateGame,
}
