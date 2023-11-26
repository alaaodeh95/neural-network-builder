import React from 'react';
import { LayerType, Neuron } from '../types/neuralNetworkTypes';
import styles from '../styles/NeuronComponent.module.css'; // Import the CSS module
import { useSelector } from 'react-redux';
import { getLayerByNeuronId, getNumberOfLayers } from '../redux/selectors/layers';
import { getConnectionDestionation } from '../redux/selectors';

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

    return (
        <div className={styles.neuron}>
            <div className={`${styles.neuronBody} ${[LayerType.Input, LayerType.Output].includes(layer.type) ? styles.input_output : ''}`} >
                {neuron.connections.map(connection => {
                    const [endX, endY] = getConnectionDestionation(connection.id, numOfLayers);
                    return (<ConnectionComponent text={''} type={layer.type} startX={50} startY={25} endX={endX} endY={endY} />)
                })}
            </div>
        </div>
    );
};

const ConnectionComponent: React.FC<ConnectionProps> = ({ startX, startY, endX, endY, text }) => {
    // Calculate the length of the line
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

    // Calculate the angle of the line
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    // Set transform origin
    const transformOrigin = (startX <= endX) ? 'top left' : 'top right';

    // Determine initial position
    const initialX = (startX <= endX) ? startX : startX - length;
    const initialY = startY;

    // Apply the rotation around the correct origin
    const finalX = initialX;
    const finalY = initialY;

    return (
        <div style={{
            position: 'absolute',
            left: `${finalX}px`,
            top: `${finalY}px`,
            transform: `rotate(${angle}deg)`,
            transformOrigin: transformOrigin
        }}>
            <div style={{
                width: `${length}px`,
                height: '2px',
                backgroundColor: 'white',
            }} />
            <div style={{
                color: 'white',
                position: 'absolute',
                width: `${length}px`,
                top: '-20px', // Adjust this value as needed for positioning
                left: '0',
                textAlign: 'center',
                fontSize: '10px'
            }}>
                {text}
            </div>
        </div>
    );
};