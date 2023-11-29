import { ISelectOption } from "../types/interfaces";
import { ActivationFunction, LossFunction } from "../types/neuralNetworkTypes";

export const hiddenLayersAF: ISelectOption[] = [
    { key: ActivationFunction.Tanh, text: ActivationFunction.Tanh },
    { key: ActivationFunction.ReLU, text: ActivationFunction.ReLU },
    { key: ActivationFunction.LeakyReLU, text: ActivationFunction.LeakyReLU },
    { key: ActivationFunction.Sigmoid, text: ActivationFunction.Sigmoid },
    { key: ActivationFunction.Linear, text: ActivationFunction.Linear },
];

export const outputLayerAF: ISelectOption[] = [
    { key: ActivationFunction.Softmax, text: ActivationFunction.Softmax },
    { key: ActivationFunction.Tanh, text: ActivationFunction.Tanh },
    { key: ActivationFunction.Sigmoid, text: ActivationFunction.Sigmoid },
    { key: ActivationFunction.Linear, text: ActivationFunction.Linear },
];

export const lossFunctionSelectOptions: ISelectOption[] = [
    { key: LossFunction.CrossEntropy, text: 'Cross Entropy' },
    { key: LossFunction.MSE, text: LossFunction.MSE },
    { key: LossFunction.SSE, text: LossFunction.SSE },
];


export const samplesData = [
    "/samples/Linear.csv",
    "/samples/Circles.csv",
    "/samples/Quadrant.csv",
    "/samples/Sample 1.csv",
];