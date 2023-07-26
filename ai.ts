import * as tf from '@tensorflow/tfjs';
import * as fs from 'fs';
import { TickTacToeTile, getGameState, GameState } from './ticktactoe';

tf.setBackend('cpu');

const path = require('path');

// const inputShape = [3,3, Object.keys(TickTacToeTile).length];
const inputShape = [3*3*3];

const model = tf.sequential({
    layers: [
        tf.layers.dense({ inputShape, units: 9, activation: 'relu' }),
        tf.layers.dense({ units: 1 }),
    ]
});

model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError',
});

model.summary();

const tickTacToeBoardToTensor = (board: TickTacToeTile[][]) => {
    const numRows = board.length;
    const numCols = board[0].length;
    const numClasses = Object.keys(TickTacToeTile).length;
  
    // Flatten the 2D board into a 1D array of indices
    const indices = board.flat().flat();
  
    // Convert the indices array to a tensor
    const indicesTensor = tf.tensor1d(indices, 'int32');
  
    // Use tf.oneHot to create the one-hot encoded tensor
    const encodedTensor = tf.oneHot(indicesTensor, numClasses);
  
    // Reshape the encoded tensor to the original 2D shape
    // const encodedBoard = encodedTensor.reshape([numRows, numCols, numClasses]).arraySync();
    const encodedBoard = encodedTensor.flatten();
  
    // Cleanup: Dispose the tensors
    indicesTensor.dispose();
    encodedTensor.dispose();
  
    return encodedBoard;
};

const tickTacToeBoardHistoryToTrainingData = (boardHistory: [TickTacToeTile[][]]) => {
    const rewards:number[] = tickTacToeBoardHistoryToRewards(boardHistory);
    const tensors = boardHistory.map((board) => {
        const tensor = tickTacToeBoardToTensor(board);
        
        return tensor;
    });

    return { tensors, rewards };
};

const tickTacToeBoardHistoryToRewards = (boardHistory: [TickTacToeTile[][]]):number[] => {
    const rewards:number[] = [];
    const lastBoard = boardHistory[boardHistory.length - 1];
    const lastBoardState = getGameState(lastBoard);

    if (lastBoardState === GameState.CrossesWin) {
        for (let i = 0; i < boardHistory.length; i++) {
            rewards.push(0.5 + i*0.1);
        }
    } else if (lastBoardState === GameState.CirclesWin) {
        for (let i = 0; i < boardHistory.length; i++) {
            rewards.push(-0.5 - i*0.1);
        }
    } else {
        for (let i = 0; i < boardHistory.length; i++) {
            rewards.push(0);
        }
    }

    return rewards;
};


const epochs = 100; // Number of training iterations (you can adjust this value based on your dataset size and model complexity)

async function trainModel(inputBatch:any[], targetBatch:any[]) {

    console.log({inputBatch: inputBatch.length, targetBatch: targetBatch.length});
    console.log(targetBatch);
    console.log(inputBatch[0]);
    const batchSize = inputBatch.length;

    const batchTensor = tf.stack(inputBatch);
    // const batchTensor = inputBatch;

    // const batchTensor = tf.tensor4d(inputBatch, [batchSize, 3, 3, 3]);
    // const batchTensor = tf.tensor2d(inputBatch, [batchSize, 3*3*3]);
    console.log(batchTensor.shape);
    const targetTensor = tf.tensor2d(targetBatch, [batchSize, 1]);
    console.log(targetTensor.shape);

    // const reshapedBatchTensor = batchTensor.reshape([batchSize, 3, 3, 3]);

    await model.fit(batchTensor, targetTensor, {
        epochs,
        shuffle: true,
    });

    const savePath = 'models/ticktactoe-model';    
    // const savePath = path.join('file://', __dirname, 'models', 'ticktactoe-model');
    
    // Check if the directory exists, if not, create it
    const dir = path.dirname(savePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // await model.save(`http://localhost:3000/save/tictactoe`);

    fs.writeFileSync(savePath, JSON.stringify(model.toJSON()));
    fs.writeFileSync(`${savePath}.weights.bin`, Buffer.from(await model.getWeights()[0].data()).toString('binary'));
}

const predict = (board: TickTacToeTile[][]) => {
    const tensor = tickTacToeBoardToTensor(board);
    console.log(tensor.shape);
    const prediction = model.predict(tensor.reshape([1, 3 * 3 * 3]));
    
    return prediction;
};

const winPredictor = model

export {
    winPredictor,
    tickTacToeBoardToTensor,
    tickTacToeBoardHistoryToRewards,
    tickTacToeBoardHistoryToTrainingData,
    trainModel,
    predict,
}
