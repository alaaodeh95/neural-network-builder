import { samplesData } from "../constants/constants";
import Papa from "papaparse";
import { Data, Record } from "../types/neuralNetworkTypes";

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
