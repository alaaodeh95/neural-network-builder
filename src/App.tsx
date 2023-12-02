import { useState } from 'react';
import './styles/styles.css';
import LoadingScreen from './components/LoadingScreen';
import AppContainer from './components/AppContainer';

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    window.onload = () => setIsLoading(false);
    return (
        <>
            {isLoading && <LoadingScreen />} : <AppContainer isLoading={isLoading} />
        </>
    );
};

export default App;
