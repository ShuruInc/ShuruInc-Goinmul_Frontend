import { dom, library } from "@fortawesome/fontawesome-svg-core";
import "../../../styles/quiz";
import { QuizApiClient } from "../../api/quiz";
import { InitTopNav } from "../../top_logo_navbar";
import { faArrowsRotate, faSpinner } from "@fortawesome/free-solid-svg-icons";
import initSolvePage from "../../solve_page";
import { QuizSession } from "../../api/quiz_session";
import randomKoreanNickname from "../../random_korean_nickname";
import PostBoardApiClient from "../../api/posts";
import hasBadWord from "../../bad_words/has_bad_word";

InitTopNav();

// FontAwesome 아이콘 렌더링
library.add(faSpinner, faArrowsRotate);
for (const i of [
    document.querySelector("article.loading")!,
    document.querySelector(".refresh-nickname")!,
])
    dom.i2svg({ node: i });

const params = new URLSearchParams(location.search.substring(1));
const quizId = params.get("id");
const sessionId = params.get("session");
const skipStatistics = params.get("skip_statistics") === "true";
const initByQuizId = async () => {
    if (quizId !== null) {
        await PostBoardApiClient.hit(quizId);
        const isNerdTest = await QuizApiClient.isNerdTest(quizId);
        const title = await QuizApiClient.getQuizTitle(quizId);
        document.querySelector;
        document.querySelector("h1.test-title")!.textContent = title;
        document
            .querySelector(".refresh-nickname")
            ?.addEventListener("click", (evt) => {
                evt.preventDefault();
                location.reload();
            });
        document
            .querySelector("article.loading")
            ?.classList.add("display-none");
        document
            .querySelector("article.display-none")
            ?.classList.remove("display-none");
        let defaultNickname = randomKoreanNickname();
        if (!isNerdTest) {
            [...document.querySelectorAll(".introduction, form.entry")].forEach(
                (i) => i.classList.add("display-none"),
            );
            if (skipStatistics) {
                QuizApiClient.startQuiz(quizId).then(initSolvePage);
            }
        } else {
            (
                document.querySelector("#nickname") as HTMLInputElement
            ).placeholder = defaultNickname;
        }
        [...document.querySelectorAll("form")].forEach((i) =>
            i.addEventListener("submit", async (evt) => {
                evt.preventDefault();
                let age: string | null = (
                    document.querySelector("select.age") as HTMLInputElement
                ).value;
                let gender: string | null = null;

                if (age === "") age = null;
                gender = (
                    (
                        [
                            ...document.querySelectorAll(
                                ".gender-radios input",
                            ),
                        ] as HTMLInputElement[]
                    ).filter((i) => i.checked)[0] ?? { value: null }
                ).value;
                if (gender === "other")
                    gender = (
                        document.querySelector(
                            "input.specified-gender",
                        ) as HTMLInputElement
                    ).value;

                if (isNerdTest) {
                    const nicknameEl = document.querySelector(
                        "#nickname",
                    ) as HTMLInputElement;
                    const nickname =
                        nicknameEl.value.trim() === ""
                            ? defaultNickname
                            : nicknameEl.value;
                    if (hasBadWord(nickname)) {
                        return alert("닉네임에 부적절한 단어가 있습니다");
                    } else if (nickname.length === 0) {
                        return alert("닉네임을 입력해주세요.");
                    } else if (nickname.length > 8) {
                        return alert("닉네임은 최대 8자입니다.");
                    }
                    await QuizApiClient.sendStatistics(gender, age);
                    QuizApiClient.startNerdQuiz(quizId, {
                        nickname,
                        email: "example@example.com",
                    }).then(initSolvePage);
                } else {
                    await QuizApiClient.sendStatistics(gender, age);
                    QuizApiClient.startQuiz(quizId).then(initSolvePage);
                }
            }),
        );
    } else {
        alert("오류가 발생했습니다.");
    }
};
if (sessionId !== null) {
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
