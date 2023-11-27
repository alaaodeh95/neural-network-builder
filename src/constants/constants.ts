import { ISelectOption } from "../types/interfaces";
import { ActivationFunction, LossFunction } from "../types/neuralNetworkTypes";

export const hiddenLayersAF: ISelectOption[] = [
    { key: ActivationFunction.ReLU, text: ActivationFunction.ReLU },
    { key: ActivationFunction.LeakyReLU, text: ActivationFunction.LeakyReLU },
    { key: ActivationFunction.Tanh, text: ActivationFunction.Tanh },
    { key: ActivationFunction.Sigmoid, text: ActivationFunction.Sigmoid },
];

export const outputLayerAF: ISelectOption[] = [
    { key: ActivationFunction.Softmax, text: ActivationFunction.Softmax },
    { key: ActivationFunction.Tanh, text: ActivationFunction.Tanh },
    { key: ActivationFunction.Sigmoid, text: ActivationFunction.Sigmoid },
];

export const lossFunctionSelectOptions: ISelectOption[] = [
    { key: LossFunction.CrossEntropy, text: 'Cross Entropy' },
    { key: LossFunction.MSE, text: LossFunction.MSE },
    { key: LossFunction.SSE, text: LossFunction.SSE },
];


export const samplesData = [
    "/samples/Sample 1.csv",
    "/samples/Sample 2.csv",
    "/samples/Sample 3.csv",
];