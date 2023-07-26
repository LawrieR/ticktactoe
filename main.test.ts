import { Tensor, Rank } from '@tensorflow/tfjs';
import { winPredictor, tickTacToeBoardHistoryToTrainingData, trainModel, tickTacToeBoardToTensor, predict } from './ai';
import { simulateGame } from './main';


it('should run the game until the end', () => {
    const gameResult = simulateGame();
    expect(gameResult[0]).not.toEqual('InProgress');
});

xit('should generate training data', () => {
    const gameResult = simulateGame();

    const boardAsTensor:any = tickTacToeBoardToTensor(gameResult[1]);
    
    expect(boardAsTensor).toHaveLength(3);
    expect(boardAsTensor[0]).toHaveLength(3);
    expect(boardAsTensor[0][0]).toHaveLength(3);
});

xit('should generate training data', () => {
    const gameResult = simulateGame();

    const trainingData = tickTacToeBoardHistoryToTrainingData(gameResult[1]);
    
    expect(trainingData.tensors).toMatchObject(expect.anything());
    expect(trainingData.rewards).toMatchObject({});
});

it('should generate training data and train', () => {
    const inputBatch:any[] = [];
    const targetBatch:any[] = [];

    for(let i = 0; i < 10; i++) {
        const gameResult = simulateGame();
        const trainingData = tickTacToeBoardHistoryToTrainingData(gameResult[1]);

        inputBatch.push(trainingData.tensors);
        targetBatch.push(trainingData.rewards);
    }

    trainModel(inputBatch.flat(), targetBatch.flat());
});

it('should output game prediction', () => {
    const gameResult = simulateGame();
    
    const output = predict(gameResult[1][0]) as Tensor<Rank>;

    expect(output.dataSync()).toBe(1);
});
