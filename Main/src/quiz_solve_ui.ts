import { dom, library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

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
    figureType: "image" | "initials";
    /** 선택지 (null이면 주관식) */
    choices: null | { label: string; value: string }[];
    /** 퀴즈 id */
    id: number;
};

let answerSubmitListeners: ((answer: string) => void)[] = [];

export function addAnswerSubmitListener(listener: (answer: string) => void) {
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
 * "친구들야, 도와줘!"를 활성화하거나 비활성화합니다.
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
    } else {
        document.querySelector("article")!.classList.remove("display-none");
        helpMe.classList.remove("active");
        helpMeFriendDisabledHandler();
    }
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
        <div class="row">
            <button class="submit">제출</button>
            <button class="idk">모르겠어요</button>
        </div>`;

    const rowWithInput = answerEl.querySelector(".row.with-input")!;
    if (question.choices === null) {
        rowWithInput.innerHTML = `<input autofocus type="input" placeholder="답을 입력하세요">`;
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

    answerEl.querySelector("button.idk")!.addEventListener("click", (evt) => {
        evt.preventDefault();
        toggleHelpMe(true);
    });
    answerEl
        .querySelector("button.submit")!
        .addEventListener("click", (evt) => {
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

            if (answer !== "") answerSubmitListeners.forEach((i) => i(answer));
        });

    return answerEl;
};

/**
 * 문제를 나타내는 요소를 생성합니다.
 * @param question 퀴즈 문제 데이터
 * @param index 문제 번호
 */
const createQuestionElement = (question: QuizProblem, index: number) => {
    const questionEl = document.createElement("div");
    questionEl.className = "question";
    questionEl.innerHTML = `
        <div class="text">
            <span class="id-number">${index}.</span>&nbsp;
        </div>
        <div class="points"></div>
        <div class="figure">
        </div>`;

    questionEl.querySelector(".text")!.textContent += question.question;
    questionEl.querySelector(".points")!.textContent = `[${question.points}점]`;

    switch (question.figureType) {
        case "image":
            const img = document.createElement("img");
            img.src = question.figure;
            img.crossOrigin = "anonymous";
            questionEl.querySelector(".figure")!.append(img);
            break;
        case "initials":
            const initials = document.createElement("div");
            initials.className = "initials";

            [
                ...question.figure.split("").map((i) => {
                    const initial = document.createElement("div");
                    initial.textContent = i;
                    initial.className =
                        i === " " ? "initial whitespace" : "initial";
                    return initial;
                }),
            ].forEach((i) => initials.appendChild(i));

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
) {
    root.innerHTML = ``;

    root.appendChild(createQuestionElement(question, index));
    root.appendChild(createAnswerElement(question));
    (root.querySelector(".answer input") as HTMLInputElement).focus();
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
    root.appendChild(createQuestionElement(question, index));
    root.appendChild(createAnswerElementForShare(question));
}

/**
 * 상단 진행바를 업데이트합니다.
 * @param percentage 0이상 100이하의 진행률
 */
export function updateProgress(percentage: number, text?: string) {
    (
        document.querySelector(".progress-container .progress") as HTMLElement
    ).style.width = `${percentage}%`;

    const textElement = document.querySelector(
        ".progress-container .progress-text",
    );
    if (textElement && text) textElement.textContent = text;
}

let helpMeFriendEnabledHandler: () => void = () => {
        return;
    },
    helpMeFriendDisabledHandler: () => void = () => {
        return;
    },
    helpMeFriendBeforeDisableHandler: () => boolean = () => {
        return true;
    };
export function initQuizSolveUI() {
    // 이어서 풀기 버튼 이벤트 핸들러 추가
    document
        .querySelector("button.continue")!
        .addEventListener("click", (evt) => {
            evt.preventDefault();
            if (helpMeFriendBeforeDisableHandler()) toggleHelpMe(false);
            else alert("공유를 하셔야 이어서 푸실 수 있습니다!");
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
    if (options.beforeDisable)
        helpMeFriendBeforeDisableHandler = options.beforeDisable;
}

/**
 * 틀림/맞음 애니메이션을 표시합니다.
 * @param correct 정답 여부
 */
export function displayCorrectnessAnimation(correct: boolean) {
    const element = document.querySelector(".correctness-effect");
    if (element === null) return;

    if (correct) {
        element.classList.remove("fail");
        element.classList.add("ok");
    } else {
        element.classList.remove("ok");
        element.classList.add("fail");
    }
    element.classList.remove("display-none");
    setTimeout(() => {
        element.classList.add("display-none");
    }, 400);
}
