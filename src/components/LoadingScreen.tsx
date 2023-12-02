import styles from '../styles/Loading.module.css'; // Import the CSS file for styling

const LoadingScreen = () => {
  return (
    <div className={styles.loadingScreen}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingScreen;
