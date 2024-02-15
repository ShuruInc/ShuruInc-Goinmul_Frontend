import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { ReactNode, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuizProblem } from "../types";
import styles from "../../../styles/quiz/answer-input.module.scss";
import classNames from "classnames";

type AnswerInputProp = {
    /**
     * 문제 데이터
     */
    question: QuizProblem;
    /**
     * 입력 비활성화 여부
     */
    disabled?: boolean;
    /**
     * 이용자가 정답을 입력하고 제출하려 할 때 호출되는 이벤트 핸들러입니다.
     * @param value 정답값
     * @returns
     */
    onSubmit: (value: string) => void;
};

/**
 * 사용자로부터 문제 정답 입력을 받는 컴포넌트입니다.
 */
export default function AnswerInput({
    question,
    disabled,
    onSubmit,
}: AnswerInputProp) {
    const [animated, setAnimated] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const errorMessage = useMemo<string | null>(() => {
        if (
            question.choices === null && // 객관식인 경우에는 특수문자를 검사하지 않는다.
            /[^a-zA-Zㄱ-힣0-9\s]/.test(inputValue)
        ) {
            return " 특수문자는 입력할 수 없습니다!";
        } else if (inputValue.length === 0) {
            return " 정답이 비어있습니다!";
        } else {
            return null;
        }
    }, [inputValue, question.choices === null]);

    let input: ReactNode;
    if (question.choices === null) {
        input = (
            <input
                autoFocus
                className={classNames(
                    styles.withAnimation,
                    animated && styles.animated,
                )}
                type="input"
                placeholder="답을 입력하세요"
                disabled={disabled}
                onInput={(evt) => {
                    setInputValue((evt.target as HTMLInputElement).value);

                    if (animated) setAnimated(false);
                    setAnimated(true);
                    setTimeout(() => {
                        setAnimated(false);
                    }, 100);
                }}
            ></input>
        );
    } else {
        input = question.choices.map((i) => (
            <input
                type="radio"
                name="answer"
                value={i.value}
                disabled={disabled}
                checked={inputValue === i.value}
                onClick={() => setInputValue(i.value)}
            >
                {i.label}
            </input>
        ));
    }

    return (
        <form
            className={styles.answer}
            onSubmit={(evt) => {
                evt.preventDefault();
                onSubmit(inputValue);
            }}
        >
            <div
                className={classNames(
                    styles.row,
                    styles.withInput,
                    question.choices !== null && styles.radios,
                )}
            >
                {input}
            </div>
            <div className={classNames(styles.row, styles.warning)}>
                {errorMessage && (
                    <>
                        <FontAwesomeIcon
                            icon={faExclamationCircle}
                        ></FontAwesomeIcon>
                        &nbsp;
                        {errorMessage}
                    </>
                )}
            </div>
            <div className={styles.row}>
                <button type="submit">제출</button>
            </div>
        </form>
    );
}
