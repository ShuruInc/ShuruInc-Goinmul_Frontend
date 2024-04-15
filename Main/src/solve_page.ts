import { dom, library } from "@fortawesome/fontawesome-svg-core";
import { QuizSession } from "./api/quiz_session";
import initShareButton, { ShareDatas } from "./init_share";
import {
    addAnswerSubmitListener,
    displayCorrectnessAndComboAnimation,
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
import ImageCache from "./image_cache";
import initializeResultPage from "./result_page";
import { alwaysDisplaycombo, nerdTestExitFeatureEnabled } from "./env";
// import displayLoadingSplash from "./loadingSplash";

function confirmUnload(evt: Event) {
    evt.preventDefault();
    return "정말로 나가시겠습니까?";
}

/**
 * 문제 풀이 페이지를 렌더링한다.
 * @param session 퀴즈 세션
 */
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

    (window as any).h2c = html2canvas;

    let shared = false;
    const sessionId = session.getSessionId();
    let shareData: Omit<Omit<ShareDatas, "image">, 'imageBlob'> | null = null;
    const setShareData = initShareButton({
        onComplete: () => {
        },
        beforeShare: () => {
            return Promise.resolve();
        },
    });
    (window as any).setShareData = setShareData;

    (async () => {
        // 제목 설정
        document.querySelector(".test-title")!.textContent = (
            await session.sessionInfo()
        ).title;

        const sessionInfo = await session.sessionInfo();

        const quizUrl = `https://goinmultest.pro/quiz/solve.html?id=${sessionInfo.quizId}`;
        document
        .querySelector(".copy-link")
        ?.addEventListener("click", async (evt) => {
            evt.preventDefault();

            try {
                if(navigator.clipboard) {
                    await navigator.clipboard.writeText(quizUrl);
                    
                    alert('클립보드에 주소가 복사되었어요!');

                    return;
                } else throw new Error();
            } catch {
                prompt("다음 주소를 복사해주세요!", quizUrl);
            }
        });

        updateProgress(0);
        const goResult = () => {
            // 타이머 표시를 중단한다.
            if (timerInterval !== null) clearInterval(timerInterval);

            // 결과 페이지로 갈 때는 페이지 나갈 시 뜨는 확인 대화상자가 뜨면 안 된다.
            window.removeEventListener("beforeunload", confirmUnload);
            history.replaceState(
                null,
                "",
                `/quiz/result.html` +
                    `?quizId=${encodeURIComponent(sessionInfo.quizId)}` +
                    `&session=${encodeURIComponent(sessionId)}`,
            );
            initializeResultPage();
        };

        // 디버깅용 기능
        // 개발자 도구 콘솔에서 exitNerdTest();를 치면 고인물 테스트가 남은 시간이나 남은 문제 갯수에 상관없이 강제 종료된다.
        if (nerdTestExitFeatureEnabled) {
            (window as any).exitNerdTest = () => {
                session.forcedEnd();
                goResult();
            };
        }

        // 이미지 캐시를 초기화한다.
        const imageCache = new ImageCache();
        for (const i of await session.getImageLinks()) {
            // 참고: 나오는 순서대로 넣어야 한다. (순서 뒤섞이면 안 된다.)
            imageCache.pushUrl(i);
        }

        // 현재 점수와 콤보를 저장한다.
        let currentScore = 0;
        let combo = 0;

        const renewProblem = async () => {
            const problem = await session.currentProblem();

            // 문제가 다 떨어졌다면 결과 페이지를 표시한다.
            if (problem === null) {
                return goResult();
            }

            // 새로운 문제를 표시한다.
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
                sessionInfo.isNerdTest
                    ? {
                        currentScore,
                        combo: combo + 1,
                      }
                    : {},
            );

            // "친구들아, 도와줘!" 화면에 새로운 문제를 표시한다.
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
                // 고인물 테스트가 아닐시 문재 갯수를 기준으로 진행바를 갱신한다.
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

            const quizUrl = `https://goinmultest.pro/quiz/view.html?id=${sessionInfo.quizId}&problem=${problem.id}`;
            const file = new File(
                [new Blob([""], { type: "image/png" })],
                "problem.png",
                {
                    type: "image/png",
                },
            );
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
                    // title: `[${sessionInfo.category}] ${
                    //     sessionInfo.isNerdTest ? "고인물 테스트" : "모의고사"
                    // }`,
                    text: `모르겠어요... 도와주세요 🚨\n\n${quizUrl}`.trim(),
                    files: [file],
                },
            };
            setShareData({
                ...shareData,
                image: file,
                imageBlob: new Blob([""], { type: "image/png" }),
            });
        };

        addAnswerSubmitListener(async (answer, subjective) => {
            const correct = await session.submit(answer, subjective);
            [
                ...document.querySelectorAll(".answer input, .answer button"),
            ].forEach((i) => ((i as HTMLInputElement).disabled = true));
            currentScore = correct.score ?? currentScore;
            combo = correct.combo ?? combo;

            window.scrollTo(0, 0);

            await displayCorrectnessAndComboAnimation(
                correct.correct!,
                combo !== 0 || alwaysDisplaycombo,
            );

            renewProblem();
        });

        if (sessionInfo.isNerdTest) {
            timerInterval = setInterval(() => {
                const elapsed = session.getStopWatch().elapsed();
                const totalTime = 1000 * 60 * 1;
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
        }

        const quizId = new URLSearchParams(
            location.search.substring(1),
        ).get("id");
        history.replaceState(
            null,
            "",
            `/quiz/solve.html?session=${sessionId}&id=${quizId}`,
        );

        renewProblem();
    })();
}
