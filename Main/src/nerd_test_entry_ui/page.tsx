import TopNavbar from "../top_navbar/top_navbar";
import NerdTestLogin from "./nerd_test_login";
import Statistics, { Gender } from "./statistics";
import styles from "../../styles/quiz/entry/container.scss";
import { useState } from "react";

type EntryPageProp = {
    title: string;
    onEnterButtonClick: (
        nickname: string,
        age?: string,
        gender?: string,
    ) => void;
};

export default function NerdTestEntryPageView({
    title,
    onEnterButtonClick,
}: EntryPageProp) {
    const [nickname, setNickname] = useState<string>("");
    const [placeholder, setPlaceholder] = useState<string>("");
    const [invalidNickname, setInvalidNickname] = useState<boolean>(false);
    const [gender, setGender] = useState<Gender | null>(null);
    const [age, setAge] = useState<string | null>(null);
    const [specifiedGender, setSpecifiedGender] = useState<string>("");
    const [shaking, setShaking] = useState<boolean>(false);

    const callEnterButtonClickHandler = () => {
        if (invalidNickname) {
            if (shaking) setShaking(false);
            setShaking(true);
            setTimeout(() => {
                setShaking(false);
            }, 1000);
        } else
            onEnterButtonClick(
                nickname == "" ? placeholder : nickname,
                age ?? undefined,
                gender === "other" ? specifiedGender : gender ?? undefined,
            );
    };

    return (
        <div>
            <TopNavbar type="quiz" testTitle={title}></TopNavbar>
            <article className={styles.quizEntry}>
                <NerdTestLogin
                    title={title}
                    onInput={(newNickname, newPlaceholder, invalid) => {
                        setNickname(newNickname);
                        setPlaceholder(newPlaceholder);
                        setInvalidNickname(invalid);
                    }}
                    value={nickname}
                    onFormSubmit={callEnterButtonClickHandler}
                ></NerdTestLogin>
                <Statistics
                    age={age}
                    gender={gender}
                    specifiedGender={specifiedGender}
                    onInput={(newAge, newGender, newSpecifiedGender) => {
                        setAge(newAge);
                        setGender(newGender);
                        setSpecifiedGender(newSpecifiedGender);
                    }}
                ></Statistics>
                <form className={styles.startButton}>
                    <button
                        type="submit"
                        className={
                            invalidNickname ? styles.disabled : undefined
                        }
                        onClick={() => callEnterButtonClickHandler()}
                    >
                        시작하기
                    </button>
                </form>
            </article>
        </div>
    );
}
