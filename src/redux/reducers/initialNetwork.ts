import { LayerType, NeuralNetwork } from '../../types/neuralNetworkTypes';

const initialNetwork: NeuralNetwork = {
    inputLayer: {
        id: LayerType.Input,
        type: LayerType.Input,
        neurons: [
            {
                id: "neuron-input-0", connections: [
                    { id: "neuron-input-0=>neuron-output-0" }, { id: "neuron-input-0=>neuron-output-1" },
                    { id: "neuron-input-0=>neuron-output-2" }, { id: "neuron-input-0=>neuron-output-3" }
                ]
            }, {
                id: "neuron-input-1", connections: [
                    { id: "neuron-input-1=>neuron-output-0" }, { id: "neuron-input-1=>neuron-output-1" },
                    { id: "neuron-input-1=>neuron-output-2" }, { id: "neuron-input-1=>neuron-output-3" }
                ]
            }
        ]
    },
    hiddenLayers: [],
    outputLayer: {
        id: LayerType.Output,
        type: LayerType.Output,
        neurons: [
            { id: "neuron-output-0", connections: [] }, { id: "neuron-output-1", connections: [] },
            { id: "neuron-output-2", connections: [] }, { id: "neuron-output-3", connections: [] }
        ]
    }
}

export default initialNetwork;
