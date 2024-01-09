import "../../../styles/quiz";
import { QuizSession } from "../../api/quiz";
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
fillPlaceholderSectionInto(
    {
        portraits: [0, 1, 2, 3, 4, 5, 6, 7]
            .map(
                (_i) =>
                    `https://picsum.photos/200/300?${Date.now()}${Math.floor(
                        Math.random() * 1000
                    )}`
            )
            .map((imgUrl) => ({
                imgUrl,
                title: `테스트${Math.floor(Math.random() * 100)}`,
                likes: 100,
                views: 100,
                href: "#",
            })),
    },
    document.querySelector(".post-section")!
);

(async () => {
    const result = await session.result();
    if (result === null)
        return (location.href =
            "./solve.html?session=" + encodeURIComponent(sessionId));

    document.querySelector(".quiz-title")!.textContent = result.title;
    document.querySelector(".score")!.textContent = result.points + "점";
    document.querySelector(".ranking")!.textContent = result.ranking.toString();
})();
