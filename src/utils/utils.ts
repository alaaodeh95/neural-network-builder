import { samplesData } from "../constants/constants";
import Papa from "papaparse";
import { Data, Record } from "../types/neuralNetworkTypes";
import * as d3 from 'd3';

export const fetchSamples = async () => {
    const data: Data[] = [];

    try {
        for (const path of samplesData) {
            const response = await fetch(path);

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const csvData = await response.text();
            const result = await new Promise<any>((resolve, reject) => {
                Papa.parse(csvData, {
                    header: true,
                    dynamicTyping: true,
                    complete: resolve,
                    error: reject,
                });
            });

            const trainingData = {
                name: path.split("/")[2],
                headers: result.meta.fields!,
                records: result.data! as Record[],
            };

            data.push(trainingData);
        }

        return data;
    } catch (error) {
        console.error("Error while fetching or parsing data:", error);
        throw error;
    }
};

export const findUniqueValues = (arr: (string | number)[]) => {
    const uniqueValues: (string | number)[] = [];

    arr.forEach((value) => {
        if (uniqueValues.indexOf(value) === -1) {
            uniqueValues.push(value);
        }
    });

    return uniqueValues;
}

export const generateGridPoints = (data: Data, gridSizeX = 390, gridSizeY = 360, step = 5): Record[] => {
    const labels = data!.headers!.slice(0, 2);
    const records = data.records;
    const xDomain = d3.extent(records, d => d[labels[0]] as number) as [number, number];
    const yDomain = d3.extent(records, d => d[labels[1]] as number) as [number, number];

    // Calculate the scaling factors
    const xScaleFactor = (xDomain[1] - xDomain[0]) / gridSizeX;
    const yScaleFactor = (yDomain[1] - yDomain[0]) / gridSizeY;

    const gridPoints = [];
    for (let x = 0; x <= gridSizeX; x += step) {
        for (let y = 0; y <= gridSizeY; y += step) {
            // Scale the points according to the domain
            const scaledX = x * xScaleFactor + xDomain[0];
            const scaledY = y * yScaleFactor + yDomain[0];
            gridPoints.push({ [labels[0]]: scaledX, [labels[1]]: scaledY });
        }
    }
    return gridPoints;
}
