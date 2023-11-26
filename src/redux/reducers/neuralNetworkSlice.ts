import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Layer, NeuralNetworkState, LayerType } from '../../types/neuralNetworkTypes';
import initialNetwork from './initialNetwork';

export const neuralNetworkSlice = createSlice({
  name: 'neuralNetwork',
  initialState: initialNetwork,
  reducers: {
    setNetwork: (state: NeuralNetworkState, action: PayloadAction<NeuralNetworkState>) => {
      state = action.payload;
      return state;
    },
    addHiddenLayer: (state: NeuralNetworkState, action: PayloadAction<Layer>) => {
      state.hiddenLayers.push(action.payload);
      return state;
    },
    updateLayer: (state: NeuralNetworkState, action: PayloadAction<Layer>) => {
      const layer = action.payload;

      switch (layer.type) {
        case LayerType.Input:
          state.inputLayer = layer;
          return state;
        case LayerType.Output:
          state.outputLayer = layer;
          return state;
        case LayerType.Hidden:
          let oldLayerIndex = state.hiddenLayers.findIndex(l => l.id === layer.id)!;
          state.hiddenLayers[oldLayerIndex] = layer;
          return state;
      }
    },
    deleteHiddenLayer: (state: NeuralNetworkState, action: PayloadAction<number>) => {
      state.hiddenLayers.splice(action.payload, 1);
      return state;
    }
  }
});


export const { addHiddenLayer, updateLayer, deleteHiddenLayer, setNetwork } = neuralNetworkSlice.actions;

export const neuralNetworkReducer = neuralNetworkSlice.reducer;