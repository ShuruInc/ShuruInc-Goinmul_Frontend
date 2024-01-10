import "../../../styles/quiz";
import { QuizSession } from "../../api/quiz";
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
addFloatingButonListener(() => (location.href = "/dist"));
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
            "./solve.html?session=" + encodeURIComponent(sessionId));

    document.querySelector(".quiz-title")!.textContent = result.title;
    document.querySelector(".score")!.textContent = result.points + "점";
    document.querySelector(".ranking")!.textContent = result.ranking.toString();
})();
