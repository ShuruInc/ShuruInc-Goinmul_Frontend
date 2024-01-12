import { dom, library } from "@fortawesome/fontawesome-svg-core";
import "../../../styles/quiz";
import { QuizApiClient } from "../../api/quiz";
import { InitTopNav } from "../../top_bottom_animation";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import initSolvePage from "../../solvePage";

InitTopNav();

// FontAwesome 아이콘 렌더링
library.add(faSpinner);
dom.i2svg({ node: document.querySelector("article.loading")! });

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
                    }).then(initSolvePage);
                });
        } else {
            QuizApiClient.startQuiz(quizId).then(initSolvePage);
        }
    });
}
