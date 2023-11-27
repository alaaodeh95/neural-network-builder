import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import styles from '../styles/Logs.module.css';
import { useEffect, useRef } from 'react';
import { clearLogs } from '../redux/reducers/logsSlice';

const TextLogger = () => {
    const dispatch = useDispatch();
    const lines = useSelector((state: RootState) => state.logs.logs);

    const loggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (loggerRef.current) {
            loggerRef.current.scrollTop = loggerRef.current.scrollHeight; // Scroll to the bottom
        }
    }, [lines]);

    const handleClear = () => {
        dispatch(clearLogs());
    };

    return (
        <>
            <div className={styles.textLogger} ref={loggerRef}>
                {lines.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
                {!!lines.length && (
                    <button className={styles.clearButton} onClick={handleClear}>
                        Clear
                    </button>
                )}
            </div>
        </>
    );
};

export default TextLogger;
