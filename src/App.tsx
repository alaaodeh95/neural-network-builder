import { useState } from 'react';
import './styles/styles.css';
import LoadingScreen from './components/LoadingScreen';
import { NeuralNetworkBuilder } from './components/NeuralNetworkBuilder';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    window.onload = () => setIsLoading(false);

    return (
        <div>
            {isLoading && <LoadingScreen />}
            <NeuralNetworkBuilder />
        </div>
    );
}

export default App;
