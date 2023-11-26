import { dataReducer } from './dataSlice';
import { neuralNetworkReducer } from './neuralNetworkSlice';
import { trainingSettingsReducer } from './trainingSettingsSlice';

export const reducer = {
    neuralNetwork: neuralNetworkReducer,
    settings: trainingSettingsReducer,
    data: dataReducer
};
