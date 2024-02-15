import { QuizProblem } from "../types";
import styles from "../../../styles/quiz/help-me.module.scss";

type AnswerFillinForShare = { question: QuizProblem };

/**
 * 공유용 이미지에서의 이용을 위해 문제 선택지 및 빈 칸을 표시하는 컴포넌트입니다.
 * @param question 퀴즈 문제 데이터
 */
export default function AnswerFillinForShare({
    question,
}: AnswerFillinForShare) {
    let child =
        question.choices === null ? (
            <div className={styles.fillIn}></div>
        ) : (
            <ol className={styles.choices}>
                {question.choices.map((i) => (
                    <li>{i.label}</li>
                ))}
            </ol>
        );

    return <div className={styles.answerContainer}>{child}</div>;
}
