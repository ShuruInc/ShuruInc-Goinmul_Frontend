import html2canvas from "html2canvas";
import "./../styles/quiz";
import { QuizSession } from "./api/quiz_session";
import SearchApiClient from "./api/search";
import {
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
import pushpin from "../assets/pushpin.png";
import createFirstPlaceDialog from "./firstPlaceDialog";
import getMedalData from "./get_medal_image";
// import displayLoadingSplash from "./loadingSplash";
import { alwaysDisplayEmailInputModal } from "./env";
import createNoticeFloatingButton from "./notice_floating_button";
import corkBoard from "../assets/cork-board.png";

/**
 * 결과 페이지를 렌더링한다.
 */
export default function initializeResultPage() {
    if (!document.body.classList.contains("result-page-html-prepared")) {
        document.body.innerHTML = resultPageHtml;
    }
    document.body.classList.add("result-body");
    (document.body.querySelector(".pushpin img") as HTMLImageElement).src =
        pushpin;

    const sessionId =
        new URLSearchParams(location.search.substring(1)).get("session") ?? "";
    if (!QuizSession.hasSession(sessionId)) {
        location.href = "/quiz/solve.html?id=" + encodeURIComponent(sessionId);
    }
    const session = new QuizSession(sessionId);
    const loadTime = Date.now();

    const removeLoadingAfter = (delay: number) =>
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
    createNoticeFloatingButton(
        "5월 5일 23시 59분까지 1등을 유지하신 분께,  \"당신의 최애 장르 공식 굿즈 10만 원 상당\"을 이벤트 선물로 드립니다!",
    );
    addFloatingButonListener(() => (location.href = "/"));

    SearchApiClient.randomRecommend(8).then((posts) => {
        fillPlaceholderSectionInto(
            {
                title: "다른 모의고사 풀기",
                portraits: posts,
            },
            document.querySelector(".post-section")!,
        );
    });

    (async () => {
        const curTitle = (await session.sessionInfo()).title;  

        SearchApiClient.recommend(curTitle, 8).then((posts) => {
            fillPlaceholderSectionInto(
                {
                    title: "다른 모의고사 풀기",
                    portraits: posts,
                },
                document.querySelector(".post-section")!,
            );
        });

        const result = await session.result();
        if (result === null)
            return alert("오류가 발생했습니다: 퀴즈가 아직 안 끝났습니다!");

        const topCategory = await session.firstCategory();
        const nerdTest = await await PostBoardApiClient.getNerdTestOf(
            topCategory.id,
        );

        let isNerdTest = typeof result.ranking !== "undefined";
        if (isNerdTest && result.ranking! <= 3) {
            document.querySelector(".pushpin")?.classList.add("hidden");
        }

        createResultElement(
            document.querySelector(".result")!,
            isNerdTest
                ? {
                      nerd: true,
                      date: new Date(),
                      hashtag: result.hashtag!,
                      nickname: result.nickname!,
                      points: result.points!,
                      ranking: result.ranking!,
                      topCategory: topCategory.name,
                  }
                : {
                      nerd: false,
                      date: new Date(),
                      percentage: result.percentage!,
                      points: result.points!,
                      lowCategory: (await session.sessionInfo()).title,
                      middleCategory: (await session.sessionInfo()).category,
                      nerdTestLink: {
                          href: nerdTest.href,
                          text: nerdTest.title,
                      },
                  },
        );

        const medalImage = getMedalData(isNerdTest ? result.ranking! : 0);
        if (medalImage !== null) {
            (document.querySelector(".medal img") as HTMLImageElement).src =
                medalImage;
        } else {
            document.querySelector(".medal")?.remove();
        }

        document.querySelector(".retry")?.addEventListener("click", (evt) => {
            evt.preventDefault();
            location.href =
                "/quiz/solve.html?skip_statistics=true&id=" +
                encodeURIComponent(result.quizId);
        });

        // let removeLoadingSplash: (() => void) | null = null;
        const changeShareData = initShareButton({
            beforeShare: async () => {
                // removeLoadingSplash = displayLoadingSplash();
            },
            onComplete: () => {
                // if (removeLoadingSplash) removeLoadingSplash();
            },
        });

        const url =
            "https://goinmultest.pro/quiz/solve.html?id=" +
            encodeURIComponent((await session.sessionInfo()).quizId);

        document
            .querySelector(".copy-link")
            ?.addEventListener("click", async (evt) => {
                evt.preventDefault();

                try {
                    if(navigator.clipboard) {
                        await navigator.clipboard.writeText(url);
                        
                        alert('클립보드에 주소가 복사되었어요!');

                        return;
                    } else throw new Error();
                } catch {
                    prompt("다음 주소를 복사해주세요!", url);
                }
            });
        await removeLoadingAfter(Math.max(1, 1000 - (Date.now() - loadTime)));
        const blob = await addPadding(
            await html2canvas(document.querySelector(".result-container")!, {
                scale: 2,
                backgroundColor: "transparent",
                onclone(document) {
                    (
                        document.querySelector(
                            ".result-container",
                        ) as HTMLElement
                    ).classList.add("html2canvas");
                }, 
            }),
            corkBoard,
        );
        const imageFile = new File([blob], "result.png", { type: 'image/png' });

        // 모의고사
        changeShareData({
            webShare: {
                url,
                // title: `[${result.category}] ${
                //     isNerdTest ? "고인물 테스트" : "모의고사"
                // }`,
                text: `내 성적표 등장 ‼\n\n${url}`.trim(),
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

⬇ 풀어... 보시겠어요? ⬇
🔗 ${url}
#고인물테스트 #슈르네`,
            },
            image: imageFile,
            imageBlob: blob,
        });

        if (result.ranking === 1 || alwaysDisplayEmailInputModal)
            createFirstPlaceDialog((email) => {
                // console.log(email)
                session.submitEmail(email);
            });

        window.scrollTo(0, 0);
    })();
}

document.body.style.overflowX = "hidden";

(window as any).createFirstPlaceDialog = createFirstPlaceDialog;


// let loop_d = setInterval(() => {
//     const h2Element = document.querySelector('h2 .subtitle');

//     if (h2Element && h2Element.textContent!.trim() === "원피스 모의고사") {
//         h2Element.textContent = "한국 애니메이션 맞히기 모의고사";
//         clearInterval(loop_d);
//         return;
//     }

//     if (h2Element && h2Element.textContent!.trim() === "한국 애니메이션 맞히기 모의고사") {
//         h2Element.textContent = "원피스 모의고사";
//         clearInterval(loop_d);
//         return;
//     }
// }, 10);
