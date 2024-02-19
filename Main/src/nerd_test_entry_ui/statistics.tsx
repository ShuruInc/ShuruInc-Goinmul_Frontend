import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/quiz/entry/statistics.module.scss";

type AgeInputProp = {
    onInput: (value: string) => void;
    value: string | null;
};

export type Gender = "M" | "F" | "other";

type GenderInputProp = {
    onInput: (value: Gender, specifiedGender: string) => void;
    specifiedGender: string;
    value: Gender | null;
};

function AgeInput({ onInput, value }: AgeInputProp) {
    const values = ["10대", "20대", "30대", "40대 이상", ["", "응답하지 않음"]];
    return (
        <select
            className={styles.age}
            value={value ?? undefined}
            onInput={(evt) => onInput((evt.target as HTMLInputElement).value)}
        >
            {values.map((i) => (
                <option value={typeof i === "string" ? i : i[0]}>
                    {typeof i === "string" ? i : i[1]}
                </option>
            ))}
        </select>
    );
}

function GenderInput({ onInput, value, specifiedGender }: GenderInputProp) {
    return (
        <div className={styles.genderRadios}>
            <label>
                <input
                    type="radio"
                    name="gender"
                    value="F"
                    id="female"
                    checked={value === "F"}
                    onClick={(_) => onInput("F", specifiedGender)}
                />
                <label htmlFor="female">
                    <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                </label>
                &nbsp; 여성
            </label>
            <label>
                <input
                    type="radio"
                    name="gender"
                    value="M"
                    id="male"
                    checked={value === "M"}
                    onClick={(_) => onInput("M", specifiedGender)}
                />
                <label htmlFor="male">
                    <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                </label>
                &nbsp; 남성
            </label>
            <label>
                <input
                    type="radio"
                    name="gender"
                    value="other"
                    id="specified"
                    checked={value === "other"}
                    onClick={(_) => onInput("other", specifiedGender)}
                />
                <label htmlFor="specified">
                    <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                </label>
                &nbsp; 기타&nbsp;
                <input
                    type="input"
                    className={styles.specifiedGender}
                    placeholder="입력해 주세요."
                    value={specifiedGender}
                    onInput={(evt) =>
                        onInput("other", (evt.target as HTMLInputElement).value)
                    }
                />
            </label>
        </div>
    );
}

type StatisticsProp = {
    age: string | null;
    gender: Gender | null;
    specifiedGender: string;
    onInput: (
        age: string | null,
        gender: Gender | null,
        specifiedGender: string,
    ) => void;
};

export default function Statistics({
    age,
    gender,
    specifiedGender,
    onInput,
}: StatisticsProp) {
    return (
        <div className={styles.statisticsSection}>
            <div className={styles.statisticsHeader}>
                <h2>(선택)설문조사</h2>
                <p>서비스 이용자 파악을 위한 설문조사입니다.</p>
            </div>
            <form className={styles.statistics}>
                <label>연령대</label>
                <AgeInput
                    value={age}
                    onInput={(newAge) =>
                        onInput(newAge, gender, specifiedGender)
                    }
                ></AgeInput>
                <label>성별</label>
                <GenderInput
                    value={gender}
                    specifiedGender={specifiedGender}
                    onInput={(newGender, newSpecifiedGender) =>
                        onInput(age, newGender, newSpecifiedGender)
                    }
                ></GenderInput>
            </form>
        </div>
    );
}
