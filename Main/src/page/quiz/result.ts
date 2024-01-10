import "../../../styles/quiz";
import { QuizSession } from "../../api/quiz_session";
import SearchApiClient from "../../api/search";
import createFloatingButton, {
    addFloatingButonListener,
} from "../../floatingButton";
import {
    fillPlaceholderSectionInto,
    preparePlaceholderSection,
} from "../../post_board";
import { InitTopNav } from "../../top_bottom_animation";

const sessionId =
    new URLSearchParams(location.search.substring(1)).get("session") ?? "";
const session = new QuizSession(sessionId);

InitTopNav();
preparePlaceholderSection(document.querySelector(".post-section")!);
createFloatingButton("home");
addFloatingButonListener(() => (location.href = "/"));
SearchApiClient.recommend(8).then((posts) => {
    fillPlaceholderSectionInto(
        {
            portraits: posts,
        },
        document.querySelector(".post-section")!
    );
});
(async () => {
    const result = await session.result();
    if (result === null)
        return (location.href =
            "/quiz/solve.html?session=" + encodeURIComponent(sessionId));

    document.querySelector(".quiz-title")!.textContent = result.title;
    document.querySelector(".score")!.textContent = result.points + "점";
    if (typeof result.percentage !== "undefined") {
        document.querySelector(".rankings-ad")?.classList.add("display-none");
        document.querySelector(
            ".ranking"
        )!.innerHTML = `(점수대에 따라 다른 멘트)<br>당신은 상위 ${result.percentage}%`;
    } else
        document.querySelector(
            ".ranking"
        )!.innerHTML = `맞히셨습니다!<br>당신은 현재 랭킹 ${result.ranking}위!`;

    document.querySelector(".retry")?.addEventListener("click", (evt) => {
        evt.preventDefault();
        location.href =
            "/quiz/entry.html?id=" + encodeURIComponent(result.quizId);
    });
})();
