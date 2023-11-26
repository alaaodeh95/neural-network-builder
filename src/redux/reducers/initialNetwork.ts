import { ActivationFunction, LayerType, NeuralNetworkState } from '../../types/neuralNetworkTypes';

const initialNetwork: NeuralNetworkState = {
    inputLayer: {
        id: LayerType.Input,
        type: LayerType.Input,
        activationFunction: ActivationFunction.None,
        neurons: []
    },
    hiddenLayers: [],
    outputLayer: {
        id: LayerType.Output,
        activationFunction: ActivationFunction.Softmax,
        type: LayerType.Output,
        neurons: []
    }
};

export default initialNetwork;
