import { LayerType } from "../../types/neuralNetworkTypes";

export const getConnectionDestionation = (connectionId: string, numOfLayers: number): number[] => {
    const [fromNeuronId, toNeuronId] = connectionId.split('=>');
    const [_, fromNeuronType, fromNeuronIdx] = fromNeuronId.split('-');
    const [__, toNeuronType, toNeuronIdx] = toNeuronId.split('-');
    const fromIdx = parseInt(fromNeuronIdx);
    const toIdx = parseInt(toNeuronIdx);

    const endX = 900/(numOfLayers - 1);

    if (fromNeuronType === LayerType.Input && toNeuronType === LayerType.Output) {
        if (toIdx >= fromIdx) {
            return [endX, 25 + (75 * Math.abs(fromIdx - toIdx))];
        } else {
            return [endX, -(25 + (75 * Math.abs(fromIdx - toIdx)))];
        }
    }
    return [endX, 25 + (75 * Math.abs(toIdx - fromIdx))];
}
