import { dom, library } from "@fortawesome/fontawesome-svg-core";
import "../../../styles/quiz";
import { QuizApiClient } from "../../api/quiz";
import { InitTopNavImg } from "../../top_bottom_animation";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

InitTopNavImg();

// FontAwesome 아이콘 렌더링
library.add(faSpinner);
dom.i2svg();

const params = new URLSearchParams(location.search.substring(1));
const quizId = params.get("id");
if (quizId === null || quizId === " ") {
    alert("오류");
} else {
    QuizApiClient.isNerdTest(quizId).then((isNerdTest) => {
        if (isNerdTest) {
            document
                .querySelector("article.loading")
                ?.classList.add("display-none");
            document
                .querySelector("article.display-none")
                ?.classList.remove("display-none");
            document
                .querySelector("form")
                ?.addEventListener("submit", (evt) => {
                    evt.preventDefault();
                    QuizApiClient.startNerdQuiz(quizId, {
                        nickname: (
                            document.querySelector(
                                "#nickname"
                            ) as HTMLInputElement
                        ).value,
                        email: (
                            document.querySelector("#email") as HTMLInputElement
                        ).value,
                    }).then((session) => {
                        location.href =
                            "./solve.html?session=" +
                            encodeURIComponent(session.getSessionId());
                    });
                    location.href = "./solve.html?id=nerd";
                });
        } else {
            QuizApiClient.startQuiz(quizId).then((session) => {
                location.href =
                    "./solve.html?session=" +
                    encodeURIComponent(session.getSessionId());
            });
        }
    });
}
