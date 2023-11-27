import { Weight, ActivationFunction, Layer, Record } from "../types/neuralNetworkTypes";

export const initializeWeights = (layers: Layer[]): Weight => {
    let weights: Weight = {};

    layers.forEach((layer, idx) => {
        if (idx === 0) return;

        let variance: number;
        let inputUnits = layers[idx-1].neurons.length;
        let outputUnits = layer.neurons.length;

        // He Initialization for ReLU
        if ([ActivationFunction.ReLU, ActivationFunction.LeakyReLU].includes(layer.activationFunction)) {
            variance = 2 / inputUnits;
        }
        // Xavier/Glorot Initialization for other activation functions
        else {
            variance = 2 / (inputUnits + outputUnits);
        }

        layers[idx - 1].neurons.forEach(neuron => neuron.connections.forEach(connection => { weights[connection.id] = randomNormal(0, Math.sqrt(variance)) }));
    });

    return weights;
}


export const splitData = (data: Record[], trainingPercentage: number, testingPercentage: number): [Record[], Record[], Record[]] => {
    // Shuffling the data array
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
    }

    // Calculate split indices
    const totalSize = data.length;
    const trainingSize = Math.floor(totalSize * trainingPercentage / 100);
    const testingSize = Math.floor(totalSize * testingPercentage / 100);

    // Splitting the data
    const trainingData = data.slice(0, trainingSize);
    const testingData = data.slice(trainingSize, trainingSize + testingSize);
    const validationData = data.slice(trainingSize + testingSize);

    return [trainingData, testingData, validationData];
}


// Helper function to generate random number with normal distribution
const randomNormal = (mean: number, stdDev: number): number => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
