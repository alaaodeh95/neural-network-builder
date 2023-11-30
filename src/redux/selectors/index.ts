import { DataState } from '../../types/neuralNetworkTypes';

export * from './layers';
export * from './connections';

export const getSelectedData = (state: DataState) =>  state.availableData.find(d => d.name === state.selectedData);
