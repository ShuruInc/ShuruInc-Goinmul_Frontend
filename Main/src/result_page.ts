import html2canvas from "html2canvas";
import "./../styles/quiz";
import { QuizSession } from "./api/quiz_session";
import SearchApiClient from "./api/search";
import createFloatingButton, {
    addFloatingButonListener,
} from "./floating_button";
import initShareButton from "./init_share";
import {
    fillPlaceholderSectionInto,
    preparePlaceholderSection,
} from "./post_board";
import { InitTopNav } from "./top_logo_navbar";
import addPadding from "./canvas_padding";
import resultPageHtml from "./result_page.html";
import createResultElement from "./create_result_element";
import PostBoardApiClient from "./api/posts";
import { dom, library } from "@fortawesome/fontawesome-svg-core";
import { faRankingStar } from "@fortawesome/free-solid-svg-icons";

export default function initializeResultPage() {
    if (!document.body.classList.contains("result-page-html-prepared")) {
        document.body.innerHTML = resultPageHtml;
    }

    const sessionId =
        new URLSearchParams(location.search.substring(1)).get("session") ?? "";
    const session = new QuizSession(sessionId);
    const loadTime = Date.now();

    const removeLoading = (delay: number) =>
        new Promise<void>((resolve) => {
            setTimeout(() => {
                (
                    document.querySelector(".main-container") as HTMLElement
                ).classList.remove("loading");
                resolve();
            }, delay);
        });

    InitTopNav();
    preparePlaceholderSection(document.querySelector(".post-section")!);
    createFloatingButton("home");
    addFloatingButonListener(() => (location.href = "/"));
    SearchApiClient.recommend(8).then((posts) => {
        fillPlaceholderSectionInto(
            {
                title: "다른 모의고사 풀기",
                portraits: posts,
            },
            document.querySelector(".post-section")!,
        );
    });
    (async () => {
        const result = await session.result();
        if (result === null)
            return alert("오류가 발생했습니다: 퀴즈가 아직 안 끝났습니다!");

        if (result.nickname && result.hashtag) {
            library.add(faRankingStar);
            dom.i2svg({
                node: document.querySelector(".rankings-ad")!,
            });

            document.querySelector(
                ".rankings-ad .nickname",
            )!.textContent = `${result.nickname}#${result.hashtag}`;
        } else {
            document
                .querySelector(".rankings-ad")
                ?.classList.add("display-none");
        }

        const topCategory = await session.firstCategory();
        const nerdTest = await await PostBoardApiClient.getNerdTestOf(
            topCategory.id,
        );

        createResultElement(
            document.querySelector(".result")!,
            typeof result.ranking === "undefined"
                ? {
                      nerd: false,
                      date: new Date(),
                      percentage: result.percentage!,
                      points: result.points!,
                      lowCategory: (await session.sessionInfo()).title,
                      middleCategory: (await session.sessionInfo()).category,
                      link: {
                          href: nerdTest.href,
                          text: nerdTest.title,
                      },
                  }
                : {
                      nerd: true,
                      date: new Date(),
                      hashtag: result.hashtag!,
                      nickname: result.nickname!,
                      points: result.points!,
                      ranking: result.ranking!,
                      topCategory: topCategory.name,
                  },
        );

        document.querySelector(".retry")?.addEventListener("click", (evt) => {
            evt.preventDefault();
            location.href =
                "/quiz/solve.html?skip_statistics=true&id=" +
                encodeURIComponent(result.quizId);
        });

        const changeShareData = initShareButton();

        const url = "https://example.com";
        await removeLoading(Math.max(1, 1000 - (Date.now() - loadTime)));
        const blob = await addPadding(
            await html2canvas(document.querySelector(".result")!),
        );
        const imageFile = new File([blob], "result.png", { type: "image/png" });

        let isNerdTest = typeof result.nickname !== "undefined";
        // 모의고사
        changeShareData({
            webShare: {
                url,
                title: `[${result.category}] ${
                    isNerdTest ? "고인물 테스트" : "모의고사"
                }`,
                text: `내 성적표 등장 ‼\n⬇ 풀어... 보시겠어요? ⬇`,
                files: [imageFile],
            },
            kakao: {
                title: `[${result.category}] ${
                    isNerdTest ? "고인물 테스트" : "모의고사"
                }`,
                content: `내 성적표 등장 ‼\n⬇ 풀어... 보시겠어요? ⬇`,
                buttonText: "나도 풀어보기",
                url,
            },
            twitter: {
                text: `[${result.title}] ${
                    isNerdTest ? "고인물 테스트" : "모의고사"
                }

내 성적표 등장 ‼
내 성적표 등장 ‼
내 성적표 등장 ‼
내 성적표 등장 ‼
내 성적표 등장 ‼
내 성적표 등장 ‼

⬇ 풀어... 보시겠어요? ⬇
🔗 ${url}
#고인물테스트 #슈르네`,
            },
            image: imageFile,
        });
    })();
}
