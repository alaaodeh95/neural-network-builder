import { ActivationFunction, Connection, Layer, LayerType, Neuron } from '../../types/neuralNetworkTypes';
import { findUniqueValues } from '../../utils/utils';
import { addHiddenLayer, updateLayer } from '../reducers/neuralNetworkSlice';
import { getLayer, getNextLayer, getPreviousLayer } from '../selectors/layers';
import { ActionFn } from '../store/store';
import { deleteLayer } from './layers';


export const deleteNeuron = (layerId: string): ActionFn => async (dispatch, getState) => {
    const state = getState();
    const layer = getLayer(layerId)(state);

    if (layer.neurons.length === 1) {
        dispatch(deleteLayer(parseInt(layer.id.replace('layer', ''))));
        return;
    }

    const neuronId = layer.neurons.slice(-1)[0].id;
    const previousLayer = getPreviousLayer(layer)(state);
    previousLayer && dispatch(updateLayer({
        ...previousLayer, neurons: previousLayer.neurons.map(
            neuron => ({ id: neuron.id, connections: neuron.connections.filter(connection => !connection.id.includes(neuronId)) })),
    }));
    dispatch(updateLayer({ ...layer, neurons: layer.neurons.slice(0, -1) }));
}

export const addNeuron = (layerId: string): ActionFn => async (dispatch, getState) => {
    const state = getState();
    const layer = getLayer(layerId)(state);
    const nextLayer = getNextLayer(layer)(state);
    const neuronId = `neuron-${layer.id}-${layer.neurons.length}`;
    const newNeuron: Neuron = {
        id: neuronId,
        connections: nextLayer?.neurons.map(neuron => ({ id: `${neuronId}=>${neuron.id}` } as Connection)) || [],
    };
    const newLayer = { ...layer, neurons: [...layer.neurons, newNeuron] };
    dispatch(updateLayer(newLayer));

    const previousLayer = getPreviousLayer(layer)(state);
    previousLayer && dispatch(refreshNeuronConnections(previousLayer, newLayer));
}

export const refreshNeuronConnections = (layer: Layer, nextLayer: Layer): ActionFn => async (dispatch, getState) => {
    dispatch(updateLayer({
        ...layer, neurons: layer.neurons.map(
            neuron => ({ id: neuron.id, name: neuron.name, connections: nextLayer?.neurons.map(nextNeuron => ({ id: `${neuron.id}=>${nextNeuron.id}` } as Connection)) })),
    }))
}

// numOfHiddenNeurons only set for initilaization
export const buildInputAndOutputNeurons = (numOfHiddenNeurons?: number): ActionFn => (dispatch, getState) => {
    const network = getState().neuralNetwork;
    const dataState = getState().data;
    const data = dataState.availableData.filter(d => d.name === dataState.selectedData)[0];
    let firstHidden = network.hiddenLayers[0] || network.outputLayer;
    let lastHidden = network.hiddenLayers.slice(-1)[0] || network.inputLayer;

    if (numOfHiddenNeurons) {
        const temp: Layer = {
            id: "layer0",
            type: LayerType.Hidden,
            activationFunction: ActivationFunction.ReLU,
            neurons: Array(data.headers.length - 1).fill(0).map((_, idx) => ({
                id: `neuron-layer0-${idx}`, connections: []
            })),
        }
        firstHidden = temp;
        lastHidden = temp;
    }

    // Output Layer handling
    const labelId = data.headers.slice(-1)[0];
    const outputNeuronIds = findUniqueValues(data.records.map(record => record[labelId]));
    const outputNeurons = outputNeuronIds.map((outputId, idx) => ({
        id: `neuron-output-${idx}`,
        name: outputId as string,
        connections: []
    }));
    dispatch(updateLayer({ ...network.outputLayer, neurons: outputNeurons }));

    // Handle the layer before output (Only if not input)
    if (lastHidden.type === LayerType.Hidden) {
        const hiddenNeurons: Neuron[] = lastHidden.neurons.map(n => ({
            ...n,
            connections: outputNeurons.map(on => ({
                id: `${n.id}=>${on.id}`
            }))
        }));

        // Update if exist
        !numOfHiddenNeurons && dispatch(updateLayer({ ...lastHidden, neurons: hiddenNeurons }));
        numOfHiddenNeurons && dispatch(addHiddenLayer({ ...lastHidden, neurons: hiddenNeurons }));
    }

    // Input layer handling
    const inputNeuronsIds = data.headers.slice(0, data.headers.length - 1);
    const inputNeurons: Neuron[] = inputNeuronsIds.map((inputId, idx) => ({
        id: `neuron-input-${idx}`,
        name: inputId,
        connections: firstHidden.neurons.map(neuron => ({
            id: `neuron-input-${idx}=>${neuron.id}`
        }))
    }));
    dispatch(updateLayer({ ...network.inputLayer, neurons: inputNeurons }));
}
