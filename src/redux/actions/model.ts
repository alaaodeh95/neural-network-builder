import saveAs from "file-saver";
import { Model } from "../../types/neuralNetworkTypes";
import { ActionFn } from "../store/store"

export const saveModel: ActionFn = async (_, getState) => {
    const state = getState();
    const model: Model = {
        architecture: state.neuralNetwork,
        parameters: state.settings,
        weights: state.data.weights,
        thresholds: state.data.thresholds
    }
    const blob = new Blob([JSON.stringify(model)], { type: "application/json;charset=utf-8" });
    saveAs(blob, `${state.data.selectedData}.json`);
}
