import { dom, icon, library } from "@fortawesome/fontawesome-svg-core";
import {
    faCheck,
    faExclamationCircle,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { isMobile } from "./is_mobile";
import correctMark from "../assets/correct_or_wrong/correct.svg";
import wrongMark from "../assets/correct_or_wrong/wrong.svg";
import { SetCustomGoBackHandler } from "./top_logo_navbar";
import comboStyles from "../styles/quiz/combo-svg.module.scss";
import addPadding from "./canvas_padding";
import html2canvas from "html2canvas";
import whitePaper from "../assets/paper.png";

// FontAwesome 렌더링
library.add(faXmark);
library.add(faCheck);
dom.i2svg({ node: document.querySelector(".correctness-effect")! });

/** 퀴즈 문제 데이터 */
export type QuizProblem = {
    /** 질문 텍스트 */
    question: string;
    /** 점수 */
    points: number;
    /** 이미지 혹은 초성 */
    figure: string;
    /** 이미지인지? 초성인지? */
    figureType: "image" | "initials" | "empty";
    /** 선택지 (null이면 주관식) */
    choices: null | { label: string; value: string }[];
    /** 퀴즈 id */
    id: number;
    /** 중분류 */
    secondCategoryName: string;
    /** 제약조건 */
    condition: string | null;
};

let answerSubmitListeners: ((answer: string, subjective: boolean) => void)[] =
    [];

export function addAnswerSubmitListener(
    listener: (answer: string, subjective: boolean) => void,
) {
    answerSubmitListeners.push(listener);
}

/**
 * 선택지를 표시하는 HTML 요소를 만듭니다.
 * @param question 퀴즈 문제 데이터
 */
const createAnswerElementForShare = (question: QuizProblem) => {
    let answer: HTMLElement;
    if (question.choices === null) {
        answer = document.createElement("div");
        answer.className = "fill-in";
    } else {
        answer = document.createElement("ol");
        answer.className = "choices";
        question.choices
            .map((i) => {
                const li = document.createElement("li");
                li.textContent = i.label;
                return li;
            })
            .forEach((i) => answer.appendChild(i));
    }

    let container = document.createElement("div");
    container.className = "answer-container";
    container.appendChild(answer);

    return container;
};

/**
 * "친구들아, 도와줘!"를 활성화하거나 비활성화합니다.
 * @param toggle 활성화 여부
 */
const toggleHelpMe = (toggle: boolean) => {
    const helpMe = document.querySelector(".help-me")!;
    const activeNow = helpMe.classList.contains("active");
    toggle = toggle ?? !activeNow;
    if (toggle) {
        document.querySelector("article")!.classList.add("display-none");
        helpMe.classList.add("active");
        helpMeFriendEnabledHandler();
        SetCustomGoBackHandler(() => {
            toggleHelpMe(false);
        });
    } else {
        document.querySelector("article")!.classList.remove("display-none");
        helpMe.classList.remove("active");
        helpMeFriendDisabledHandler();
        SetCustomGoBackHandler(null);
    }
};

const createAnswerValidator = (
    warningElement: HTMLElement,
    validateSpecialChars = true,
) => {
    const iconHtml = icon(faExclamationCircle).html[0];
    return (answer: string) => {
        if (validateSpecialChars && /[^a-zA-Zㄱ-힣0-9\s]/.test(answer)) {
            warningElement.innerHTML =
                iconHtml + " 특수문자는 입력할 수 없습니다!";
        } else if (answer.length === 0) {
            warningElement.innerHTML = iconHtml + " 정답이 비어있습니다!";
        } else {
            warningElement.innerHTML = "";
        }
    };
};

/**
 * 정답을 입력하거나 선택하는 HTML 요소를 만듭니다.
 * @param question 퀴즈 문제 데이터
 */
const createAnswerElement = (question: QuizProblem) => {
    const answerEl = document.createElement("form");
    answerEl.className = "answer";
    answerEl.innerHTML = `
        <div class="row with-input">
        </div>
        <div class="row warning">
        </div>
        <div class="row">
            <button class="idk" type="button">도와줘!</button>
            <button class="submit" type="submit">제출</button>
        </div>
        <div id="idkCount" class="row" style="font-family: LeeSeoyun;">
            도와줘 기회 3번 남았습니다.
        </div>`;
    const warningEl = answerEl.querySelector(".row.warning") as HTMLElement;
    const validateAnswer = createAnswerValidator(
        warningEl,
        question.choices === null,
    );

    answerEl.addEventListener('load', () => {
        const idkRemains = parseInt(localStorage.getItem('idkRemains')!);
        document.getElementById('idkCount')!.innerText = `도와줘 기회 ${idkRemains}번 남았습니다.`;
    });

    const rowWithInput = answerEl.querySelector(".row.with-input")!;
    if (question.choices === null) {
        rowWithInput.innerHTML = `
        <div class="input-wrapper with-animation">
            <input autofocus type="input" placeholder="답을 입력하세요">
        </div>`;
        const inputWrapper = rowWithInput.querySelector(".input-wrapper");
        inputWrapper?.addEventListener("click", (evt) => {
            evt.preventDefault();
            rowWithInput.querySelector("input")?.focus();
            //소프트 키보드 펼쳐져도 최하단으로 스크롤
            document.documentElement.scrollTop = document.documentElement.scrollHeight;
        });
        const input = rowWithInput.querySelector("input")!;
        input.addEventListener("input", (evt) => {
            validateAnswer((evt.target as HTMLInputElement).value);
            if(!isMobile){
                inputWrapper?.classList.remove("animated");
                inputWrapper?.classList.add("animated");
                setTimeout(() => {
                    inputWrapper?.classList.remove("animated");
                }, 100);
            } else {
                inputWrapper?.classList.remove("mobile-animated");
                inputWrapper?.classList.add("mobile-animated");
                setTimeout(() => {
                    inputWrapper?.classList.remove("mobile-animated");
                }, 100);
            }
        });
    } else {
        rowWithInput.classList.add("radios");
        for (const choice of question.choices) {
            const label = document.createElement("label");
            label.textContent = choice.label;
            label.innerHTML =
                `<input type="radio" name="answer">` + label.innerHTML;
            label.querySelector("input")!.value = choice.value;
            rowWithInput.appendChild(label);
        }
    }

    answerEl.querySelector("button.idk")!.addEventListener("click", async (evt) => {
        evt.preventDefault();

        if (parseInt(localStorage.getItem('idkRemains')!) <= 0) {
            alert('도와줘 기회가 더 이상 남아있지 않습니다.');

            return;
        }

        const idkRemains = parseInt(localStorage.getItem('idkRemains')!);

        localStorage.setItem('idkRemains', (idkRemains - 1).toString());

        document.getElementById('idkCount')!.innerText = `도와줘 기회 ${idkRemains - 1}번 남았습니다.`;

        toggleHelpMe(true);

        const webShareButton = document.querySelector('button.share-web-share') as HTMLButtonElement;

        webShareButton.disabled = true;

        const canvas = await html2canvas(
            document.querySelector(".help-me .problem-box")!,
            {
                scale: 2,
                backgroundColor: "transparent",
                useCORS: true,
                onclone(document) {
                    document.querySelector<HTMLElement>(".help-me .problem-paper-box")?.classList.add("html2canvas");
                },
            },
        );
        const blob = await addPadding(canvas, whitePaper);
        const file = new File([blob], "problem.png", {
            type: 'image/png',
        });
        (window as any).setShareData({
            webShare: {
                url: `https://goinmultest.pro/quiz/solve.html?id=${new URLSearchParams(window.location.search).get('id')}`,
                text: `모르겠어요... 도와주세요 🚨\n\nhttps://goinmultest.pro/quiz/solve.html?id=${new URLSearchParams(window.location.search).get('id')}`,
                files: [file],
            },
            imageBlob: blob,
        });

        webShareButton.disabled = false;
    });

    answerEl.addEventListener("submit", (evt) => {
        evt.preventDefault();
        let answer = "";
        if (question.choices === null) {
            answer = (
                answerEl.querySelector(
                    'input[type="input"]',
                ) as HTMLInputElement
            ).value;
        } else {
            answer =
                (
                    [
                        ...document.querySelectorAll('input[type="radio"]'),
                    ] as HTMLInputElement[]
                )
                    .filter((i) => i.checked)
                    .map((i) => i.value)[0] ?? "";
        }

        validateAnswer(answer);
        if (warningEl.textContent === "")
            answerSubmitListeners.forEach((i) =>
                i(answer, question.choices === null),
            );
    });

    return answerEl;
};

function getBBoxOf(svg: SVGSVGElement) {
    document.body.appendChild(svg);
    const reuslt = svg.getBBox();
    document.body.removeChild(svg);

    return reuslt;
}

/**
 * 문제를 나타내는 요소를 생성합니다.
 * @param question 퀴즈 문제 데이터
 * @param index 문제 번호
 */
const createQuestionElement = (
    question: QuizProblem,
    index: number,
    options: Partial<{ currentScore: number; combo: number }> = {},
) => {
    const comboColorClass =
        (options.combo ?? 0) < 20
            ? comboStyles.to19
            : (options.combo ?? 0) < 50
            ? comboStyles.to49
            : (options.combo ?? 0) < 200
            ? comboStyles.to199
            : comboStyles.from200;

    const questionEl = document.createElement("div");
    questionEl.className = "question";
    questionEl.innerHTML = `
        ${
            typeof options.currentScore !== "undefined"
                ? `<div class="current-score">
                    ${options.currentScore}점
        </div>`
                : ""
        }
        <div class="problem-paper-box">
        <div class="correctness-effect"><img></img></div>
        <div class="category"></div>
        <div class="text">
            <span class="id-number">${index}.</span>
            <span class="problem-text"></span>
            <div class="points"></div><br>
            <span class="condition"></span>
        </div>
        <div class="figure">
        </div>
        <div class="combo">
            <svg class="${
                comboStyles.combo
            }" version="1.1" xmlns="//www.w3.org/2000/svg" xmlns:xlink="//www.w3.org/1999/xlink" width="10" height="10">
                <text class="${comboStyles.green}" x="100" y="100">COMBO</text>
                <text class="${
                    comboStyles.count
                } ${comboColorClass}" x="200" y="140">x${
                    options.combo ?? 0
                }</text>
            </svg>
        </div>
        </div>`;

    const comboSvg = questionEl.querySelector(".combo svg") as SVGSVGElement;
    const svgBbox = getBBoxOf(comboSvg.cloneNode(true) as SVGSVGElement);
    const padding = 5;
    comboSvg.setAttribute("width", (svgBbox.width + padding * 2).toString());
    comboSvg.setAttribute("height", (svgBbox.height + padding * 2).toString());
    comboSvg.setAttribute(
        "viewBox",
        `${svgBbox.x - padding} ${svgBbox.y - padding} ${
            svgBbox.width + padding * 2
        } ${svgBbox.height + padding * 2}`,
    );

    questionEl.querySelector(".category")!.textContent =
        question.secondCategoryName === ""
            ? ""
            : "<" + question.secondCategoryName + " 모의고사>";
    questionEl.querySelector(".condition")!.textContent =
        question.condition === null ? "" : `(${question.condition})`;
    questionEl.querySelector(".text .problem-text")!.textContent =
        question.question;
    questionEl.querySelector(".text .condition")!.textContent =
        question.condition === null ? "" : `(${question.condition})`;
    questionEl.querySelector(".points")!.textContent = `[${question.points}점]`;

    switch (question.figureType) {
        case "empty":
            questionEl.querySelector(".figure")!.classList.add("empty");
            break;
        case "image":
            const img = document.createElement("img");
            img.crossOrigin = "anonymous";
            img.addEventListener("load", () => {
                if (img.naturalHeight > img.naturalWidth) {
                    img.classList.add("min-height");
                } else {
                    img.classList.add("min-width");
                }
            });

            img.src = question.figure;
            questionEl.querySelector(".figure")!.append(img);
            break;
        case "initials":
            const initials = document.createElement("div");
            initials.className = "initials";

            [
                ...question.figure.split("").map((i) => {
                    const type =
                        i === "$" ||
                        "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"
                            .split("")
                            .includes(i)
                            ? "initial"
                            : i === " "
                            ? "whitespace"
                            : "normal";

                    if (type === "initial") {
                        const initial = document.createElement("div");
                        initial.textContent = i == "$" ? "　" : i;
                        initial.className =
                            i === "$" ||
                            "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"
                                .split("")
                                .includes(i)
                                ? "initial"
                                : i === " "
                                ? "whitespace"
                                : "normal";
                        return initial;
                    } else {
                        return i;
                    }
                }),
            ]
                .reduce((pv, cv) => {
                    if (typeof cv === "string") {
                        if (
                            pv.length === 0 ||
                            !pv[pv.length - 1].classList.contains("normal")
                        ) {
                            pv.push(document.createElement("div"));
                            pv[pv.length - 1].className = cv === ' ' ? 'whitespace' : "normal";
                        }

                        pv[pv.length - 1].textContent += cv;
                    } else {
                        if (
                            pv.length === 0 ||
                            !pv[pv.length - 1].classList.contains(
                                "initial-group",
                            )
                        ) {
                            pv.push(document.createElement("div"));
                            pv[pv.length - 1].className = "initial-group";
                        }
                        pv[pv.length - 1].appendChild(cv);
                    }

                    return pv;
                }, [] as HTMLElement[])
                .forEach((i) => initials.appendChild(i));

            questionEl.querySelector(".figure")!.appendChild(initials);
    }

    return questionEl;
};

/**
 * 문제를 표시합니다.
 * @param root 문제가 표시될 요소 (초기화되므로 주의!)
 * @param index 문제 번호
 */
export function displayProblem(
    root: HTMLElement,
    question: QuizProblem,
    index: number,
    options: Partial<{ currentScore: number; combo: number }> = {},
) {
    root.innerHTML = ``;

    root.appendChild(createQuestionElement(question, index, options));
    root.appendChild(createAnswerElement(question));
    if (!isMobile)
        (root.querySelector(".answer input") as HTMLInputElement).focus();

    window.scrollTo({
        top: 0,
        behavior: "instant",
    });
}

/**
 * 문제를 SNS 공유에 알맞게 표시합니다.
 * @param root 문제가 표시될 요소 (초기화되므로 주의!)
 * @param index 문제 번호
 * @param question
 */
export function updateShareProblem(
    root: HTMLElement,
    question: QuizProblem,
    index: number,
) {
    root.innerHTML = "";
    const questionEl = createQuestionElement(question, index);
    questionEl
        ?.querySelector(".problem-paper-box")
        ?.appendChild(createAnswerElementForShare(question));
    const paperBox = questionEl?.querySelector(".problem-paper-box");
    const h1 = document.createElement("h1");
    h1.textContent = "친구들아, 도와줘!";
    h1.style.color = '#14171a';
    paperBox?.insertBefore(h1, paperBox.firstChild);
    root.appendChild(questionEl);
}

/**
 * 상단 진행바를 업데이트합니다.
 * @param percentage 0이상 100이하의 진행률
 */
export function updateProgress(
    percentage: number,
    text?: string,
    color?: "red" | "yellow" | undefined,
) {
    const progress = document.querySelector(
        ".progress-container .progress",
    ) as HTMLElement;
    progress.style.width = `${percentage}%`;
    [
        document.querySelector(".progress-container"),
        document.querySelector(".top-fixed-bar .progress-text"),
    ].forEach((i) => {
        switch (color) {
            case "red":
                i?.classList.add("red");
                i?.classList.remove("yellow");
                break;
            case "yellow":
                i?.classList.add("yellow");
                i?.classList.remove("red");
                break;
            default:
                i?.classList.remove("yellow");
                i?.classList.remove("red");
        }
    });

    const textElement = document.querySelector(".top-fixed-bar .progress-text");
    if (textElement && text) textElement.textContent = text;
}

let helpMeFriendEnabledHandler: () => void = () => {},
    helpMeFriendDisabledHandler: () => void = () => {
        return;
    };
export function initQuizSolveUI() {
    // 이어서 풀기 버튼 이벤트 핸들러 추가
    document
        .querySelector("button.continue")!
        .addEventListener("click", (evt) => {
            evt.preventDefault();
            toggleHelpMe(false);
        });
}

export function setHelpMeFriendsEventHandler(
    options: {
        onEnabled?: () => void;
        onDisabled?: () => void;
        beforeDisable?: () => boolean;
    } = {},
) {
    if (options.onDisabled) helpMeFriendDisabledHandler = options.onDisabled;
    if (options.onEnabled) helpMeFriendEnabledHandler = options.onEnabled;
}

/**
 * 틀림/맞음 애니메이션과 콤보를 표시합니다.
 * @param correct 정답 여부
 */
export function displayCorrectnessAndComboAnimation(
    correct: boolean,
    displayCombo?: boolean,
) {
    return new Promise<void>((resolve, _reject) => {
        const paperBox = document.querySelector(".problem-paper-box");
        const effectImg = paperBox?.querySelector(
            ".correctness-effect img",
        ) as HTMLImageElement | null;
        if (paperBox === null || effectImg === null) return;

        effectImg.src = correct ? correctMark : wrongMark;
        paperBox.classList.add("with-correctness-effect");
        if (displayCombo ?? true) paperBox.classList.add("with-combo");
        setTimeout(() => {
            paperBox.classList.remove("with-correctness-effect");
            paperBox.classList.remove("with-combo");
            resolve();
        }, 600);
    });
}
