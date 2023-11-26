export const getConnectionDestionation = (connectionId: string, numOfLayers: number): number[] => {
    const [fromNeuronId, toNeuronId] = connectionId.split('=>');
    const fromIdx = parseInt(fromNeuronId.split('-')[2]);
    const toIdx = parseInt(toNeuronId.split('-')[2]);
    const diff = Math.abs(fromIdx - toIdx);

    const endX = 900 / (numOfLayers - 1);
    if (toIdx >= fromIdx) {
        return [endX, 25 + (75 * diff)];
    } else {
        return [endX, 20 + (-75 * diff)];
    }
}
