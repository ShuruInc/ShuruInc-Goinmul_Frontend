import "../../../styles/quiz";
import { QuizSession } from "../../api/quiz_session";
import initShareButton from "../../initShare";
import {
    addAnswerSubmitListener,
    displayCorrectnessAnimation,
    displayProblem,
    initQuizSolveUI,
    setHelpMeFriendsEventHandler,
    updateProgress,
    updateShareProblem,
} from "../../quiz-solve-ui";
import { InitTopNav } from "../../top_bottom_animation";

initQuizSolveUI();
InitTopNav();

const sessionId =
    new URLSearchParams(location.search.substring(1)).get("session") ?? "";
const session = new QuizSession(sessionId);
let shared = false;
const setShareData = initShareButton(() => (shared = true));

(async () => {
    updateProgress(0);
    const goResult = () =>
        (location.href =
            "/quiz/result.html?session=" + encodeURIComponent(sessionId));
    const sessionInfo = await session.sessionInfo();

    const renewProblem = async () => {
        const problem = await session.currentProblem();
        console.log(problem);
        if (problem === null) {
            return goResult();
        }

        displayProblem(
            document.querySelector("article")!,
            problem,
            problem.index
        );
        updateShareProblem(
            document.querySelector(".help-me .problem-box")!,
            problem,
            problem.index
        );
        setShareData({
            text: "친구들야, 도와줘!",
        });

        if (!sessionInfo.isNerdTest) {
            updateProgress(
                ((problem.index - 1) / sessionInfo.totalProblemCount!) * 100
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
    };

    addAnswerSubmitListener(async (answer) => {
        const correct = await session.submit(answer);
        displayCorrectnessAnimation(correct);

        renewProblem();
        console.log(answer);
    });

    if (sessionInfo.isNerdTest) {
        setInterval(() => {
            const percentage =
                (session.getStopWatch().elapsed() / (1000 * 60 * 5)) * 100;
            if (percentage >= 100) return goResult();

            updateProgress(percentage);
        }, 500);
    }
    renewProblem();
})();
