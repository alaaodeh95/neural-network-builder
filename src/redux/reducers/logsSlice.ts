// store/textSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LogsState {
    logs: string[];
}

const initialState: LogsState = {
    logs: [],
};

export const logsSlice = createSlice({
    name: 'logs',
    initialState,
    reducers: {
        log: (state, action: PayloadAction<string>) => {
            state.logs.push(action.payload);
        },
        clearLogs: (state) => {
            state.logs = [];
        }
    },
});

export const { log, clearLogs } = logsSlice.actions;
export const logsReducer = logsSlice.reducer;