import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/footer.module.scss";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            Copyright (C) 2024 Shuru
            <br />
            <div className={styles.icons}>
                <a href="https://twitter.com/messages/compose?recipient_id=1175998448841056256">
                    <FontAwesomeIcon icon={faTwitter}></FontAwesomeIcon>
                </a>
            </div>
        </footer>
    );
}
