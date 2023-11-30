import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import '../styles/Charts.css';
import { DataState, Record, Threshold, Weight } from '../types/neuralNetworkTypes';
import { Stack } from '@fluentui/react';
import { getSelectedData } from '../redux/selectors';

export interface ChartComponentProps {
    isOriginalData: boolean;
}

const ChartComponent: React.FC<ChartComponentProps> = () => {
    const d3Container = useRef(null);
    const dataState = useSelector((state: RootState) => state.data);
    const noHiddenLayers = useSelector((state: RootState) => state.neuralNetwork.hiddenLayers.length === 0);
    const data = getSelectedData(dataState)?.records;
    const labelId = dataState.selectedDataLabelId;
    const outputNeuronIds = dataState.selectedDataClasses;
    const shouldDrawLineForSimpleBinaryClassifierWithoutHidden = outputNeuronIds.length <= 2 && noHiddenLayers && dataState.weights;

    useEffect(() => {
        if (data && d3Container.current && outputNeuronIds) {
            const { headers, records } = getSelectedData(dataState)!;

            const svg = d3.select(d3Container.current);

            // Clear SVG before redrawing
            svg.selectAll('*').remove();

            // Set the dimensions and margins of the graph
            const margin = { top: 10, right: 30, bottom: 30, left: 40 },
                width = 460 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

            // Create a group element for appending chart elements
            const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

            // Calculate domains
            const [x1Label, x2Label] = headers;
            const xDomain = d3.extent(data, d => d[x1Label] as number) as [number, number];
            const yDomain = d3.extent(data, d => d[x2Label] as number) as [number, number];

            // Add X axis
            const scaleX = d3.scaleLinear().domain(xDomain).range([0, width]);
            g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(scaleX));

            // Add Y axis
            const scaleY = d3.scaleLinear().domain(yDomain).range([height, 0]);
            g.append('g').call(d3.axisLeft(scaleY));

            drawData(g, dataState, x1Label, x2Label, scaleX, scaleY);

            // Create a line generator (apply scaling if your data scale differs from the SVG scale)
            shouldDrawLineForSimpleBinaryClassifierWithoutHidden && drawLineSeparator(g, dataState, records, [xDomain, yDomain]);
        }
    }, [data, labelId, outputNeuronIds, dataState, shouldDrawLineForSimpleBinaryClassifierWithoutHidden]);

    return (
        <Stack className="chart-container" hidden={true}>
            <div className="title">Input Data</div>
            <svg className="d3-component" ref={d3Container} width={460} height={400} />
        </Stack>
    );
};

const drawLineSeparator = (g: d3.Selection<SVGGElement, unknown, HTMLElement, any>, dataState: DataState, records: Record[], domains: [number, number][]): void => {
    const { weights, thresholds } = dataState;

    // Check if the model has at least two features
    if (weights.length < 2) {
        console.error('Need at least two weights for 2D decision boundary visualization.');
        return;
    }

    // Define two x1 values at the extremes of your data
    const x1Values: number[] = domains[0];

    // Calculate corresponding x2 values for the line
    const linePoints: [number, number][] = x1Values.map(x1 => [x1, calculateX2(x1, weights, thresholds)]);

    const xScale = d3.scaleLinear().domain(domains[0]).range([0, 390]); // SVG width
    const yScale = d3.scaleLinear().domain(domains[1]).range([360, 0]); // SVG height, inverted

    // Line generator using the scales
    const lineGenerator = d3
        .line<[number, number]>()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]));

    // Draw the line
    g.append('path').datum(linePoints).attr('d', lineGenerator).attr('stroke', 'red').attr('stroke-width', 5).attr('fill', 'none');
};

const drawData = (
    g: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    dataState: DataState,
    label1: string,
    label2: string,
    scaleX: d3.ScaleLinear<number, number, never>,
    scaleY: d3.ScaleLinear<number, number, never>
) => {
    const inputData = getSelectedData(dataState)?.records;
    const gridPredections = dataState.gridPredections;
    const classLabel = dataState.selectedDataLabelId;
    const outputNeuronIds = dataState.selectedDataClasses;

    if (gridPredections) {
        // Color the grid based on predictions
        g.selectAll('.grid-point')
            .data(gridPredections)
            .enter()
            .append('rect') // or 'circle'
            .attr('class', 'grid-point')
            .attr('x', d => scaleX(d[label1] as number))
            .attr('y', d => scaleY(d[label2] as number))
            //.attr('r', 5) // Small radius for a "spray" effect
            .attr('id', 'rect_center')
            .attr('width', 5)
            .attr('height', 5)
            .style('fill', d => classColors[d.predection as number]); // Implement colorScale based on your classes
    }

    if (inputData) {
        // Add dots
        g.selectAll('.circle')
            .data(inputData)
            .enter()
            .append('circle')
            .attr('class', 'circle') // Apply styles to circles
            .attr('cx', function (d: Record) {
                return scaleX(d[label1] as number);
            })
            .attr('cy', function (d: Record) {
                return scaleY(d[label2] as number);
            })
            .attr('r', 3.5)
            .style('fill', function (d: Record) {
                return d[classLabel] === outputNeuronIds[0]
                    ? classColors[0]
                    : d[classLabel] === outputNeuronIds[1]
                    ? classColors[1]
                    : d[classLabel] === outputNeuronIds[2]
                    ? classColors[2]
                    : classColors[3];
            });
    }
};

const classColors = ['blue', 'orange', 'green', 'red'];

const calculateX2 = (x1: number, weights: Weight, thresholds: Threshold) => {
    const numberOfOutputNeurons = Object.keys(thresholds).length;
    const w00 = 'neuron-input-0=>neuron-output-0';
    const w10 = 'neuron-input-1=>neuron-output-0';
    const t0 = 'neuron-output-0';

    if (numberOfOutputNeurons === 2) {
        const w01 = 'neuron-input-0=>neuron-output-1';
        const w11 = 'neuron-input-1=>neuron-output-1';
        const t1 = 'neuron-output-1';

        // Corrected formula for binary classification with softmax
        return ((weights[w01] - weights[w00]) * x1 + (thresholds[t1] - thresholds[t0])) / (weights[w10] - weights[w11]);
    }
    // Fallback for a single neuron (like a sigmoid activation)
    return -(weights[w00] / weights[w10]) * x1 - thresholds[t0] / weights[w10];
};

export default ChartComponent;
