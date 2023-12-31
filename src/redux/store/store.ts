import { configureStore } from '@reduxjs/toolkit';
import { reducer } from '../reducers';
import { NeuralNetworkState, TrainingSettingsState } from '../../types/neuralNetworkTypes';
import { initialDataState } from '../reducers/dataSlice';

export const createStore = (neuralNetwork: NeuralNetworkState, settings: TrainingSettingsState) => {
    return configureStore({
        reducer,
        preloadedState: {
            neuralNetwork,
            settings,
            data: initialDataState,
            logs: { logs: [] },
        },
    });
}

export type AppStore = ReturnType<typeof createStore>;
export type GetState = AppStore['getState'];
export type AppDispatch = AppStore['dispatch'];

export type RootState = ReturnType<GetState>;
export type ActionFn<T = void> = (dispatch: AppDispatch, getState: GetState) => Promise<T> | T;
