/**
 * @typedef {Object} QuizProblem 퀴즈 문제 데이터
 * @property {string} question 질문 텍스트
 * @property {number} points 점수
 * @property {string} figure 이미지 혹은 초성
 * @property {'image' | 'initials'} figureType 이미지인지? 초성인지?
 * @property {null | string[]} choices 선택지 (null이면 주관식)
 */

/**
 * 문제를 표시합니다.
 * @param {HTMLElement} root 문제가 표시될 요소 (초기화되므로 주의!)
 * @param {QuizProblem} question
 */
const displayProblem = (root, question) => {
    root.innerHTML = `
    <div class="question">
        <div class="text">
            <span class="id-number">3.</span>&nbsp;
        </div>
        <div class="points"></div>
        <div class="figure">
        </div>

    </div>
    <form class="answer">
        <div class="row with-input">
        </div>
        <div class="row">
            <button class="idk">모르겠어요</button>
        </div>
    </form>`;

    root.querySelector(".question .text").textContent += question.question;
    root.querySelector(
        ".question .points"
    ).textContent = `[${question.points}점]`;

    switch (question.figureType) {
        case "image":
            const img = document.createElement("img");
            img.src = question.figure;
            root.querySelector(".figure").append(img);
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

            root.querySelector(".figure").appendChild(initials);
    }

    const rowWithInput = root.querySelector(".row.with-input");
    if (question.choices === null) {
        rowWithInput.innerHTML = `<input type="text" placeholder="답을 입력하세요">`;
    } else {
        for (const choice of question.choices) {
            const label = document.createElement("label");
            label.textContent = choice;
            label.innerHTML = `<input type="radio">` + label.innerHTML;
            rowWithInput.appendChild(label);
        }
    }

    rowWithInput.innerHTML += `
    <button class="submit">제출</button>`;
};

const updateProgress = (percentage) => {
    document.querySelector(
        ".progress-container .progress"
    ).style.width = `${percentage}%`;
};

let tmp = 0;
let progress = 30;
setInterval(() => {
    updateProgress(progress);
    switch (tmp) {
        case 0:
            displayProblem(document.querySelector("article"), {
                question: "문제 텍스트입니다",
                figure: "https://picsum.photos/200/200",
                figureType: "image",
                points: 10,
                choices: ["ㅁㄴㅇㄹ1", "ㅁㄴㅇㄹ2", "ㅁㄴㅇㄹ3", "ㅁㄴㅇㄹ4"],
            });
            break;
        case 1:
            displayProblem(document.querySelector("article"), {
                question: "문제 텍스트입니다",
                figure: "ㅉㅉㄴ ㅁㅁㄹ",
                figureType: "initials",
                points: 10,
                choices: null,
            });
            break;
        case 2:
            displayProblem(document.querySelector("article"), {
                question: "문제 텍스트입니다",
                figure: "https://picsum.photos/200/200",
                figureType: "image",
                points: 10,
                choices: null,
            });
    }

    tmp = (tmp + 1) % 3;
    progress = (progress + 5) % 100;
}, 1000);
