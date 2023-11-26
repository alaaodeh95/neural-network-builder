import { Connection, Layer, Neuron } from '../../types/neuralNetworkTypes';
import { updateLayer } from '../reducers/neuralNetworkSlice';
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
            neuron => ({ id: neuron.id, connections: nextLayer?.neurons.map(nextNeuron => ({ id: `${neuron.id}=>${nextNeuron.id}` } as Connection)) })),
    }))
}