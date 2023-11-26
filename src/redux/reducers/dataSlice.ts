import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataState, Data, Weight } from '../../types/neuralNetworkTypes';

export const initialDataState: DataState = {
    availableData: [],
    selectedData: '',
    weights: [],
};

export const dataSlice = createSlice({
    name: 'data',
    initialState: initialDataState,
    reducers: {
        addAndSetTrainingData: (state, action: PayloadAction<Data>) => {
            const addedData = action.payload;
            state.selectedData = addedData.name;
            const data = state.availableData.find(d => d.name === state.selectedData);
            !data && state.availableData.push(addedData);
            return state;
        },
        initializeData: (state, action: PayloadAction<Data[]>) => {
            const allData = action.payload;
            state.selectedData = allData[0].name;
            state.availableData = allData;
            return state;
        },
        setSelectedData: (state, action: PayloadAction<string>) => {
            state.selectedData = action.payload;
            return state;
        },
        setWeights: (state, action: PayloadAction<Weight[]>) => {
            state.weights = action.payload;
            return state;
        },
    }
});


export const { addAndSetTrainingData, initializeData, setSelectedData, setWeights } = dataSlice.actions;
export const dataReducer = dataSlice.reducer;