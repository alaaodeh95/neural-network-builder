import { useSelector } from "react-redux";
import { LayerComponent } from "./LayerComponent";
import { RootState } from "../redux/store/store";
import styles from "../styles/NeuralNetworkBuilder.module.css"; // Import the CSS module
import { useAppDispatch } from "../redux/store/hooks";
import { addLayer, deleteLayer } from "../redux/actions/layers";

export const NeuralNetworkBuilder = () => {
    const dispatch = useAppDispatch();
    const neuralNetwork = useSelector((state: RootState) => state.neuralNetwork);

    return (
        <div className={styles.networkBuilder}>
            <div className={styles.hiddenLayerControlsContainer}>
                <button
                    onClick={() => dispatch(addLayer())}
                    className={styles.addLayerButton}
                >
                    Add Layer
                </button>
                {!!neuralNetwork.hiddenLayers.length && (
                    <button
                        onClick={() =>
                            dispatch(
                                deleteLayer(
                                    neuralNetwork.hiddenLayers.length - 1
                                )
                            )
                        }
                        className={styles.deleteLayerButton}
                    >
                        Delete Layer
                    </button>
                )}
            </div>
            <div className={styles.builder}>
                <LayerComponent layer={neuralNetwork.inputLayer} />
                {neuralNetwork.hiddenLayers.map((layer, index) => (
                    <LayerComponent key={layer.id} layer={layer} />
                ))}
                <LayerComponent layer={neuralNetwork.outputLayer} />
            </div>
        </div>
    );
};
