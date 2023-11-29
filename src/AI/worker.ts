import { CommandType, TestingWorkerResponse, Threshold, Weight, WorkerCommand } from "../types/neuralNetworkTypes";
import { runNeuralNetworkForRecords, trainNeuralNetwork } from "./neuralNetworkTrainer";
import { initializeWeights, splitData } from "./utils";

/* eslint-disable no-restricted-globals */
self.onmessage = (e: MessageEvent<WorkerCommand>) => {
    const command = e.data;
    const architecture = command.model.architecture;
    const parameters = command.model.parameters;
    const layers = [architecture.inputLayer, ...architecture.hiddenLayers, architecture.outputLayer];
    const labelId = command.data.headers.slice(-1)[0];

    if (command.type === CommandType.Train) {
        console.log("Training ...");
        const [trainingData, testingData, validationData] = splitData(command.data.records, parameters.trainingPercentage, parameters.testingPercentage);
        let weights: Weight = initializeWeights(layers);
        let thresholds: Threshold = {};
        layers.slice(1).flatMap(layer => layer.neurons.map(neuron => neuron)).forEach(neuron => { thresholds[neuron.id] = 0 });
        trainNeuralNetwork(weights, thresholds, layers, parameters, trainingData, validationData, testingData, labelId);
    }
    
    if (command.type === CommandType.Predict) {
        console.log("Predicting ...");
        const { accuracy: testingAccuracy, lossValue: testingLoss } = runNeuralNetworkForRecords(command.data.records, labelId, command.model.weights, command.model.thresholds, layers, parameters, false);
        self.postMessage({
            type: CommandType.Predict,
            testingAccuracy,
            testingLoss,
        } as TestingWorkerResponse);
    }
};

export { };