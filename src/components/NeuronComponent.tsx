import React from 'react';
import { LayerType, Neuron } from '../types/neuralNetworkTypes';
import styles from '../styles/NeuronComponent.module.css'; // Import the CSS module
import { useSelector } from 'react-redux';
import { getLayerByNeuronId, getNumberOfLayers } from '../redux/selectors/layers';
import { getConnectionDestionation } from '../redux/selectors';
import { RootState } from '../redux/store/store';

interface NeuronProps {
    neuron: Neuron;
}

interface ConnectionProps {
    type: LayerType;
    text: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export const NeuronComponent: React.FC<NeuronProps> = ({ neuron }) => {
    const layer = useSelector(getLayerByNeuronId(neuron.id));
    const numOfLayers = useSelector(getNumberOfLayers);
    const weights = useSelector((state: RootState) => state.data.weights);

    return (
        <div className={styles.neuron}>
            <div className={`${styles.neuronBody} ${[LayerType.Input, LayerType.Output].includes(layer.type) ? styles.input_output : ''}`}>
                <span style={{ color: 'black' }}>{neuron.name}</span>
                {neuron.connections.map(connection => {
                    const [endX, endY] = getConnectionDestionation(connection.id, numOfLayers);
                    return <ConnectionComponent key={connection.id} text={weights[connection.id]?.toFixed(4).toString() ?? ''} type={layer.type} startX={50} startY={25} endX={endX} endY={endY} />;
                })}
            </div>
        </div>
    );
};

const ConnectionComponent: React.FC<ConnectionProps> = ({ startX, startY, endX, endY, text }) => {
    // Calculate the length of the line
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

    // Calculate the angle of the line
    const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;

    // Set the transform-origin based on the direction of the line
    const transformOriginX = startX < endX ? 0 : '100%';
    // Set the transform-origin Y based on whether the line is going upwards or downwards
    const transformOriginY = startY > endY ? '100%' : '0';

    return (
        <div
            style={{
                position: 'absolute',
                left: `${startX}px`,
                top: `${startY}px`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: `${transformOriginX} ${transformOriginY}`,
                width: `${length}px`,
                height: '2px',
                backgroundColor: 'white',
            }}>
            <div
                style={{
                    color: 'white',
                    position: 'absolute',
                    width: `${length}px`,
                    top: '-20px', // Adjust this value as needed for positioning
                    left: '50%', // Center the text
                    transform: 'translateX(-50%)', // Center the text div relative to the line div
                    textAlign: 'center',
                    fontSize: '10px',
                }}>
                {text && <span className={styles.weight}> {text}</span>}
            </div>
        </div>
    );
};
