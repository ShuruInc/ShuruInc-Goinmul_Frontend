import styles from "../styles/loading-splash.module.scss";

export default function displayLoadingSplash() {
    const loading = document.createElement("div");
    loading.className = styles.loading;
    document.body.appendChild(loading);

    return () => loading.remove();
}
