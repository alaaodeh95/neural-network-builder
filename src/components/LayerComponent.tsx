import React from "react";
import { NeuronComponent } from "./NeuronComponent";
import styles from "../styles/LayerComponent.module.css";
import {
    ActivationFunction,
    Layer,
    LayerType,
} from "../types/neuralNetworkTypes";
import { addNeuron, deleteNeuron } from "../redux/actions/neurons";
import { useAppDispatch } from "../redux/store/hooks";
import { useSelector } from "react-redux";
import { getNumberOfLayers } from "../redux/selectors/layers";
import { Dropdown, IDropdownOption } from "@fluentui/react";
import { updateLayer } from "../redux/reducers/neuralNetworkSlice";
import { hiddenLayersAF, outputLayerAF } from "../constants/constants";

interface LayerProps {
    layer: Layer;
}

export const LayerComponent: React.FC<LayerProps> = ({ layer }) => {
    const dispatch = useAppDispatch();
    const numberOfLayers = useSelector(getNumberOfLayers);

    const handleAddNeuron = () => {
        dispatch(addNeuron(layer.id));
    };

    const handleDeleteNeuron = () => {
        dispatch(deleteNeuron(layer.id));
    };

    const onActivationChange = (
        event: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption
    ) => {
        dispatch(
            updateLayer({
                ...layer,
                activationFunction: option!.text as ActivationFunction,
            })
        );
    };

    return (
        <div
            className={`${styles.layer} ${
                layer.type === LayerType.Input ? styles.inputLayer : ""
            } ${
                layer.type === LayerType.Output
                    ? numberOfLayers === 2
                        ? styles.outputLayerWithoutHidden
                        : styles.outputLayer
                    : ""
            } ${layer.type === LayerType.Hidden ? styles.hiddenLayer : ""} `}
        >
            {layer.type !== LayerType.Input && (
                <Dropdown
                    options={
                        layer.type === LayerType.Hidden
                            ? hiddenLayersAF
                            : outputLayerAF
                    }
                    onChange={onActivationChange}
                    defaultSelectedKey={
                        layer.type === LayerType.Hidden
                            ? ActivationFunction.ReLU
                            : ActivationFunction.Softmax
                    }
                    className={styles.activationFunction}
                />
            )}
            {layer.type === LayerType.Hidden && (
                <div className={styles.layerControls}>
                    <button
                        className={styles.circleButton}
                        onClick={handleAddNeuron}
                    >
                        +
                    </button>
                    <button
                        className={styles.circleButton}
                        onClick={handleDeleteNeuron}
                    >
                        -
                    </button>
                </div>
            )}
            {layer.type === LayerType.Input && (
                <span className={styles.layerName}>Input</span>
            )}
            {layer.type === LayerType.Output && (
                <span className={styles.layerName}>Output</span>
            )}
            {layer.neurons.map((neuron) => (
                <NeuronComponent key={neuron.id} neuron={neuron} />
            ))}
        </div>
    );
};
