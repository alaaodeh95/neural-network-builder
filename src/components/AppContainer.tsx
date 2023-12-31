import { useEffect } from 'react';
import { NeuralNetworkBuilder } from './NeuralNetworkBuilder';
import TrainingSettingsComponent from './TrainingSettings';
import { fetchSamples, generateGridPoints } from './../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { initializeData, setGridPredections, setSelectedData, setThresholds, setWeights } from './../redux/reducers/dataSlice';
import { useAppDispatch } from './../redux/store/hooks';
import { buildInputAndOutputNeurons } from './../redux/actions/neurons';
import { useMemo } from 'react';
import { CommandType, TrainingWorkerResponse, WorkerCommand, WorkerResponse } from './../types/neuralNetworkTypes';
import { RootState } from './../redux/store/store';
import { setIsTrained, setPredictingState, setTrainingState } from './../redux/reducers/trainingSettingsSlice';
import LogsComponent from './LogsComponent';
import { log } from './../redux/reducers/logsSlice';
import { Stack } from '@fluentui/react';
import ChartComponent from './ChartComponent';
import { getSelectedData } from './../redux/selectors';

interface AppContainerProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContainer: React.FC<AppContainerProps> = ({ setIsLoading }) => {
    const dispatch = useDispatch();
    const appDispatch = useAppDispatch();
    const isTraining = useSelector((state: RootState) => state.settings.isTraining);
    const isPredecting = useSelector((state: RootState) => state.settings.isPredecting);
    const data = useSelector((state: RootState) => state.data);
    const architecture = useSelector((state: RootState) => state.neuralNetwork);
    const parameters = useSelector((state: RootState) => state.settings);

    useEffect(() => {
        fetchSamples().then(data => {
            dispatch(initializeData(data));
            dispatch(setSelectedData(data[0].name));
            appDispatch(buildInputAndOutputNeurons());
            setIsLoading(false);
        });
    }, [appDispatch, dispatch, setIsLoading]);

    const mainWorker: Worker = useMemo(() => new Worker(new URL('./../AI/worker.ts', import.meta.url)), []);

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
                    response.gridPredections && dispatch(setGridPredections(response.gridPredections));
                }

                if (e.data.type === CommandType.Predict) {
                    const response = e.data as TrainingWorkerResponse;
                    dispatch(setPredictingState(false));
                    response.gridPredections && dispatch(setGridPredections(response.gridPredections));
                    dispatch(log(`Finished predecting: testing accuracy = ${response.testingAccuracy.toFixed(4)}, test loss = ${response.testingLoss.toFixed(4)}`));
                }
            };
        }
    }, [dispatch, mainWorker]);

    useEffect(() => {
        if (mainWorker && (isTraining || isPredecting)) {
            const selectedData = getSelectedData(data);
            mainWorker.postMessage({
                type: isTraining ? CommandType.Train : CommandType.Predict,
                data: selectedData,
                model: {
                    architecture,
                    weights: isTraining ? {} : data.weights,
                    thresholds: isTraining ? {} : data.thresholds,
                    parameters,
                },
                gridData: selectedData && (isTraining || (isPredecting && !data.gridPredections.length)) && generateGridPoints(selectedData!),
            } as WorkerCommand);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainWorker, isTraining, isPredecting, architecture, parameters]);

    return (
        <Stack horizontal>
            <div>
                <TrainingSettingsComponent />
                <NeuralNetworkBuilder />
                <LogsComponent />
            </div>
            <ChartComponent />
        </Stack>
    );
};

export default AppContainer;
