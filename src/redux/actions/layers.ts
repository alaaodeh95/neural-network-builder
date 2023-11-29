import { ActivationFunction, Layer, LayerType } from '../../types/neuralNetworkTypes';
import { findUniqueValues } from '../../utils/utils';
import { addHiddenLayer, deleteHiddenLayer, updateLayer } from '../reducers/neuralNetworkSlice';
import { getNextLayer, getPreviousLayer } from '../selectors/layers';
import { ActionFn } from '../store/store';
import { addNeuron, deleteNeuron, refreshNeuronConnections } from './neurons';


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

export const updateOutputLayer = (layer: Layer, newActivationFunction: ActivationFunction): ActionFn => (dispatch, getState) => {
    const oldActivationFunction = layer.activationFunction;
    const newLayer = {
        ...layer,
        activationFunction: newActivationFunction,
    };

    if (layer.neurons.length === 2 && oldActivationFunction === ActivationFunction.Softmax) {
        dispatch(deleteNeuron(layer.id, newLayer));
    } else if (layer.neurons.length === 1 && newActivationFunction === ActivationFunction.Softmax){
        const allData = getState().data;
        const selectedData = allData.availableData.find(d => d.name === allData.selectedData)!;
        const labelId = selectedData?.headers.slice(-1)[0];
        const outputNeuronIds = findUniqueValues(selectedData.records.map(record => record[labelId]));
        dispatch(addNeuron(layer.id, newLayer, outputNeuronIds[outputNeuronIds.length -1] as string));
    } else {
        dispatch(
            updateLayer(newLayer)
        );
    }
}
