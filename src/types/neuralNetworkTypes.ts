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
    isTrained: boolean;
}

export interface DataState {
    availableData: Data[];
    selectedData: string;
    selectedDataLabelId: string;
    selectedDataClasses: string[];
    weights: Weight;
    thresholds: Threshold;
    gridPredections: Record[];
}

export interface Model {
    architecture: NeuralNetworkState;
    weights: Weight;
    thresholds: Threshold;
    parameters: TrainingSettingsState;
}

export enum CommandType {
    Train = 'Train',
    Predict = 'Predict',
}

export interface WorkerCommand {
    model: Model,
    data: Data,
    type: CommandType,
    gridData: Record[],
}


export interface WorkerResponse {
    type: CommandType
}

export interface TrainingWorkerResponse extends TestingWorkerResponse {
    weights: Weight;
    thresholds: Threshold;
    trainingLoss: number;
    validationLoss: number;
    trainingAccuracy: number;
    validationAccuracy: number;
    numOfEpochs: number;
    isFinishedTraining: boolean;
    gridPredections: Record[];
}

export interface TestingWorkerResponse extends WorkerResponse {
    testingLoss: number;
    testingAccuracy: number;
    gridPredections?: Record[];
}

export enum ActivationFunction {
    ReLU = 'ReLU',
    LeakyReLU = 'LeakyReLU',
    Tanh = 'Tanh',
    Sigmoid = 'Sigmoid',
    Softmax = 'Softmax',
    Linear = 'Linear',
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
export type Threshold = { [key: string]: number };
export type NeuronState = { [key: string]: { value: number, logit?: number, error?: number, gradientError?: number, predicted?: number} }; // predicted is used as value for output layer, while value is the actual value in output layer
