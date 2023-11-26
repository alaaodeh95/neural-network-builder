import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore } from './redux/store/store';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import { initialState } from './redux/reducers/trainingSettingsSlice';
import initialNetwork from './redux/reducers/initialNetwork';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={createStore(initialNetwork, initialState)}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
