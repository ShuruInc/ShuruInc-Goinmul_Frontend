import "../../../styles/quiz";
import { QuizSession } from "../../api/quiz";
import {
    addAnswerSubmitListener,
    displayCorrectnessAnimation,
    displayProblem,
    initQuizSolveUI,
    updateProgress,
    updateShareProblem,
} from "../../quiz-solve-ui";
import { InitTopNavImg } from "../../top_bottom_animation";

initQuizSolveUI();
InitTopNavImg();

const sessionId =
    new URLSearchParams(location.search.substring(1)).get("session") ?? "";
const session = new QuizSession(sessionId);

(async () => {
    updateProgress(0);
    const sessionInfo = await session.sessionInfo();

    const renewProblem = async () => {
        const problem = await session.currentProblem();
        console.log(problem);
        if (problem === null) {
            location.href =
                "./result.html?session=" + encodeURIComponent(sessionId);
            return;
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

        if (!sessionInfo.isNerdTest) {
            updateProgress(
                ((problem.index - 1) / sessionInfo.totalProblemCount!) * 100
            );
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
                ((Date.now() - sessionInfo.startedAt!.getTime()) /
                    (1000 * 60 * 10)) *
                100;
            if (percentage >= 100)
                return (location.href =
                    "./result.html?session=" + encodeURIComponent(sessionId));

            updateProgress(percentage);
        }, 500);
    }
    renewProblem();
})();
