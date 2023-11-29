import { ActivationFunction as ActivationFunctionType } from "../types/neuralNetworkTypes";

interface ActivationFunction {
    output: (x: number[]) => number[];
    derivative: (x: number) => number;
}

const TANH: ActivationFunction = {
    output: x => [Math.tanh(x[0])],
    derivative: x => {
        let [output] = TANH.output([x]);
        return 1 - output * output;
    }
};

const RELU: ActivationFunction = {
    output: x => [Math.max(0, x[0])],
    derivative: x => x <= 0 ? 0 : 1
};

const LEAKY_RELU: ActivationFunction = {
    output: x => [x[0] > 0 ? x[0] : 0.01 * x[0]],
    derivative: x => x > 0 ? 1 : 0.01
};

const SIGMOID: ActivationFunction = {
    output: x => [1 / (1 + Math.exp(-x[0]))],
    derivative: x => {
        let [output] = SIGMOID.output([x]);
        return output * (1 - output);
    }
};

const LINEAR: ActivationFunction = {
    output: x => x,
    derivative: _ => 1,
};

const SOFTMAX: ActivationFunction = {
    output: (x) => {
        let exps = (x as number[]).map(v => Math.exp(v));
        let sum = exps.reduce((a, b) => a + b, 0);
        return exps.map(v => v / sum);
    },
    derivative: (x) => 0 // Not used
};

export const activateNeurons = (neuronLogit: number[], activationFunction: ActivationFunctionType): number[] => {
    switch (activationFunction) {
        case ActivationFunctionType.ReLU:
            return RELU.output(neuronLogit);
        case ActivationFunctionType.LeakyReLU:
            return LEAKY_RELU.output(neuronLogit);
        case ActivationFunctionType.Sigmoid:
            return SIGMOID.output(neuronLogit);
        case ActivationFunctionType.Tanh:
            return TANH.output(neuronLogit);
        case ActivationFunctionType.Softmax:
            return SOFTMAX.output(neuronLogit);
        case ActivationFunctionType.Linear:
            return LINEAR.output(neuronLogit);
    }

    throw new Error(`Unsupported type ${activationFunction}`);
}

export const calculateAFDerivative = (neuronLogit: number, activationFunction: ActivationFunctionType): number => {
    switch (activationFunction) {
        case ActivationFunctionType.ReLU:
            return RELU.derivative(neuronLogit);
        case ActivationFunctionType.LeakyReLU:
            return LEAKY_RELU.derivative(neuronLogit);
        case ActivationFunctionType.Sigmoid:
            return SIGMOID.derivative(neuronLogit);
        case ActivationFunctionType.Tanh:
            return TANH.derivative(neuronLogit);
        case ActivationFunctionType.Linear:
            return LINEAR.derivative(neuronLogit);
    }

    throw new Error(`Unsupported type ${activationFunction}`);
}
