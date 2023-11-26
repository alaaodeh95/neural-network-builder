import { CommandType, Weight, WorkerCommand, WorkerResponse } from "../types/neuralNetworkTypes";

/* eslint-disable no-restricted-globals */
self.onmessage = (e: MessageEvent<WorkerCommand>) => {
    const command = e.data;
    const architecture = command.model.architecture;
    const layers = [architecture.inputLayer, ...architecture.hiddenLayers, architecture.outputLayer];

    if (command.type === CommandType.Predict) {
        console.log("Predicting ...");
    } else if (command.type === CommandType.Train) {
        console.log("Training ...");
    }

    let weights: Weight[] = [];
    layers.forEach(layer => layer.neurons.forEach(neuron => neuron.connections.forEach(connection => weights.push({ [connection.id]: Math.random() }))));

    self.postMessage({
        type: command.type,
        weights
    } as WorkerResponse);

};

export { };