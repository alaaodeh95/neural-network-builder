import { ActivationFunction, LossFunction } from "../types/neuralNetworkTypes";

export const crossEntropyLoss = (predicted: number[], actual: number[], activationFunction: ActivationFunction): number => {
    if (predicted.length !== actual.length) {
        throw new Error('The number of predicted vectors and actual vectors must be the same');
    }

    let loss = 0;

    if (activationFunction === ActivationFunction.Sigmoid || activationFunction === ActivationFunction.Tanh) {
        for (let i = 0; i < predicted.length; i++) {
            // Convert tanh output to [0, 1] range for loss calculation
            const predProb = activationFunction === ActivationFunction.Tanh ? (predicted[i] + 1) / 2 : predicted[i];
            loss += actual[i] * Math.log(predProb + Number.EPSILON) + 
                    (1 - actual[i]) * Math.log(1 - predProb + Number.EPSILON);
        }
    } else if (activationFunction === ActivationFunction.Softmax) {
        for (let i = 0; i < predicted.length; i++) {
            loss += actual[i] * Math.log(predicted[i] + Number.EPSILON);
        }
    }

    return -loss / predicted.length; // Average loss over all instances
};

// Squared Mean Error
export const squaredMeanError = (predicted: number[], actual: number[]): number => {
    if (predicted.length !== actual.length) {
        throw new Error('The number of predicted and actual values must be the same');
    }

    let sum = 0;
    for (let i = 0; i < predicted.length; i++) {
        sum += (actual[i] - predicted[i]) ** 2;
    }

    return sum / predicted.length;
};

// Sum of Squared Errors
export const sumOfSquaredErrors = (predicted: number[], actual: number[]): number => {
    if (predicted.length !== actual.length) {
        throw new Error('The number of predicted and actual values must be the same');
    }

    let sum = 0;
    for (let i = 0; i < predicted.length; i++) {
        sum += (actual[i] - predicted[i]) ** 2;
    }

    return sum;
};

export const calculateErrorForVector = (predicted: number[], actual: number[], lossFunction: LossFunction, activationFunction: ActivationFunction): number => {
    switch (lossFunction) {
        case LossFunction.CrossEntropy:
            return crossEntropyLoss(predicted, actual, activationFunction);
        case LossFunction.MSE:
            return squaredMeanError(predicted, actual);
        case LossFunction.SSE:
            return sumOfSquaredErrors(predicted, actual);
    }
}