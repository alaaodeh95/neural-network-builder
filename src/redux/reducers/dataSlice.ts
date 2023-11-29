import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataState, Data, Weight, Threshold } from '../../types/neuralNetworkTypes';

export const initialDataState: DataState = {
    availableData: [],
    selectedData: '',
    weights: {},
    thresholds: {},
    selectedDataClasses: [],
    selectedDataLabelId: '',
};

export const dataSlice = createSlice({
    name: 'data',
    initialState: initialDataState,
    reducers: {
        addAndSetTrainingData: (state: DataState, action: PayloadAction<Data>) => {
            const addedData = action.payload;
            state.selectedData = addedData.name;
            const data = state.availableData.find(d => d.name === state.selectedData);
            !data && state.availableData.push(addedData);
            return state;
        },
        initializeData: (state: DataState, action: PayloadAction<Data[]>) => {
            const allData = action.payload;
            state.selectedData = allData[0].name;
            state.availableData = allData;
            return state;
        },
        setSelectedData: (state: DataState, action: PayloadAction<string>) => {
            state.selectedData = action.payload;
            return state;
        },
        setWeights: (state: DataState, action: PayloadAction<Weight>) => {
            state.weights = action.payload;
            return state;
        },
        setThresholds: (state: DataState, action: PayloadAction<Threshold>) => {
            state.thresholds = action.payload;
            return state;
        },
    }
});


export const { addAndSetTrainingData, initializeData, setSelectedData, setWeights, setThresholds } = dataSlice.actions;
export const dataReducer = dataSlice.reducer;