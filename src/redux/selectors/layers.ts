import { Layer, LayerType } from "../../types/neuralNetworkTypes";
import { RootState } from "../store/store";

export const getLayerByNeuronId = (neuronId: string) => (state: RootState) => {
    const layerId = neuronId.split('-')[1];
    return getLayer(layerId)(state);

}

export const getLayer = (layerId: string) => (state: RootState) => {
    if (layerId === LayerType.Input) {
        return state.neuralNetwork.inputLayer;
    }

    if (layerId === LayerType.Output) {
        return state.neuralNetwork.outputLayer;
    }

    return state.neuralNetwork.hiddenLayers.find(layer => layer.id === layerId)!;
}

export const getNumberOfLayers = (state: RootState) => {
    return 2 + state.neuralNetwork.hiddenLayers.length;
}

export const getNextLayer = (layer: Layer) => (state: RootState) => {
    const numOfLayers = getNumberOfLayers(state);
    if (layer.type === LayerType.Output) return null;
    if (numOfLayers === 2) return state.neuralNetwork.outputLayer;
    if(layer.type === LayerType.Input) return state.neuralNetwork.hiddenLayers[0];
    const numOfHidden = numOfLayers - 2;
    const indexOfHidden = parseInt(layer.id.replace('layer', ''))
    if (indexOfHidden === numOfHidden - 1) return state.neuralNetwork.outputLayer;
    return state.neuralNetwork.hiddenLayers[indexOfHidden + 1]; 
}

export const getPreviousLayer = (layer: Layer) => (state: RootState) => {
    const numOfLayers = getNumberOfLayers(state);
    if (layer.type === LayerType.Input) return null;
    if (numOfLayers === 2) return state.neuralNetwork.inputLayer;
    if(layer.type === LayerType.Output) return state.neuralNetwork.hiddenLayers[state.neuralNetwork.hiddenLayers.length - 1];
    const indexOfHidden = parseInt(layer.id.replace('layer', ''))
    if (indexOfHidden === 0) return state.neuralNetwork.inputLayer;
    return state.neuralNetwork.hiddenLayers[indexOfHidden - 1]; 
}