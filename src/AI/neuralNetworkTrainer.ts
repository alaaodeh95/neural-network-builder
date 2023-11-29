/* eslint-disable no-restricted-globals */
import { TrainingSettingsState, Layer, Record, Weight, NeuronState, LayerType, ActivationFunction, Threshold, LossFunction, CommandType, TrainingWorkerResponse } from "../types/neuralNetworkTypes";
import { activateNeurons, calculateAFDerivative } from "./activationFunctions";
import { calculateErrorForVector } from "./evaluation";

export const trainNeuralNetwork = (weights: Weight, thresholds: Threshold, layers: Layer[], parameters: TrainingSettingsState, trainingData: Record[], validationData: Record[], testingData: Record[], labelId: string) => {
    let epoch = 1;
    let lastEpochTrainingAccuracy, lastEpochValidationAccuracy, lastEpochTrainingLoss, lastEpochValidationLoss;
    for (; epoch <= parameters.maxEpochs; epoch++) {
        // For each record perform a forward and backward propogation to complete an iternation within the current epoch
        const { accuracy: trainingAccuracy, lossValue: trainingLoss } = runNeuralNetworkForRecords(trainingData, labelId, weights, thresholds, layers, parameters, true);
        const { accuracy: validationAccuracy, lossValue: validationLoss } = runNeuralNetworkForRecords(validationData, labelId, weights, thresholds, layers, parameters, false);
        
        lastEpochTrainingAccuracy = trainingAccuracy; lastEpochTrainingLoss = trainingLoss; lastEpochValidationAccuracy = validationAccuracy; lastEpochValidationLoss = validationLoss;

        if (validationLoss <= parameters.stopLossValue) {
            break;
        }

        // Send regular update
        epoch !== parameters.maxEpochs && self.postMessage({
            type: CommandType.Train,
            weights,
            thresholds,
            trainingLoss,
            validationLoss,
            trainingAccuracy,
            validationAccuracy,
            numOfEpochs: epoch,
            isFinishedTraining: false,
        } as TrainingWorkerResponse);
    }

    // After all epochs run the unseen test data
    const { accuracy: testingAccuracy, lossValue: testingLoss } = runNeuralNetworkForRecords(testingData, labelId, weights, thresholds, layers, parameters, false);
    self.postMessage({
        type: CommandType.Train,
        weights,
        thresholds,
        testingAccuracy,
        testingLoss,
        trainingAccuracy: lastEpochTrainingAccuracy,
        trainingLoss: lastEpochTrainingLoss,
        validationAccuracy: lastEpochValidationAccuracy,
        validationLoss: lastEpochValidationLoss,
        numOfEpochs: epoch - 1,
        isFinishedTraining: true,
    } as TrainingWorkerResponse);
};


export const runNeuralNetworkForRecords = (records: Record[], labelId: string, weights: Weight, thresholds: Threshold, layers: Layer[], parameters: TrainingSettingsState, isTraining: boolean) => {
    let sumOfTrainingErrors = 0;
    let numberOfTrainingSamples = 0;
    let numberOfCorrectPredictedLabels = 0;
    for (const record of records) {
        // Feed forward iteration
        const thresholdsCorrection: Threshold = {};
        const neuronsState: NeuronState = feedForwardIteration(weights, layers, parameters, record, labelId, isTraining, thresholds, thresholdsCorrection);

        // Only run backward propagation in training mode
        if (isTraining) {
            // Backward propgation to correct the weights
            const weightsCorrections: Weight = backwardPropogation(neuronsState, layers, parameters, weights, thresholdsCorrection);

            // Update weight and thresholds 
            Object.keys(weights).forEach(key => {
                weights[key] -= weightsCorrections[key];
            });

            Object.keys(thresholds).forEach(key => {
                thresholds[key] -= thresholdsCorrection[key];
            });
        }

        const outputNeurons = layers[layers.length - 1].neurons;
        let predictVector = outputNeurons.map(neuron => neuronsState[neuron.id].predicted!);
        let actualVector = outputNeurons.map(neuron => neuronsState[neuron.id].value!);
        numberOfTrainingSamples++;
        sumOfTrainingErrors += calculateErrorForVector(predictVector, actualVector, parameters.lossFunction, layers[layers.length - 1].activationFunction);

        // Calculate whether it's correct predection or not. // For simplicity, I will take the neuron with highest predection and check whether it's true lable is one or not
        let indexOfTheRightLabel = outputNeurons.findIndex(neuron => neuronsState[neuron.id].value === 1);
        let indexOfRightPrediction = outputNeurons.reduce((maxIndex, neuron, currentIndex, array) => {
            return neuronsState[neuron.id].predicted! > neuronsState[array[maxIndex].id].predicted! ? currentIndex : maxIndex;
        }, 0);
        numberOfCorrectPredictedLabels += (indexOfTheRightLabel === indexOfRightPrediction) ? 1 : 0;
    }

    return { accuracy: numberOfCorrectPredictedLabels / numberOfTrainingSamples, lossValue: parameters.lossFunction === LossFunction.SSE ? sumOfTrainingErrors : sumOfTrainingErrors / numberOfTrainingSamples }
}

const feedForwardIteration = (weights: Weight, layers: Layer[], parameters: TrainingSettingsState, record: Record, labelId: string, isTraining: boolean, thresholds: Threshold, thresholdsCorrection?: Threshold) => {
    // Publish initial values for input and output layers
    const neuronsState: NeuronState = layers[0].neurons.reduce((acc, neuron, neuronIdx) => {
        const neuronId = neuron.id; // Ensure that neuron.id is a string
        acc[neuronId] = { value: record[neuron.name!] as number };
        return acc;
    }, {} as NeuronState);

    Object.assign(neuronsState, layers[layers.length - 1].neurons.reduce((acc, neuron) => {
        acc[neuron.id] = {
            value: record[labelId] === neuron.name ? 1 : 0,
        };
        return acc;
    }, {} as NeuronState));

    layers.forEach((currentLayer, idx) => {
        if (currentLayer.type === LayerType.Input) return; // No calculations on input layer
        const previousLayerNeurons = layers[idx - 1].neurons;
        currentLayer.neurons.forEach(currentNeuron => {
            if (!neuronsState[currentNeuron.id]) {
                neuronsState[currentNeuron.id] = { value: 0 }; // First initialization for hidden layers state
            }
            const currentNeuronBias = thresholds[currentNeuron.id];
            const neuronLogit = previousLayerNeurons.reduce((acc, connectedNeuron) => acc + (neuronsState[connectedNeuron.id].value * weights[`${connectedNeuron.id}=>${currentNeuron.id}`]), 0) + currentNeuronBias;
            if (currentLayer.type === LayerType.Output) { // For output layer set predicted not value
                neuronsState[currentNeuron.id].predicted = neuronLogit; // Activate after the loop since it requires special handling
                if (currentLayer.activationFunction !== ActivationFunction.Softmax) {
                    const predicted = activateNeurons([neuronLogit], currentLayer.activationFunction)[0];
                    neuronsState[currentNeuron.id].predicted = predicted;
                    const error = neuronsState[currentNeuron.id].value - predicted;
                    const gradientError = error * calculateAFDerivative(neuronLogit, currentLayer.activationFunction);
                    neuronsState[currentNeuron.id].error = error;
                    if (isTraining) {
                        neuronsState[currentNeuron.id].gradientError = gradientError;
                        thresholdsCorrection![currentNeuron.id] = parameters.learningRate * gradientError;
                    }
                }
            } else {
                neuronsState[currentNeuron.id].logit = neuronLogit;
                neuronsState[currentNeuron.id].value = activateNeurons([neuronLogit], currentLayer.activationFunction)[0];
            }
        });

        // Acitvate softmax neurons if softmax is used, if not skip
        if (currentLayer.type === LayerType.Output && currentLayer.activationFunction === ActivationFunction.Softmax) {
            const outputNeurons = currentLayer.neurons;
            const outputNeuronsLogits = outputNeurons.map(neuron => neuronsState[neuron.id].predicted!); // map on order
            const activiatedOutputNeurons = activateNeurons(outputNeuronsLogits, ActivationFunction.Softmax)
            outputNeurons.forEach((neuron, idx) => {
                neuronsState[neuron.id].predicted = activiatedOutputNeurons[idx];
                neuronsState[neuron.id].error = neuronsState[neuron.id].value - activiatedOutputNeurons[idx]; // Ydesired (it's value in output layer) - predicted,
                if (isTraining) {
                    const gradientError = activiatedOutputNeurons[idx] - neuronsState[neuron.id].value;
                    neuronsState[neuron.id].gradientError = gradientError;
                    thresholdsCorrection![neuron.id] = parameters.learningRate * gradientError;
                }
            });
        }
    });

    return neuronsState;
}

const backwardPropogation = (neuronsState: NeuronState, layers: Layer[], parameters: TrainingSettingsState, weights: Weight, thresholdsCorrection: Threshold) => {
    const weightsCorrections: Weight = {};
    for (let i = layers.length - 2; i >= 0; --i) { // Skip output since it's gradients was calculated
        const currentLayer = layers[i];
        currentLayer.neurons.forEach(neuron => {
            neuron.connections.forEach(connection => {
                const toNeuronId = connection.id.split('=>')[1];
                weightsCorrections[connection.id] = parameters.learningRate * neuronsState[neuron.id].value * neuronsState[toNeuronId].gradientError!; // It's a must to be calculated
            });

            if (i > 0) { // Calculate gradient error and threshold corretion for all neurons except in layer 1
                const gradientError = calculateAFDerivative(neuronsState[neuron.id].logit!, currentLayer.activationFunction) *
                    neuron.connections.reduce((acc, connection) => {
                        const toNeuronId = connection.id.split('=>')[1];
                        return acc + (weights[connection.id] * neuronsState[toNeuronId].gradientError!);
                    }, 0);
                neuronsState[neuron.id].gradientError = gradientError;
                thresholdsCorrection[neuron.id] = gradientError * parameters.learningRate;
            }
        });
    }

    return weightsCorrections;
};