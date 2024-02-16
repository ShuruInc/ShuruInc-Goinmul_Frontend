import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/quiz/entry/login.scss";
import {
    faArrowsRotate,
    faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import randomKoreanNickname from "../random_korean_nickname";
import hasBadWord from "../bad_words/has_bad_word";
import classNames from "classnames";

type NerdTestLoginProp = {
    title: string;
    onInput: (value: string, placeholder: string, invalid: boolean) => void;
    value: string;
    shake?: boolean;
    onFormSubmit?: () => void;
};

const NICKNAME_MAX_LEN = 6;

/**
 * location.reload()가 안 되는 경우가 있어서 만든
 * 약간 tricky한 새로고침 로직
 */
const trickyReload = () => {
    const params = new URLSearchParams(location.search);
    params.set("dummy", Date.now().toString());
    location.href = location.pathname + "?" + params.toString() + location.hash;
};

export default function NerdTestLogin({
    title,
    onInput,
    value,
    shake,
    onFormSubmit,
}: NerdTestLoginProp) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [placeholder] = useState<string>(() => {
        let defaultNickname = randomKoreanNickname(NICKNAME_MAX_LEN);

        while (hasBadWord(defaultNickname) !== false)
            defaultNickname = randomKoreanNickname();

        return defaultNickname;
    });

    const warningText = useMemo(() => {
        const badWord = hasBadWord(value);
        if (badWord !== false) {
            return "닉네임에 부적절한 단어가 있습니다: " + badWord;
        } else if (value.length > 0 && value.trim().length === 0) {
            return "공백만으로 이루어진 닉네임은 불가능합니다.";
        } else if (value.length > 8) {
            return "닉네임은 최대 8자입니다.";
        } else {
            return null;
        }
    }, [value]);

    return (
        <div className={styles.entrySection}>
            <div className={styles.introduction}>
                <h1>{title}</h1>
                <h2>수험자 정보 입력</h2>
                <p>랭킹 기록을 위해 닉네임을 입력해 주세요.</p>
            </div>
            <div className={styles.entryFormWithWarning}>
                <form className={styles.entry} onSubmit={onFormSubmit}>
                    <input
                        type="input"
                        id="nickname"
                        min={NICKNAME_MAX_LEN}
                        placeholder={placeholder}
                        onInput={(evt) => {
                            onInput(
                                (evt.target as HTMLInputElement).value,
                                placeholder,
                                warningText !== null,
                            );
                        }}
                        value={value}
                        ref={inputRef}
                        required
                    />
                    <a
                        href="#"
                        className={styles.refreshNickname}
                        onClick={(evt) => {
                            evt.preventDefault();
                            // 닉네임 입력칸을 초기화하지 않으면 새로고침해도 그대로 있다.
                            if (inputRef.current) inputRef.current.value = "";

                            trickyReload();
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faArrowsRotate}
                        ></FontAwesomeIcon>
                    </a>
                </form>
                {warningText !== null && (
                    <div
                        className={classNames(
                            styles.warning,
                            shake && styles.shaking,
                        )}
                    >
                        <FontAwesomeIcon
                            icon={faExclamationCircle}
                        ></FontAwesomeIcon>
                        &nbsp;{warningText}
                    </div>
                )}
            </div>
        </div>
    );
}
