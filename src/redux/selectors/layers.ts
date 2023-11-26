import { Layer, LayerType } from "../../types/neuralNetworkTypes";
import { RootState } from "../store/store";

export const getLayerByNeuronId = (neuronId: string) => (state: RootState) => {
    const layerId = neuronId.split('-')[1];
    return getLayer(layerId)(state);

}

export const getLayer = (layerId: string) => (state: RootState) => {
    if (layerId === LayerType.Input) {
        return state.neuralNetwork.network.inputLayer;
    }

    if (layerId === LayerType.Output) {
        return state.neuralNetwork.network.outputLayer;
    }

    return state.neuralNetwork.network.hiddenLayers.find(layer => layer.id === layerId)!;
}

export const getNumberOfLayers = (state: RootState) => {
    return 2 + state.neuralNetwork.network.hiddenLayers.length;
}

export const getNextLayer = (layer: Layer) => (state: RootState) => {
    const numOfLayers = getNumberOfLayers(state);
    if (layer.type === LayerType.Output) return null;
    if (numOfLayers === 2) return state.neuralNetwork.network.outputLayer;
    if(layer.type === LayerType.Input) return state.neuralNetwork.network.hiddenLayers[0];
    const numOfHidden = numOfLayers - 2;
    const indexOfHidden = parseInt(layer.id.replace('layer', ''))
    if (indexOfHidden === numOfHidden - 1) return state.neuralNetwork.network.outputLayer;
    return state.neuralNetwork.network.hiddenLayers[indexOfHidden + 1]; 
}

export const getPreviousLayer = (layer: Layer) => (state: RootState) => {
    const numOfLayers = getNumberOfLayers(state);
    if (layer.type === LayerType.Input) return null;
    if (numOfLayers === 2) return state.neuralNetwork.network.inputLayer;
    if(layer.type === LayerType.Output) return state.neuralNetwork.network.hiddenLayers[-1];
    const indexOfHidden = parseInt(layer.id.replace('layer', ''))
    if (indexOfHidden === 0) return state.neuralNetwork.network.inputLayer;
    return state.neuralNetwork.network.hiddenLayers[indexOfHidden - 1]; 
}