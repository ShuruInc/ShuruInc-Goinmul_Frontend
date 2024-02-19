import { faChevronUp, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/floating-button.module.scss";

type FloatingButtonIconType = "up" | "home";

type FloatingButtonProp = Partial<{
    type: FloatingButtonIconType;
    onClick: FloatingButtonListener;
}>;

type FloatingButtonListener = () => void;

export default function FloatingButton({ type, onClick }: FloatingButtonProp) {
    return (
        <button className={styles.floatingBtn} onClick={onClick}>
            <FontAwesomeIcon
                icon={type === "up" ? faChevronUp : faHome}
            ></FontAwesomeIcon>
        </button>
    );
}
