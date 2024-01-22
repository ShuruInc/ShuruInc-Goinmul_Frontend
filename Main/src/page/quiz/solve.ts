import { dom, library } from "@fortawesome/fontawesome-svg-core";
import "../../../styles/quiz";
import { QuizApiClient } from "../../api/quiz";
import { InitTopNav } from "../../top_logo_navbar";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import initSolvePage from "../../solve_page";
import { QuizSession } from "../../api/quiz_session";
import { validate as validateEmail } from "email-validator";

InitTopNav();

// FontAwesome 아이콘 렌더링
library.add(faSpinner);
dom.i2svg({ node: document.querySelector("article.loading")! });

const params = new URLSearchParams(location.search.substring(1));
const quizId = params.get("id");
const sessionId = params.get("session");
const initByQuizId = () => {
    if (quizId !== null) {
        QuizApiClient.isNerdTest(quizId).then((isNerdTest) => {
            document
                .querySelector("article.loading")
                ?.classList.add("display-none");
            document
                .querySelector("article.display-none")
                ?.classList.remove("display-none");
            if (!isNerdTest) {
                [
                    ...document.querySelectorAll(".introduction, form.entry"),
                ].forEach((i) => i.classList.add("display-none"));
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
                        const emailEl = document.querySelector(
                            "#email",
                        ) as HTMLInputElement;
                        const nickname = nicknameEl.value;
                        const email = emailEl.value;
                        if (nickname.trim() === "") {
                            alert("닉네임을 올바르게 입력해주세요!");
                            nicknameEl.focus();
                            return;
                        } else if (
                            email.trim() === "" ||
                            !validateEmail(email)
                        ) {
                            alert("이메일을 올바르게 입력해주세요!");
                            emailEl.focus();
                            return;
                        }
                        await QuizApiClient.sendStatistics(gender, age);
                        QuizApiClient.startNerdQuiz(quizId, {
                            nickname,
                            email,
                        }).then(initSolvePage);
                    } else {
                        await QuizApiClient.sendStatistics(gender, age);
                        QuizApiClient.startQuiz(quizId).then(initSolvePage);
                    }
                }),
            );
        });
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
