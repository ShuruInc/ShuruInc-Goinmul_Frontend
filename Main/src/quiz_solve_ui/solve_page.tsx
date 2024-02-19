import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { QuizSession, QuizSessionInfo } from "../api/quiz_session";
import { nerdTestExitFeatureEnabled } from "../env";
import ImageCache from "../image_cache";
import TopNavbar, { TopNavbarProgressColor } from "../top_navbar/top_navbar";
import elapsedTimeToProgressObject from "./elapsed_to_progress_object";
import HelpMe from "./help_me";
import OxMark from "./ox_mark";
import AnswerInput from "./question_box/answer_input";
import QuestionContent from "./question_box/question_content";
import { QuizProblem } from "./types";
import styles from "../../styles/quiz/solve.module.scss";
import "../../styles/common/_container.scss";

function confirmUnload(evt: Event) {
    evt.preventDefault();
    return "정말로 나가시겠습니까?";
}

type SolvePageProp = {
    session: QuizSession;
    onResultPageRequest: () => void;
};

export default function SolvePage({
    session,
    onResultPageRequest,
}: SolvePageProp) {
    const [sessionInfo, setSessionInfo] = useState<QuizSessionInfo>();
    const [problem, setProblem] = useState<QuizProblem & { index: number }>();
    const [isHelpMeVisible, setIsHelpMeVisible] = useState<boolean>(false);
    const [imageCache, setImageCache] = useState<ImageCache | null>(null);
    const [inputDisabled, setInputDisabled] = useState<boolean>(false);
    const [oxMarkType, setOxMarkType] = useState<"fail" | "ok" | null>(null);

    // 결과 페이지로 가는 함수
    const goResult = () => {
        // 결과 페이지로 갈 때는 페이지 나갈 시 뜨는 확인 대화상자가 뜨면 안 된다.
        window.removeEventListener("beforeunload", confirmUnload);
        history.replaceState(
            null,
            "",
            "/quiz/result.html?session=" +
                encodeURIComponent(session.getSessionId()),
        );

        onResultPageRequest();
    };

    // 이미지 캐시 초기화
    useEffect(() => {
        if (imageCache === null) {
            const imageCache = new ImageCache();
            session.getImageLinks().then((links) => {
                // 참고: 나오는 순서대로 넣어야 한다. (순서 뒤섞이면 안 된다.)
                for (const i of links) {
                    imageCache.pushUrl(i);
                }

                setImageCache(imageCache);
            });
        }
    }, [imageCache === null]);

    // 문제에서 캐시된 이미지를 사용하도록 하는 함수
    const problemToCachedImageProblem = (
        problem: QuizProblem & { index: number },
    ) => {
        return new Promise<QuizProblem & { index: number }>(
            async (resolve, _reject) => {
                if (imageCache === null) {
                    setTimeout(
                        () => resolve(problemToCachedImageProblem(problem)),
                        1,
                    );
                } else {
                    resolve({
                        ...problem,
                        figure:
                            problem.figureType === "image"
                                ? await imageCache.get(problem.figure)
                                : problem.figure,
                    });
                }
            },
        );
    };

    // 현재 문제 및 세션 정보 초기화
    useEffect(() => {
        if (typeof sessionInfo === "undefined")
            session.sessionInfo().then(setSessionInfo);
        if (typeof problem === "undefined")
            session.currentProblem().then((problem) => {
                if (problem === null) goResult();
                else problemToCachedImageProblem(problem).then(setProblem);
            });
    }, [sessionInfo, problem]);

    // 모의고사는 새로고침이 되도 계속 풀 수 있게 주소에 세션 id를 넣는다.
    useEffect(() => {
        if (sessionInfo?.isNerdTest === false) {
            const quizId = new URLSearchParams(location.search).get("id");
            history.replaceState(
                null,
                "",
                `/quiz/solve.html?session=${session.getSessionId()}&id=${quizId}`,
            );
        }
    }, []);

    // 디버깅용 기능
    // 개발자 도구 콘솔에서 exitNerdTest();를 치면 고인물 테스트가 남은 시간이나 남은 문제 갯수에 상관없이 강제 종료된다.
    if (nerdTestExitFeatureEnabled) {
        (window as any).exitNerdTest = () => {
            session.forcedEnd();
            goResult();
        };
    }

    // 페이지 나갈시 확인 대화상자 표시
    useEffect(() => {
        if (sessionInfo?.isNerdTest) {
            window.addEventListener("beforeunload", confirmUnload);
            return () =>
                window.removeEventListener("beforeunload", confirmUnload);
        }
    }, [sessionInfo?.isNerdTest]);

    // 고인물 테스트에서 시간 표시
    const [nerdTestProgress, setNerdTestProgress] = useState<{
        text: string;
        value: number;
        color?: TopNavbarProgressColor;
    }>({ text: "", value: 0 });
    useEffect(() => {
        const displayTimerProgress = () => {
            const elapsed = session.getStopWatch().elapsed();
            const newProgress = elapsedTimeToProgressObject(elapsed);
            if (newProgress.value >= 100) return goResult();

            setNerdTestProgress(newProgress);
        };
        if (sessionInfo?.isNerdTest) {
            const intervalId = setInterval(displayTimerProgress, 500);
            return () => clearInterval(intervalId);
        }
    }, [sessionInfo?.isNerdTest]);

    // 문제 교체하는 함수
    const renewProblem = async () => {
        const newProblem = await session.currentProblem();

        // 문제가 다 덜어졌다면 결과 페이지를 표시한다.
        if (newProblem === null) {
            return goResult();
        }

        problemToCachedImageProblem(newProblem).then(setProblem);
    };

    // OX 표시 애니메이션 함수
    const displayOxMarkAnimation = (correct: boolean) => {
        return new Promise<void>((resolve, _reject) => {
            setOxMarkType(correct ? "ok" : "fail");
            setTimeout(() => {
                setOxMarkType(null);
                resolve();
            }, 600);
        });
    };

    // 정답 제출하고 문제 교체하는 함수
    const submitAnswer = async (answer: string) => {
        if (answer === "") return;

        const correct = await session.submit(answer, problem?.choices === null);
        setInputDisabled(true);

        await displayOxMarkAnimation(correct.correct!);
        setInputDisabled(false);
        renewProblem();
    };

    // 렌더링
    return typeof sessionInfo === "undefined" ||
        typeof problem === "undefined" ? (
        <div className="main-container" id="mainContainer">
            <article>
                <FontAwesomeIcon spin icon={faSpinner}></FontAwesomeIcon>
            </article>
        </div>
    ) : (
        <div>
            <TopNavbar
                type="quiz"
                testTitle={sessionInfo?.title}
                progress={
                    sessionInfo?.isNerdTest
                        ? nerdTestProgress
                        : {
                              value:
                                  (((problem?.index ?? 1) - 1) /
                                      (sessionInfo?.totalProblemCount ?? 1)) *
                                  100,
                              text: `${problem?.index}/${sessionInfo?.totalProblemCount}`,
                          }
                }
            ></TopNavbar>
            <div id="mainContainer" className="main-container">
                <article
                    className={styles.widthEighty}
                    style={{ display: isHelpMeVisible ? "none" : "" }}
                >
                    <QuestionContent
                        index={problem.index}
                        question={problem}
                        onIdkButtonClick={() => {
                            if (sessionInfo?.isNerdTest)
                                session.getStopWatch().pause();
                            setIsHelpMeVisible(true);
                        }}
                    ></QuestionContent>
                    <AnswerInput
                        key={problem.index}
                        question={problem}
                        onSubmit={submitAnswer}
                        disabled={inputDisabled}
                    ></AnswerInput>
                </article>
                {isHelpMeVisible && (
                    <article className={styles.widthEighty}>
                        <HelpMe
                            question={problem}
                            sessionInfo={sessionInfo}
                            onHelpMeExitRequest={() => {
                                if (sessionInfo?.isNerdTest)
                                    session.getStopWatch().resume();
                                setIsHelpMeVisible(false);
                            }}
                            timerPaused={sessionInfo.isNerdTest}
                        ></HelpMe>
                    </article>
                )}
                {oxMarkType !== null && <OxMark type={oxMarkType}></OxMark>}
            </div>
        </div>
    );
}
