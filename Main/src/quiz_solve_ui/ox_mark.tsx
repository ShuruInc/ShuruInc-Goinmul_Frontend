import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import styles from "../../styles/quiz/correctness-animation.module.scss";

type OxMarkProp = {
    type: "ok" | "fail";
};

export default function OxMark({ type }: OxMarkProp) {
    return (
        <div className={classNames(styles.oxMark, styles[type])}>
            <div className={styles.ok}>
                <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
            </div>
            <div className={styles.fail}>
                <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
            </div>
        </div>
    );
}
