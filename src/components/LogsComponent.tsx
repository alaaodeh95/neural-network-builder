import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import styles from '../styles/Logs.module.css';
import { useEffect, useRef } from 'react';

const TextLogger = () => {
    const lines = useSelector((state: RootState) => state.logs.logs);

    const loggerRef = useRef<HTMLDivElement>(null); // Create a ref for the logger div

    useEffect(() => {
        if (loggerRef.current) {
            loggerRef.current.scrollTop = loggerRef.current.scrollHeight; // Scroll to the bottom
        }
    }, [lines]); // Run this effect when 'lines' changes

    return (
        <div className={styles.textLogger} ref={loggerRef}>
            {lines.map((line, index) => (
                <p key={index}>{line}</p>
            ))}
        </div>
    );
};

export default TextLogger;
