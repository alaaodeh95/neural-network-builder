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
    connections: Connection[];
}

export interface Layer {
    id: string;
    type: LayerType;
    neurons: Neuron[];
}


export interface NeuralNetwork {
    inputLayer: Layer;
    hiddenLayers: Layer[];
    outputLayer: Layer;
}

export interface NeuralNetworkState {
    network: NeuralNetwork
}
