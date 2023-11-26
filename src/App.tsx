import { useState } from "react";
import "./styles/styles.css";
import LoadingScreen from "./components/LoadingScreen";
import { NeuralNetworkBuilder } from "./components/NeuralNetworkBuilder";
import TrainingSettingsComponent from "./components/TrainingSettings";
import { fetchSamples } from "./utils/utils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeData, setSelectedData, setWeights } from "./redux/reducers/dataSlice";
import { useAppDispatch } from "./redux/store/hooks";
import { buildInputAndOutputNeurons } from "./redux/actions/neurons";
import { useMemo } from "react";
import { CommandType, WorkerCommand, WorkerResponse } from "./types/neuralNetworkTypes";
import { RootState } from "./redux/store/store";
import { setTrainingState } from "./redux/reducers/trainingSettingsSlice";

function App() {
    const dispatch = useDispatch();
    const appDispatch = useAppDispatch();
    const isTraining = useSelector(
        (state: RootState) => state.settings.isTraining
    );
    const isPredecting = useSelector(
        (state: RootState) => state.settings.isPredecting
    );
    const inputData = useSelector((state: RootState) =>
        state.data.availableData.find((d) => d.name === state.data.selectedData)
    );
    const architecture = useSelector((state: RootState) => state.neuralNetwork);
    const parameters = useSelector((state: RootState) => state.settings);

    const [isLoading, setIsLoading] = useState(true);
    window.onload = () => setIsLoading(false);

    useEffect(() => {
        fetchSamples().then((data) => {
            dispatch(initializeData(data));
            dispatch(setSelectedData(data[0].name));
            appDispatch(buildInputAndOutputNeurons(2));
            setIsLoading(false);
        });
    }, [appDispatch, dispatch, setIsLoading]);

    const mainWorker: Worker = useMemo(
        () => new Worker(new URL("./AI/worker.ts", import.meta.url)),
        []
    );

    useEffect(() => {
        if (mainWorker) {
            mainWorker.onmessage = (e: MessageEvent<WorkerResponse>) => {
                const response = e.data;
                if (response.type === CommandType.Train) {
                    dispatch(setTrainingState(false));
                    dispatch(setWeights(response.weights!));
                }
            }
        }
    }, [mainWorker]);

    useEffect(() => {
        if (mainWorker && (isTraining || isPredecting)) {
            mainWorker.postMessage({
                type: isTraining ? CommandType.Train : CommandType.Predict,
                data: inputData,
                model: {
                    architecture,
                    weights: [],
                    parameters,
                },
            } as WorkerCommand);
        }
    }, [
        mainWorker,
        isTraining,
        isPredecting,
        inputData,
        architecture,
        parameters,
    ]);

    return (
        <div>
            {isLoading && <LoadingScreen />}
            {!isLoading && <TrainingSettingsComponent />}
            {!isLoading && <NeuralNetworkBuilder />}
        </div>
    );
}

export default App;
