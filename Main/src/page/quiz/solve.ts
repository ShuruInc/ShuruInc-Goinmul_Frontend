import { dom, icon, library } from "@fortawesome/fontawesome-svg-core";
import "../../../styles/quiz";
import { QuizApiClient } from "../../api/quiz";
import { InitTopNav } from "../../top_logo_navbar";
import {
    faArrowsRotate,
    faCheck,
    faCircleExclamation,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import initSolvePage from "../../solve_page";
import { QuizSession } from "../../api/quiz_session";
import randomKoreanNickname from "../../random_korean_nickname";
import PostBoardApiClient from "../../api/posts";
import hasBadWord from "../../bad_words/has_bad_word";

InitTopNav();

// FontAwesome 아이콘 렌더링
library.add(faSpinner, faArrowsRotate, faCheck);
for (const i of [
    document.querySelector("article.loading")!,
    document.querySelector(".refresh-nickname")!,
    document.querySelector("form.statistics")!,
])
    dom.i2svg({ node: i });

// 문제 입력칸 상단 경고문구
let warningText = "";
const warningIcon = icon(faCircleExclamation).html[0];
function setWarningText(newText: string) {
    warningText = newText;
    const warning = document.querySelector(".entry-section .warning")!;
    warning.textContent = newText;
    if (newText === "") {
        warning.innerHTML = "&nbsp;";
        document
            .querySelector(".start-button button")
            ?.classList.remove("disabled");
    } else {
        warning.innerHTML = warningIcon + " " + warning.innerHTML;
        document
            .querySelector(".start-button button")
            ?.classList.add("disabled");
    }
}

const params = new URLSearchParams(location.search.substring(1));
const quizId = params.get("id");
const sessionId = params.get("session");

/**
 * location.reload()가 안 되는 경우가 있어서 만든
 * 약간 tricky한 새로고침 로직
 */
const trickyReload = () => {
    const params = new URLSearchParams(location.search.substring(1));
    params.set("dummy", Date.now().toString());
    location.href = location.pathname + "?" + params.toString() + location.hash;
};

const initByQuizId = async () => {
    if (quizId !== null) {
        await PostBoardApiClient.hit(quizId);
        const isNerdTest = await QuizApiClient.isNerdTest(quizId);
        const title = await QuizApiClient.getQuizTitle(quizId);
        document.querySelector(".test-title")!.textContent = title;
        document
            .querySelector(".refresh-nickname")
            ?.addEventListener("click", (evt) => {
                // 닉네임 입력칸을 초기화하지 않으면 새로고침해도 그대로 있다.
                evt.preventDefault();
                (
                    document.querySelector("#nickname") as HTMLInputElement
                ).value = "";

                // 새로고침
                trickyReload();
            });

        // 닉네임 랜덤 생성
        let defaultNickname = randomKoreanNickname();
        // 랜덤 생성된 닉네임이 필터링에 걸리는 닉네임이면 한 번 더 생성
        while (hasBadWord(defaultNickname) !== false)
            defaultNickname = randomKoreanNickname();

        if (!isNerdTest) {
            // 모의고사라면 닉네임 입력과 통계를 가린다.
            [
                ...document.querySelectorAll(
                    ".introduction, form.entry, .statistics",
                ),
            ].forEach((i) => i.classList.add("display-none"));
            QuizApiClient.startQuiz(quizId).then(initSolvePage);
        } else {
            (
                document.querySelector("#nickname") as HTMLInputElement
            ).placeholder = defaultNickname;
            document
                .querySelector("article.loading")
                ?.classList.add("display-none");
            document
                .querySelector("article.display-none")
                ?.classList.remove("display-none");
        }

        // 닉네임 유효성 검증
        const validateNickname = (nickname: string) => {
            const badWord = hasBadWord(nickname);
            if (badWord !== false) {
                setWarningText("닉네임에 부적절한 단어가 있습니다: " + badWord);
            } else if (nickname.length > 0 && nickname.trim().length === 0) {
                setWarningText("공백만으로 이루어진 닉네임은 불가능합니다.");
            } else if (nickname.length > 0 && nickname.length < 3) {
                setWarningText("닉네임은 최소 3자입니다.");
            } else if (nickname.length > 10) {
                setWarningText("닉네임은 최대 10자입니다.");
            } else {
                setWarningText("");
            }
        };

        // 닉네임을 입력할 때마다 유효성 검증
        (
            document.querySelector("#nickname") as HTMLInputElement
        ).addEventListener("input", (evt) => {
            const nickname = (evt.target as HTMLInputElement).value;
            validateNickname(nickname);
        });

        validateNickname(
            (document.querySelector("#nickname") as HTMLInputElement).value,
        );

        let shakeTimeout: NodeJS.Timeout | null = null;
        let submitting = false;
        [...document.querySelectorAll("form")].forEach((i) =>
            i.addEventListener("submit", async (evt) => {
                evt.preventDefault();

                // 세션이 동시에 여러번 초기화되는 것을 방지
                if (submitting) return;
                else submitting = true;

                let age: string | null = (
                    document.querySelector("select.age") as HTMLInputElement
                ).value;
                let gender: string | null = null;

                if (age === "") age = null;
                gender = (
                    document.querySelector("select.gender") as HTMLInputElement
                ).value;
                if (gender === "other")
                    gender = (
                        document.querySelector(
                            "input.specified-gender",
                        ) as HTMLInputElement
                    ).value;

                if (isNerdTest) {
                    // 닉네임의 유효성을 검증한다.
                    const nicknameEl = document.querySelector(
                        "#nickname",
                    ) as HTMLInputElement;
                    const nickname =
                        nicknameEl.value.trim() === ""
                            ? defaultNickname
                            : nicknameEl.value;
                    validateNickname(nickname);

                    // 유효성에 문제가 있다면 return
                    if (warningText !== "") {
                        const warning = document.querySelector(
                            ".entry-section .warning",
                        );
                        if (shakeTimeout === null) {
                            warning?.classList.add("shaking");
                            shakeTimeout = setTimeout(() => {
                                warning?.classList.remove("shaking");
                                shakeTimeout = null;
                            }, 1000);
                        }
                        return;
                    }

                    // 통계를 보내고 퀴즈를 시작한다.
                    await QuizApiClient.sendStatistics(gender, age);
                    QuizApiClient.startNerdQuiz(quizId, {
                        nickname,
                        email: "example@example.com",
                    }).then(initSolvePage);
                } else {
                    // 모의고사라면 닉네임 관련 로직없이 바로 퀴즈를 시작한다.
                    // await QuizApiClient.sendStatistics(gender, age);
                    QuizApiClient.startQuiz(quizId).then(initSolvePage);
                }
            }),
        );
    } else {
        alert("오류가 발생했습니다.");
    }
};

// (모의고사) 세션 id가 주어졌다면 바로 퀴즈를 시작한다.
if (sessionId !== null && QuizSession.hasSession(sessionId)) {
    const session = new QuizSession(sessionId);
    session.sessionInfo().then((info) => {
        if (info.isNerdTest) {
            initByQuizId();
        } else {
            initSolvePage(session);
        }
    });
} else {
    initByQuizId();
}
