import { QuizProblem } from "../../quiz-solve-ui";
import RandomImageUrl from "./randomImageUrl";

const chosung = (str: string) => {
    // https://zetawiki.com/w/index.php?oldid=746550
    const cho = [
        "ㄱ",
        "ㄲ",
        "ㄴ",
        "ㄷ",
        "ㄸ",
        "ㄹ",
        "ㅁ",
        "ㅂ",
        "ㅃ",
        "ㅅ",
        "ㅆ",
        "ㅇ",
        "ㅈ",
        "ㅉ",
        "ㅊ",
        "ㅋ",
        "ㅌ",
        "ㅍ",
        "ㅎ",
    ];
    let result = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] === " ") {
            result += " ";
            continue;
        }
        const code = str.charCodeAt(i) - 44032;
        if (code > -1 && code < 11172) result += cho[Math.floor(code / 588)];
    }
    return result;
};

const randomHangul = (length: number, whitespace = false) => {
    let result = "";
    for (let i = 0; i < length; i++) {
        if (Math.random() < 0.3 && whitespace && i != 0 && i != length - 1)
            result += " ";
        else
            result += String.fromCharCode(
                "가".charCodeAt(0) +
                    ("힣".charCodeAt(0) - "가".charCodeAt(0)) * Math.random()
            );
    }

    return result;
};

type DummyQuizProblem = QuizProblem & { answer: string };
const generateRandomProblem = (): DummyQuizProblem => {
    let type = Math.floor(Math.random() * 3);
    let answers = [
        randomHangul(4 + Math.floor(Math.random() * 6), true),
        randomHangul(4 + Math.floor(Math.random() * 6), true),
        randomHangul(4 + Math.floor(Math.random() * 6), true),
        randomHangul(4 + Math.floor(Math.random() * 6), true),
    ];
    let answerIdx = Math.floor(Math.random() * 4);

    switch (type) {
        case 0:
            // 주관식~
            return {
                choices: null,
                figure: answers[0]
                    .split("")
                    .map((i) => chosung(i))
                    .join(""),
                answer: answers[0],
                figureType: "initials",
                points: 10,
                question: `주관식-초성제시 예시 문제입니다. 이 문제의 정답은 "${answers[0]}"입니다.`,
            };
        case 1:
            return {
                choices: null,
                figure: RandomImageUrl(256, 256),
                answer: answers[0],
                figureType: "image",
                points: 10,
                question: `주관식-이미지제시 예시 문제입니다. 이 문제의 정답은 "${answers[0]}"입니다.`,
            };
        case 2:
        default:
            return {
                choices: answers,
                figure: RandomImageUrl(256, 256),
                answer: answers[answerIdx],
                figureType: "image",
                points: 10,
                question: `객관식-이미지제시 예시 문제입니다. 이 문제의 정답은 "${answers[answerIdx]}"입니다.`,
            };
    }
};

export function initDummyProblemData(id: string) {
    const localStorageKey = "problems-" + id;
    if (localStorage.getItem(localStorageKey) !== null) return;

    let problems = [];
    if (id.includes("nerd"))
        for (let i = 0; i < 200; i++) problems.push(generateRandomProblem());
    else for (let i = 0; i < 10; i++) problems.push(generateRandomProblem());

    localStorage.setItem(localStorageKey, JSON.stringify(problems));
}

export function getDummyProblemData(id: string): DummyQuizProblem[] {
    initDummyProblemData(id);
    return JSON.parse(localStorage.getItem("problems-" + id) ?? "[]");
}
