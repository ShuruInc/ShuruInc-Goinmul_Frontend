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
import padCanvas from "./canvas_padding";

export default function initSolvePage(session: QuizSession) {
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
                    new Promise<void>((resolve, reject) => {
                        padCanvas(canvas)
                            .convertToBlob({ type: "image/png" })
                            .then((blob) => {
                                if (shareData && blob) {
                                    const file = new File(
                                        [blob],
                                        "problem.png",
                                        {
                                            type: "image/png",
                                        },
                                    );
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
        updateProgress(0);
        const goResult = () =>
            (location.href =
                "/quiz/result.html?session=" + encodeURIComponent(sessionId));
        const sessionInfo = await session.sessionInfo();

        const renewProblem = async () => {
            const problem = await session.currentProblem();
            if (problem === null) {
                return goResult();
            }

            displayProblem(
                document.querySelector("article")!,
                problem,
                problem.index,
            );
            updateShareProblem(
                document.querySelector(".help-me .problem-box")!,
                problem,
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
                    text: `${sessionInfo.title} ${
                        sessionInfo.isNerdTest ? "고인물 테스트" : "모의고사"
                    } 푸는 중인데 이 문제 도저히 모르겠다... 아는 사람? 😀

🔗 https://example.com/quiz/solve.html?id=${sessionInfo.quizId}
#고인물테스트 #슈르네`,
                },
                kakao: {
                    title: `[${sessionInfo.title}] 모의고사`,
                    content: "이 문제 도저히 모르겠다...\n도와줄 사람?",
                    buttonText: "나도 풀어보기",
                    url: quizUrl,
                },
                webShare: {
                    url: quizUrl,
                    title: `[${sessionInfo.title}] 모의고사`,
                    text: "이 문제 도저히 모르겠다... 도와줄 사람?",
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

        addAnswerSubmitListener(async (answer) => {
            const correct = await session.submit(answer);
            displayCorrectnessAnimation(correct);

            renewProblem();
        });

        if (sessionInfo.isNerdTest) {
            setInterval(() => {
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
                    percentage > 50,
                );
            }, 500);
        } else {
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
