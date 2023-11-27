import { LossFunction } from "../types/neuralNetworkTypes";

export const crossEntropyLoss = (predicted: number[], actual: number[]): number => {
    if (predicted.length !== actual.length) {
        throw new Error('The number of predicted vectors and actual vectors must be the same');
    }

    let loss = 0;
    for (let i = 0; i < predicted.length; i++) {
        // Ensure that predicted probabilities are not zero to avoid log(0)
        loss += actual[i] * Math.log(predicted[i] + Number.EPSILON);
    }

    return -loss;
}

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

export const calculateErrorForVector = (predicted: number[], actual: number[], lossFunction: LossFunction): number => {
    switch (lossFunction) {
        case LossFunction.CrossEntropy:
            return crossEntropyLoss(predicted, actual);
        case LossFunction.MSE:
            return squaredMeanError(predicted, actual);
        case LossFunction.SSE:
            return sumOfSquaredErrors(predicted, actual);
    }
}