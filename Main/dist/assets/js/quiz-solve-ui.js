/**
 * @typedef {Object} QuizProblem 퀴즈 문제 데이터
 * @property {string} question 질문 텍스트
 * @property {number} points 점수
 * @property {string} figure 이미지 혹은 초성
 * @property {'image' | 'initials'} figureType 이미지인지? 초성인지?
 * @property {null | string[]} choices 선택지 (null이면 주관식)
 */

/**
 * 선택지를 표시하는 HTML 요소를 만듭니다.
 * @param {QuizProblem} question 퀴즈 문제 데이터
 * @returns {HTMLElement}
 */
const createAnswerElementForShare = (question) => {
    let answer;
    if (question.choices === null) {
        answer = document.createElement("div");
        answer.className = "fill-in";
    } else {
        answer = document.createElement("ol");
        answer.className = "choices";
        question.choices
            .map((i) => {
                const li = document.createElement("li");
                li.textContent = i;
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
 * @param {boolean} toggle 활성화 여부
 */
const toggleHelpMe = (toggle) => {
    const helpMe = document.querySelector(".help-me");
    const activeNow = helpMe.classList.contains("active");
    toggle = toggle ?? !activeNow;
    if (toggle) {
        document.querySelector("article").classList.add("display-none");
        helpMe.classList.add("active");
    } else {
        document.querySelector("article").classList.remove("display-none");
        helpMe.classList.remove("active");
    }
};

/**
 * 정답을 입력하거나 선택하는 HTML 요소를 만듭니다.
 * @param {QuizProblem} question 퀴즈 문제 데이터
 * @returns {HTMLElement}
 */
const createAnswerElement = (question) => {
    const answerEl = document.createElement("form");
    answerEl.className = "answer";
    answerEl.innerHTML = `
        <div class="row with-input">
        </div>
        <div class="row">
            <button class="idk">모르겠어요</button>
        </div>`;

    const rowWithInput = answerEl.querySelector(".row.with-input");
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

    answerEl.querySelector("button.idk").addEventListener("click", (evt) => {
        evt.preventDefault();
        toggleHelpMe(true);
    });

    return answerEl;
};

/**
 * 문제를 나타내는 요소를 생성합니다.
 * @param {QuizProblem} question 퀴즈 문제 데이터
 * @returns {HTMLElement}
 */
const createQuestionElement = (question) => {
    const questionEl = document.createElement("div");
    questionEl.className = "question";
    questionEl.innerHTML = `
        <div class="text">
            <span class="id-number">3.</span>&nbsp;
        </div>
        <div class="points"></div>
        <div class="figure">
        </div>`;

    questionEl.querySelector(".text").textContent += question.question;
    questionEl.querySelector(".points").textContent = `[${question.points}점]`;

    switch (question.figureType) {
        case "image":
            const img = document.createElement("img");
            img.src = question.figure;
            questionEl.querySelector(".figure").append(img);
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

            questionEl.querySelector(".figure").appendChild(initials);
    }

    return questionEl;
};

/**
 * 문제를 표시합니다.
 * @param {HTMLElement} root 문제가 표시될 요소 (초기화되므로 주의!)
 * @param {QuizProblem} question
 */
const displayProblem = (root, question) => {
    root.innerHTML = ``;

    root.appendChild(createQuestionElement(question));
    root.appendChild(createAnswerElement(question));
};

/**
 * 문제를 SNS 공유에 알맞게 표시합니다.
 * @param {HTMLElement} root 문제가 표시될 요소 (초기화되므로 주의!)
 * @param {QuizProblem} question
 */
const updateShareProblem = (root, question) => {
    root.innerHTML = "";
    root.appendChild(createQuestionElement(question));
    root.appendChild(createAnswerElementForShare(question));
};

/**
 * 상단 진행바를 업데이트합니다.
 * @param {number} percentage 0이상 100이하의 진행률
 */
const updateProgress = (percentage) => {
    document.querySelector(
        ".progress-container .progress"
    ).style.width = `${percentage}%`;
};

// 이어서 풀기 버튼 이벤트 핸들러 추가
document.querySelector("button.continue").addEventListener("click", (evt) => {
    evt.preventDefault();
    toggleHelpMe(false);
});
