import { useState } from 'react';
import './styles/styles.css';
import LoadingScreen from './components/LoadingScreen';
import { NeuralNetworkBuilder } from './components/NeuralNetworkBuilder';
import TrainingSettingsComponent from './components/TrainingSettings';
import { fetchSamples } from './utils/utils';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeData, setSelectedData, setThresholds, setWeights } from './redux/reducers/dataSlice';
import { useAppDispatch } from './redux/store/hooks';
import { buildInputAndOutputNeurons } from './redux/actions/neurons';
import { useMemo } from 'react';
import { CommandType, TrainingWorkerResponse, WorkerCommand, WorkerResponse } from './types/neuralNetworkTypes';
import { RootState } from './redux/store/store';
import { setIsTrained, setPredictingState, setTrainingState } from './redux/reducers/trainingSettingsSlice';
import LogsComponent from './components/LogsComponent';
import { log } from './redux/reducers/logsSlice';
import { Stack } from '@fluentui/react';
import ChartComponent from './components/ChartComponent';

function App() {
    const dispatch = useDispatch();
    const appDispatch = useAppDispatch();
    const isTraining = useSelector((state: RootState) => state.settings.isTraining);
    const isPredecting = useSelector((state: RootState) => state.settings.isPredecting);
    const data = useSelector((state: RootState) => state.data);
    const architecture = useSelector((state: RootState) => state.neuralNetwork);
    const parameters = useSelector((state: RootState) => state.settings);

    const [isLoading, setIsLoading] = useState(true);
    window.onload = () => setIsLoading(false);

    useEffect(() => {
        fetchSamples().then(data => {
            dispatch(initializeData(data));
            dispatch(setSelectedData(data[0].name));
            appDispatch(buildInputAndOutputNeurons(2));
            setIsLoading(false);
        });
    }, [appDispatch, dispatch, setIsLoading]);

    const mainWorker: Worker = useMemo(() => new Worker(new URL('./AI/worker.ts', import.meta.url)), []);

    useEffect(() => {
        if (mainWorker) {
            mainWorker.onmessage = (e: MessageEvent<WorkerResponse>) => {
                if (e.data.type === CommandType.Train) {
                    const response = e.data as TrainingWorkerResponse;
                    dispatch(
                        log(
                            `Finished epoch ${response.numOfEpochs}: accuracy = ${response.trainingAccuracy.toFixed(4)}, loss = ${response.trainingLoss.toFixed(
                                4
                            )}, validation accuracy = ${response.validationAccuracy.toFixed(4)}, validation loss = ${response.validationLoss.toFixed(4)}`
                        )
                    );
                    // Update the model (for saving) once finished training
                    if (response.isFinishedTraining) {
                        dispatch(setTrainingState(false));
                        dispatch(setWeights(response.weights!));
                        dispatch(setThresholds(response.thresholds!));
                        dispatch(setIsTrained(true));
                        dispatch(log(`Finished training: testing accuracy = ${response.testingAccuracy.toFixed(4)}, test loss = ${response.testingLoss.toFixed(4)}`));
                    }
                }

                if (e.data.type === CommandType.Predict) {
                    const response = e.data as TrainingWorkerResponse;
                    dispatch(setPredictingState(false));
                    dispatch(log(`Finished predecting: testing accuracy = ${response.testingAccuracy.toFixed(4)}, test loss = ${response.testingLoss.toFixed(4)}`));
                }
            };
        }
    }, [dispatch, mainWorker]);

    useEffect(() => {
        if (mainWorker && (isTraining || isPredecting)) {
            mainWorker.postMessage({
                type: isTraining ? CommandType.Train : CommandType.Predict,
                data: data.availableData.find(d => d.name === data.selectedData),
                model: {
                    architecture,
                    weights: isTraining ? {} : data.weights,
                    thresholds: isTraining ? {} : data.thresholds,
                    parameters,
                },
            } as WorkerCommand);
        }
    }, [mainWorker, isTraining, isPredecting, data, architecture, parameters]);

    return (
        <div>
            {isLoading && <LoadingScreen />}
            <Stack horizontal>
                <div>
                    {!isLoading && <TrainingSettingsComponent />}
                    {!isLoading && <NeuralNetworkBuilder />}
                    {!isLoading && <LogsComponent />}
                </div>
                <ChartComponent isOriginalData={false} />
            </Stack>
        </div>
    );
}

export default App;
