import React, { useRef, useState } from 'react';
import { Stack, TextField, Dropdown, Slider, PrimaryButton, IStackStyles, ITextFieldStyles, IDropdownStyles, IDropdownOption, Spinner, SpinnerSize, Separator } from '@fluentui/react';
import { lossFunctionSelectOptions } from '../constants/constants';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store/store';
import {
    setLearningRate,
    setMaxEpochs,
    setLossFunction,
    setStopLossValue,
    setTrainingPercentage,
    setValidationPercentage,
    setTestingPercentage,
    setTrainingState,
    setPredictingState,
    setSettings,
    setIsTrained,
} from '../redux/reducers/trainingSettingsSlice';
import { LossFunction, Model, Record } from '../types/neuralNetworkTypes';
import Papa from 'papaparse';
import { useAppDispatch } from '../redux/store/hooks';
import { buildInputAndOutputNeurons } from '../redux/actions/neurons';
import styles from '../styles/TrainingSettings.module.css';
import { addAndSetTrainingData, setSelectedData, setThresholds, setWeights } from '../redux/reducers/dataSlice';
import { saveModel } from '../redux/actions/model';
import { setNetwork } from '../redux/reducers/neuralNetworkSlice';

const stackStyles: Partial<IStackStyles> = {
    root: {
        width: '100%',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Black background with opacity
    },
};

const innerStackStyles: Partial<IStackStyles> = {
    root: {
        marginTop: 20,
    },
};

const controlStyles: Partial<ITextFieldStyles> = {
    root: { color: 'white', width: 160 },
    fieldGroup: { backgroundColor: 'white' },
    field: { color: 'black' },
    wrapper: { width: 160 },
    subComponentStyles: {
        label: { root: { color: 'white' } },
    },
};

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { backgroundColor: 'white', borderColor: 'black', width: 160 },
    title: { color: 'black' },
    caretDownWrapper: { color: 'black' },
    dropdownOptionText: { color: 'black' },
    label: { color: 'white' },
    root: { width: 160 },
};

const sliderStyles = {
    root: {
        width: 240,
        selectors: {
            // Styles for the active portion of the slider track
            '.ms-Slider-active': {
                backgroundColor: 'white', // or any color that stands out
            },
        },
    },
    titleLabel: { color: 'white' },
    valueLabel: { color: 'white' },
};

const TrainingSettings: React.FC = () => {
    const settings = useSelector((state: RootState) => state.settings);
    const availableData = useSelector((state: RootState) => state.data.availableData);
    const selectedData = useSelector((state: RootState) => state.data.selectedData);
    const [learningRateText, setLearningRateText] = useState(settings.learningRate.toString());
    const [lossValueText, setLossValueText] = useState(settings.stopLossValue.toString());

    const dispatch = useDispatch();
    const appDispatch = useAppDispatch();
    const fileInputLoadDataRef = useRef<HTMLInputElement>(null);
    const fileInputLoadModelRef = useRef<HTMLInputElement>(null);

    const handleLearningRateChange = () => {
        const value = parseFloat(learningRateText);
        value && dispatch(setLearningRate(value));
    };

    const handleMaxEpochsChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        dispatch(setMaxEpochs(newValue ? parseInt(newValue) : 0));
    };

    const handleLossFunctionChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
        if (option) {
            dispatch(setLossFunction(option.key as LossFunction));
        }
    };

    const handleStopLossValueChange = () => {
        const value = parseFloat(lossValueText);
        value && dispatch(setStopLossValue(value));
    };

    const handleTrainingPercentageChange = (value: number) => {
        dispatch(setTrainingPercentage(value));
    };

    const handleValidationPercentageChange = (value: number) => {
        dispatch(setValidationPercentage(value));
    };

    const handleTestingPercentageChange = (value: number) => {
        dispatch(setTestingPercentage(value));
    };

    const handleLoadDataFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            Papa.parse(file, {
                complete: result => {
                    const trainingData = {
                        name: file.name,
                        headers: result.meta.fields!,
                        records: result.data! as Record[],
                    };
                    dispatch(addAndSetTrainingData(trainingData));
                    appDispatch(buildInputAndOutputNeurons());
                },
                header: true,
            });
        }
    };

    const handleLoadModelFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            // Assuming 'file' is your File object
            const fileReader = new FileReader();

            fileReader.onload = function (event) {
                const text = event.target!.result;
                try {
                    const json = JSON.parse(text as string) as Model;
                    dispatch(setWeights(json.weights));
                    dispatch(setThresholds(json.thresholds));
                    dispatch(setNetwork(json.architecture));
                    dispatch(setSettings(json.parameters));
                    dispatch(setIsTrained(true));
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };

            fileReader.onerror = function () {
                console.error('Error reading file');
            };

            fileReader.readAsText(file); // Read the file as plain text
        }
    };

    const handleFileLoadDataButtonClick = () => {
        fileInputLoadDataRef.current?.click();
    };

    const handleFileLoadModelButtonClick = () => {
        fileInputLoadModelRef.current?.click();
    };

    const handleSelectDataChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => {
        if (option) {
            dispatch(setSelectedData(option.key as string));
            appDispatch(buildInputAndOutputNeurons());
        }
    };

    const handleStartTraining = () => {
        dispatch(setTrainingState(true));
    };

    const handleStartPredicting = () => {
        dispatch(setPredictingState(true));
    };

    return (
        <Stack horizontal tokens={{ childrenGap: 35 }} styles={stackStyles}>
            <Stack styles={innerStackStyles} >
                <Dropdown
                    label="Input Data"
                    options={availableData.map(data => ({
                        text: data.name,
                        key: data.name,
                    }))}
                    selectedKey={selectedData}
                    styles={dropdownStyles}
                    onChange={handleSelectDataChange}
                />
                <div>
                    <PrimaryButton
                        onClick={handleFileLoadDataButtonClick}
                        text="Upload CSV"
                        styles={{
                            root: {
                                marginTop: 10,
                                color: 'black',
                                backgroundColor: 'white',
                            },
                        }}
                    />
                    <input
                        ref={fileInputLoadDataRef}
                        type="file"
                        accept="text/csv"
                        onChange={handleLoadDataFileChange}
                        style={{ display: 'none' }} // Hide the native input
                    />
                </div>
            </Stack>
            <Stack styles={innerStackStyles} >
                <TextField label="Learning Rate" styles={controlStyles} value={learningRateText} onChange={(_, v) => setLearningRateText(v ?? '')} onBlur={handleLearningRateChange}/>
                <TextField label="Maximum # of Epochs" styles={controlStyles} type="number" value={settings.maxEpochs.toString()} onChange={handleMaxEpochsChange} />
            </Stack>
            <Stack styles={innerStackStyles} >
                <Dropdown label="Loss Function" options={lossFunctionSelectOptions} styles={dropdownStyles} selectedKey={settings.lossFunction} onChange={handleLossFunctionChange} />
                <TextField label="Stop on Loss Value" styles={controlStyles} value={lossValueText} onChange={(_, v) => setLossValueText(v ?? '')} onBlur={handleStopLossValueChange} />
            </Stack>
            <Stack.Item
                align="end"
                styles={{
                    root: {
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    },
                }}>
                <Slider label="Training Percentage" min={50} max={85} step={5} styles={sliderStyles} value={settings.trainingPercentage} onChange={handleTrainingPercentageChange} />
                <Slider label="Validation Percentage" min={5} max={25} step={5} styles={sliderStyles} value={settings.validationPercentage} onChange={handleValidationPercentageChange} />
                <Slider label="Testing Percentage" min={5} max={25} step={5} styles={sliderStyles} value={settings.testingPercentage} onChange={handleTestingPercentageChange} />
            </Stack.Item>
            <Separator vertical className={styles.customSeparator} />
            <Stack style={{ gap: 10 }}>
                <Stack.Item
                    align="center"
                    styles={{
                        root: {
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'center',
                        },
                    }}>
                    <PrimaryButton
                        disabled={settings.isTraining}
                        styles={{
                            root: {
                                width: '80px',
                                color: 'black',
                                backgroundColor: 'white',
                                borderRadius: 10,
                            },
                        }}
                        onClick={handleStartTraining}>
                        {settings.isTraining ? <Spinner size={SpinnerSize.medium} /> : 'Train'}
                    </PrimaryButton>
                </Stack.Item>
                {
                    <Stack.Item
                        align="center"
                        styles={{
                            root: {
                                flexGrow: 1,
                                display: 'flex',
                                justifyContent: 'center',
                            },
                        }}>
                        <PrimaryButton
                            disabled={settings.isPredecting || !settings.isTrained}
                            styles={{
                                root: {
                                    width: '80px',
                                    color: 'black',
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                },
                            }}
                            onClick={handleStartPredicting}>
                            {settings.isPredecting ? <Spinner size={SpinnerSize.medium} /> : 'Predict'}
                        </PrimaryButton>
                    </Stack.Item>
                }
                <Stack.Item
                    align="center"
                    styles={{
                        root: {
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'center',
                        },
                    }}>
                    <PrimaryButton
                        styles={{
                            root: {
                                width: '80px',
                                color: 'black',
                                backgroundColor: 'white',
                                borderRadius: 10,
                            },
                        }}
                        disabled={!settings.isTrained}
                        onClick={() => appDispatch(saveModel)}>
                        Save
                    </PrimaryButton>
                </Stack.Item>
                {
                    <Stack.Item
                        align="center"
                        styles={{
                            root: {
                                flexGrow: 1,
                                display: 'flex',
                                justifyContent: 'center',
                            },
                        }}>
                        <PrimaryButton
                            styles={{
                                root: {
                                    width: '80px',
                                    color: 'black',
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                },
                            }}
                            onClick={handleFileLoadModelButtonClick}>
                            Load
                            <input
                                ref={fileInputLoadModelRef}
                                type="file"
                                accept="application/json"
                                onChange={handleLoadModelFileChange}
                                style={{ display: 'none' }} // Hide the native input
                            />
                        </PrimaryButton>
                    </Stack.Item>
                }
            </Stack>
        </Stack>
    );
};

export default TrainingSettings;
