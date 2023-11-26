export enum LayerType {
    Input = 'input',
    Hidden = 'hidden',
    Output = 'output',
}

export interface Connection {
    id: string;
}

export interface Neuron {
    id: string;
    name?: string;
    connections: Connection[];
}

export interface Layer {
    id: string;
    type: LayerType;
    activationFunction: ActivationFunction;
    neurons: Neuron[];
}


export interface NeuralNetworkState {
    inputLayer: Layer;
    hiddenLayers: Layer[];
    outputLayer: Layer;
}

export interface TrainingSettingsState {
    learningRate: number;
    maxEpochs: number;
    lossFunction: LossFunction;
    stopLossValue: number;
    trainingPercentage: number;
    validationPercentage: number;
    testingPercentage: number;
    isTraining: boolean;
    isPredecting: boolean;
}

export interface DataState {
    availableData: Data[];
    selectedData: string;
    weights: Weight[];
}

export interface Model {
    architecture: NeuralNetworkState;
    weights: Weight[];
    parameters: TrainingSettingsState;
}

export enum CommandType {
    Train = 'Train',
    Predict = 'Predict'
}

export interface WorkerCommand {
    model: Model,
    data: Data,
    type: CommandType
}


export interface WorkerResponse {
    type: CommandType
    weights?: Weight[];
}

export enum ActivationFunction {
    ReLU = 'ReLU',
    LeakyReLU = 'LeakyReLU',
    Tanh = 'Tanh',
    Sigmoid = 'Sigmoid',
    Softmax = 'Softmax',
    None = 'None'
}

export enum LossFunction {
    CrossEntropy = 'CrossEntropy',
    SSE = 'SSE',
    MSE = 'MSE',
}

export interface Data {
    name: string;
    headers: string[];
    records: Record[];
}

export type Record = { [key: string]: number | string };
export type Weight = { [key: string]: number };