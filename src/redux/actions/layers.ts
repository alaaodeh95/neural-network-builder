import { ActivationFunction, Layer, LayerType } from '../../types/neuralNetworkTypes';
import { addHiddenLayer, deleteHiddenLayer } from '../reducers/neuralNetworkSlice';
import { getNextLayer, getPreviousLayer } from '../selectors/layers';
import { ActionFn } from '../store/store';
import { addNeuron, refreshNeuronConnections } from './neurons';


export const addLayer = (): ActionFn => (dispatch, getState) => {
    const state = getState();
    const newLayer: Layer = {
        id: `layer${state.neuralNetwork.hiddenLayers.length}`,
        activationFunction: ActivationFunction.ReLU,
        type: LayerType.Hidden,
        neurons: [],
    };
    dispatch(addHiddenLayer(newLayer));
    const previousLayer = getPreviousLayer(newLayer)(state)!;
    dispatch(refreshNeuronConnections(previousLayer, newLayer));
    dispatch(addNeuron(newLayer.id));
    dispatch(addNeuron(newLayer.id));
}

export const deleteLayer = (layerIndex: number): ActionFn => (dispatch, getState) => {
    if (layerIndex >= 0) {
        const state = getState();
        const layer = state.neuralNetwork.hiddenLayers[layerIndex];
        dispatch(deleteHiddenLayer(layerIndex));
        const previousLayer = getPreviousLayer(layer)(state)!;
        const nextLayer = getNextLayer(layer)(state)!;
        dispatch(refreshNeuronConnections(previousLayer, nextLayer));
    }
}
