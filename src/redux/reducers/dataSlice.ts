import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataState, Data, Weight, Threshold, Record } from '../../types/neuralNetworkTypes';
import { findUniqueValues } from '../../utils/utils';
import { getSelectedData } from '../selectors';

export const initialDataState: DataState = {
    availableData: [],
    selectedData: '',
    weights: {},
    thresholds: {},
    selectedDataClasses: [],
    selectedDataLabelId: '',
    gridPredections: [],
};

export const dataSlice = createSlice({
    name: 'data',
    initialState: initialDataState,
    reducers: {
        addAndSetTrainingData: (state: DataState, action: PayloadAction<Data>) => {
            const addedData = action.payload;
            state.selectedData = addedData.name;
            const data = getSelectedData(state);
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
            const selectedDataObject = getSelectedData(state);
            const labelId = selectedDataObject?.headers.slice(-1)[0]!;
            const outputNeuronIds = findUniqueValues(selectedDataObject!.records!.map(record => record[labelId!])) as string[];
            state.selectedDataClasses = outputNeuronIds;
            state.selectedDataLabelId = labelId;
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
        setSelectedDataClasses: (state: DataState, action: PayloadAction<string[]>) => {
            state.selectedDataClasses = action.payload;
            return state;
        },
        setSelectedDataLabelId: (state: DataState, action: PayloadAction<string>) => {
            state.selectedDataLabelId = action.payload;
            return state;
        },
        setGridPredections: (state: DataState, action: PayloadAction<Record[]>) => {
            state.gridPredections = action.payload;
            return state;
        },
    }
});


export const { addAndSetTrainingData, initializeData, setSelectedData, setWeights, setThresholds, setSelectedDataClasses, setSelectedDataLabelId, setGridPredections } = dataSlice.actions;
export const dataReducer = dataSlice.reducer;