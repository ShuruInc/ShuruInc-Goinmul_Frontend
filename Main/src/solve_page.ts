import { dom, library } from "@fortawesome/fontawesome-svg-core";
import { QuizSession } from "./api/quiz_session";
import initShareButton, { ShareDatas } from "./init_share";
import {
    addAnswerSubmitListener,
    displayCorrectnessAnimation,
    displayProblem,
    initQuizSolveUI,
    setHelpMeFriendsEventHandler,
    updateProgress,
    updateShareProblem,
} from "./quiz_solve_ui";
import solveBody from "./solve_page.html";
import { InitTopNav } from "./top_logo_navbar";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import html2canvas from "html2canvas";
import addPadding from "./canvas_padding";
import ImageCache from "./image_cache";
import initializeResultPage from "./result_page";
import { nerdTestExitFeatureEnabled } from "./env";

function confirmUnload(evt: Event) {
    evt.preventDefault();
    return "정말로 나가시겠습니까?";
}

export default function initSolvePage(session: QuizSession) {
    // 페이지 나갈시 확인 대화상자 표시
    let timerInterval: NodeJS.Timeout | null = null;
    session.sessionInfo().then((info) => {
        if (info.isNerdTest) {
            window.addEventListener("beforeunload", confirmUnload);
        }
    });

    // HTML 변경 및 레이아웃 초기화
    document.body.innerHTML = solveBody;
    InitTopNav();
    initQuizSolveUI();

    // 아이콘 렌더링
    library.add(faCheck);
    library.add(faXmark);
    dom.i2svg({ node: document.querySelector(".correctness-effect")! });

    let shared = false;
    const sessionId = session.getSessionId();
    let shareData: Omit<ShareDatas, "image"> | null = null;
    const setShareData = initShareButton({
        onComplete: () => (shared = true),
        beforeShare: () => {
            // 공유 버튼을 눌렀을 때 공유 직전에 이미지를 설정한다.

            /**
             * .problem-box가 보이지 않으면 svg 렌더링이 되지 않으므로
             * .problem-box가 보일 때 svg 렌더링을 한다.
             */
            return html2canvas(
                document.querySelector(".help-me .problem-box")!,
                {
                    // 이미지가 안 보이는 버그 수정
                    useCORS: true,
                },
            ).then(
                (canvas) =>
                    // 이미지를 렌더링 한다.
                    new Promise<void>((resolve, reject) => {
                        addPadding(canvas).then((blob) => {
                            // 이미지에 여백을 추가한다.
                            if (shareData && blob) {
                                const file = new File([blob], "problem.png", {
                                    type: "image/png",
                                });

                                // 공유 데이터에 이미지를 설정한다.
                                setShareData({
                                    ...shareData,
                                    webShare: {
                                        ...shareData.webShare,
                                        files: [file],
                                    },
                                    image: file,
                                });
                                resolve();
                            } else reject("오류가 발생했습니다.");
                        });
                    }),
            );
        },
    });

    (async () => {
        // 제목 설정
        document.querySelector(".test-title")!.textContent = (
            await session.sessionInfo()
        ).title;

        updateProgress(0);
        const goResult = () => {
            if (timerInterval !== null) clearInterval(timerInterval);

            // 결과 페이지로 갈 때는 페이지 나갈 시 뜨는 확인 대화상자가 뜨면 안 된다.
            window.removeEventListener("beforeunload", confirmUnload);
            history.replaceState(
                null,
                "",
                "/quiz/result.html?session=" + encodeURIComponent(sessionId),
            );
            initializeResultPage();
        };

        const sessionInfo = await session.sessionInfo();

        if (nerdTestExitFeatureEnabled) {
            (window as any).exitNerdTest = () => {
                session.forcedEnd();
                goResult();
            };
        }

        const imageCache = new ImageCache();
        for (const i of await session.getImageLinks()) {
            imageCache.fetch(i);
        }

        const renewProblem = async () => {
            const problem = await session.currentProblem();
            if (problem === null) {
                return goResult();
            }

            displayProblem(
                document.querySelector("article")!,
                {
                    ...problem,
                    figure:
                        problem.figureType === "image"
                            ? await imageCache.get(problem.figure)
                            : problem.figure,
                },
                problem.index,
            );
            updateShareProblem(
                document.querySelector(".help-me .problem-box")!,
                {
                    ...problem,
                    figure:
                        problem.figureType === "image"
                            ? await imageCache.get(problem.figure)
                            : problem.figure,
                },
                problem.index,
            );

            if (!sessionInfo.isNerdTest) {
                updateProgress(
                    ((problem.index - 1) / sessionInfo.totalProblemCount!) *
                        100,
                    `${problem.index}/${sessionInfo.totalProblemCount!}`,
                );
                setHelpMeFriendsEventHandler({
                    onEnabled: () => {
                        shared = false;
                    },
                    beforeDisable: () => shared,
                });
            } else {
                setHelpMeFriendsEventHandler({
                    onDisabled: () => session.getStopWatch().resume(),
                    onEnabled: () => {
                        session.getStopWatch().pause();
                        shared = false;
                    },
                    beforeDisable: () => shared,
                });
                document
                    .querySelector(".timer-paused")
                    ?.classList.remove("display-none");
            }

            const quizUrl = `https://example.com/quiz/solve.html?id=${sessionInfo.quizId}`;
            shareData = {
                twitter: {
                    text: `[${sessionInfo.category}] ${
                        sessionInfo.isNerdTest ? "고인물 테스트" : "모의고사"
                    }

모르겠어요... 도와주세요 🚨
모르겠어요... 도와주세요 🚨
모르겠어요... 도와주세요 🚨
모르겠어요... 도와주세요 🚨
모르겠어요... 도와주세요 🚨
모르겠어요... 도와주세요 🚨

🔗 ${quizUrl}
#고인물테스트 #슈르네`,
                },
                kakao: {
                    title: `[${sessionInfo.category}] ${
                        sessionInfo.isNerdTest ? "고인물 테스트" : "모의고사"
                    }`,
                    content: "모르겠어요... 도와주세요 🚨\n⬇⬇⬇⬇⬇",
                    buttonText: "나도 풀어보기",
                    url: quizUrl,
                },
                webShare: {
                    url: quizUrl,
                    title: `[${sessionInfo.category}] ${
                        sessionInfo.isNerdTest ? "고인물 테스트" : "모의고사"
                    }`,
                    text: "모르겠어요... 도와주세요 🚨",
                },
            };
            setShareData({
                ...shareData,
                image: new File(
                    [new Blob([""], { type: "iamge/png" })],
                    "problem.png",
                    {
                        type: "image/png",
                    },
                ),
            });
        };

        addAnswerSubmitListener(async (answer, subjective) => {
            const correct = await session.submit(answer, subjective);
            [
                ...document.querySelectorAll(".answer input, .answer button"),
            ].forEach((i) => ((i as HTMLInputElement).disabled = true));
            await displayCorrectnessAnimation(correct);

            renewProblem();
        });

        if (sessionInfo.isNerdTest) {
            timerInterval = setInterval(() => {
                const elapsed = session.getStopWatch().elapsed();
                const totalTime = 1000 * 60 * 5;
                const percentage = (elapsed / totalTime) * 100;
                if (percentage >= 100) return goResult();

                const leftTime = totalTime - elapsed;
                updateProgress(
                    percentage,
                    `${Math.floor(leftTime / 1000 / 60)}:${(
                        Math.floor(leftTime / 1000) % 60
                    )
                        .toString()
                        .padStart(2, "0")}`,
                    // 1분 이하로 남았으면 노란색, 30초 이하로 남았으면 빨간색
                    leftTime < 1000 * 30
                        ? "red"
                        : leftTime < 1000 * 60
                        ? "yellow"
                        : undefined,
                );
            }, 500);
        } else {
            // 모의고사는 새로고침이 되도 계속 풀 수 있게 주소에 세션 id를 넣는다.
            const quizId = new URLSearchParams(
                location.search.substring(1),
            ).get("id");
            history.replaceState(
                null,
                "",
                `/quiz/solve.html?session=${sessionId}&id=${quizId}`,
            );
        }
        renewProblem();
    })();
}
