import { useState } from 'react';
import './styles/styles.css';
import LoadingScreen from './components/LoadingScreen';
import AppContainer from './components/AppContainer';

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    return (
        <>
            {isLoading && <LoadingScreen />} :
            <div className={isLoading ? 'main-hidden' : ''}>
                <AppContainer setIsLoading={setIsLoading} />
            </div>
        </>
    );
};

export default App;
