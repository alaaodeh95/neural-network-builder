import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LossFunction, TrainingSettingsState } from '../../types/neuralNetworkTypes';

export const initialState: TrainingSettingsState = {
    learningRate: 0.05,
    maxEpochs: 100,
    lossFunction: LossFunction.MSE,
    stopLossValue: 0.005,
    trainingPercentage: 70, // Default values can be set as needed
    validationPercentage: 15,
    testingPercentage: 15,
    isTraining: false,
    isPredecting: false,
    isTrained: false,
};

const trainingSettingsSlice = createSlice({
    name: 'trainingSettings',
    initialState,
    reducers: {
        setSettings(state, action: PayloadAction<TrainingSettingsState>) {
            state = { ...action.payload, isPredecting: false, isTraining: false }
            return state;
        },
        setLearningRate(state, action: PayloadAction<number>) {
            state.learningRate = action.payload;
            return state;
        },
        setMaxEpochs(state, action: PayloadAction<number>) {
            state.maxEpochs = action.payload;
            return state;
        },
        setLossFunction(state, action: PayloadAction<LossFunction>) {
            state.lossFunction = action.payload;
            return state;
        },
        setStopLossValue(state, action: PayloadAction<number>) {
            state.stopLossValue = action.payload;
            return state;
        },
        setTrainingPercentage(state, action: PayloadAction<number>) {
            state.trainingPercentage = action.payload;
            return state;
        },
        setValidationPercentage(state, action: PayloadAction<number>) {
            state.validationPercentage = action.payload;
            return state;
        },
        setTestingPercentage(state, action: PayloadAction<number>) {
            state.testingPercentage = action.payload;
            return state;
        },
        setTrainingState(state, action: PayloadAction<boolean>) {
            state.isTraining = action.payload;
            return state;
        },
        setPredictingState(state, action: PayloadAction<boolean>) {
            state.isPredecting = action.payload;
            return state;
        },
        setIsTrained(state, action: PayloadAction<boolean>) {
            state.isTrained = action.payload;
            return state;
        },
    },
});

export const {
    setLearningRate,
    setMaxEpochs,
    setLossFunction,
    setStopLossValue,
    setTrainingPercentage,
    setValidationPercentage,
    setTestingPercentage,
    setTrainingState,
    setPredictingState,
    setSettings,
    setIsTrained,
} = trainingSettingsSlice.actions;

export const trainingSettingsReducer = trainingSettingsSlice.reducer;
