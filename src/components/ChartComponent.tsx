import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import '../styles/Charts.css';
import { Record } from '../types/neuralNetworkTypes';
import { Stack } from '@fluentui/react';
import { findUniqueValues } from '../utils/utils';

export interface ChartComponentProps {
    isOriginalData: boolean;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ isOriginalData }) => {
    const d3Container = useRef(null);
    const allData = useSelector((state: RootState) => state.data);
    const selectedData = allData.availableData.find(d => d.name === allData.selectedData);
    const labelId = selectedData?.headers.slice(-1)[0];
    const data = selectedData?.records;
    const outputNeuronIds = data && labelId && findUniqueValues(data.map(record => record[labelId]));

    useEffect(() => {
        if (data && d3Container.current  && outputNeuronIds) {
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
            const xDomain = d3.extent(data, d => d.x1 as number) as [number, number];
            const yDomain = d3.extent(data, d => d.x2 as number) as [number, number];

            // Add X axis
            const x = d3.scaleLinear().domain(xDomain).range([0, width]);
            g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

            // Add Y axis
            const y = d3.scaleLinear().domain(yDomain).range([height, 0]);
            g.append('g').call(d3.axisLeft(y));

            // Add dots
            g.selectAll('.circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('class', 'circle') // Apply styles to circles
                .attr('cx', function (d: Record) {
                    return x(d.x1 as number);
                })
                .attr('cy', function (d: Record) {
                    return y(d.x2 as number);
                })
                .attr('r', 2.5)
                .style('fill', function (d: Record) {
                    return d[labelId] === outputNeuronIds[0] ? 'blue' : 'orange';
                });
        }
    }, [data, labelId, outputNeuronIds]);

    return (
        <Stack className="chart-container" hidden={true}>
            <div className="title">{isOriginalData ? "Original Data" : "Predicted labels"}</div>
            <svg className="d3-component" ref={d3Container} width={460} height={400} />
        </Stack>
    );
};

export default ChartComponent;
