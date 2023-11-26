import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Layer, NeuralNetworkState, LayerType } from '../../types/neuralNetworkTypes';
import initialNetwork from './initialNetwork';

export const initialNetworkState: NeuralNetworkState = {
  network: initialNetwork
};

export const neuralNetworkSlice = createSlice({
  name: 'neuralNetwork',
  initialState: initialNetworkState,
  reducers: {
    addHiddenLayer: (state: NeuralNetworkState, action: PayloadAction<Layer>) => {
      state.network.hiddenLayers.push(action.payload);
      return state;
    },
    updateLayer: (state: NeuralNetworkState, action: PayloadAction<Layer>) => {
      const layer = action.payload;

      switch (layer.type) {
        case LayerType.Input:
          state.network.inputLayer = layer;
          return state;
        case LayerType.Output:
          state.network.outputLayer = layer;
          return state;
        case LayerType.Hidden:
          let oldLayerIndex = state.network.hiddenLayers.findIndex(l => l.id === layer.id)!;
          state.network.hiddenLayers[oldLayerIndex] = layer;
          return state;
      }
    },
    deleteHiddenLayer: (state: NeuralNetworkState, action: PayloadAction<number>) => {
      state.network.hiddenLayers.splice(action.payload, 1);
      return state;
    },
  }
});


export const { addHiddenLayer, updateLayer, deleteHiddenLayer } = neuralNetworkSlice.actions;

export const neuralNetworkReducer = neuralNetworkSlice.reducer;