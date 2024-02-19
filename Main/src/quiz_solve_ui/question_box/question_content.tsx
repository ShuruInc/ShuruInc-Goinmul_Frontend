import { ReactNode, useState } from "react";
import { QuizProblem } from "../types";
import styles from "../../../styles/quiz/question-content.module.scss";

type QuestionContentProp = {
    /**
     * 문제 데이터
     */
    question: QuizProblem;
    /**
     * 문제 번호
     */
    index: number;
    /**
     * 공유용 이미지에 이용되는 지의 여부
     */
    share?: boolean;
    /**
     * "친구야, 도와줘!" 버튼을 클릭했을 때의 이벤트 핸들러
     */
    onIdkButtonClick?: () => void;
};

/**
 * 문제 내용을 나타내는 컴포넌트입니다.
 */
export default function QuestionContent({
    question,
    index,
    share,
    onIdkButtonClick,
}: QuestionContentProp) {
    let [imgClass, setImgClass] = useState<string>("");

    let figure: ReactNode = null;
    switch (question.figureType) {
        case "image":
            figure = (
                <img
                    crossOrigin="anonymous"
                    src={question.figure}
                    className={imgClass}
                    onLoad={(evt) => {
                        const img = evt.target as HTMLImageElement;

                        if (img.naturalHeight > img.naturalWidth) {
                            setImgClass(styles.minHeight);
                        } else {
                            setImgClass(styles.minWidth);
                        }
                    }}
                ></img>
            );
            break;
        case "initials":
            figure = (
                <div className={styles.initials}>
                    {question.figure.split("").map((i) => {
                        return (
                            <div
                                className={
                                    i === "$" ||
                                    "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"
                                        .split("")
                                        .includes(i)
                                        ? styles.initial
                                        : i === " "
                                        ? styles.whitespace
                                        : styles.normal
                                }
                            >
                                {i == "$" ? "　" : i}
                            </div>
                        );
                    })}
                </div>
            );
    }

    return (
        <div className={styles.question}>
            {!share && (
                <div className={styles.idkRow}>
                    <button
                        className={styles.idk}
                        onClick={(evt) => {
                            evt.preventDefault();
                            if (onIdkButtonClick) onIdkButtonClick();
                        }}
                    >
                        친구찬스!
                    </button>
                </div>
            )}
            <div className={styles.category}>
                {question.secondCategoryName} 모의고사
            </div>
            <div className={styles.text}>
                <span className={styles.idNumber}>{index}.</span>
                <span>{question.question}</span>
                <br />
                <span className={styles.condition}>
                    {question.condition ?? ""}
                </span>
            </div>
            <div className={styles.points}>[{question.points}점]</div>
            <div className={styles.figure}>{figure}</div>
        </div>
    );
}
