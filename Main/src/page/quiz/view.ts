import "../../../styles/quiz";
import { QuizApiClient } from "../../api/quiz";
import { InitTopNav } from "../../top_logo_navbar";
import initSolvePage from "../../solve_page";
import solveBody from "../../solve_page.html";
import PostBoardApiClient from "../../api/posts";
import { displayProblem } from "../../quiz_solve_ui";

InitTopNav();

const params = new URLSearchParams(location.search.substring(1));
const quizId = params.get("id");
const problemId = params.get("problem");

const initByQuizId = async () => {
    if (quizId !== null) {
        await PostBoardApiClient.hit(quizId);
        // const isNerdTest = await QuizApiClient.isNerdTest(quizId);
        const title = await QuizApiClient.getQuizTitle(quizId);
        document.querySelector(".test-title")!.textContent = title;
        
        document.body.innerHTML = solveBody;

        const session = await QuizApiClient.startQuiz(quizId);
        const problems = session.getProblems();
        const problem = problems.find((p) => p.id.toString() === problemId);

        if (problem === undefined) {
            alert("문제를 찾을 수 없습니다.");
            return;
        }

        displayProblem(
            document.querySelector("article")!,
            problem,
            1,
        );

        QuizApiClient.startQuiz(quizId).then(initSolvePage);
    } else {
        alert("오류가 발생했습니다.");
    }
};

initByQuizId();

window.addEventListener('scroll', topbarBackground);
window.addEventListener('load', topbarBackground);
window.addEventListener('DOMContentLoaded', topbarBackground);
window.addEventListener('resize', topbarBackground);
window.addEventListener('orientationchange', topbarBackground);
setInterval(topbarBackground, 100);

function topbarBackground() {
    const topbar = document.getElementById('topFixedBar');
    
    if (topbar === null) return;

    const xPosition = (document.body.clientWidth - topbar.clientWidth) / -2;
    const yPosition = (25 - window.scrollY);
    topbar.style.background = `inherit`;
    topbar.style.backgroundPositionX = `${xPosition}px`;
    topbar.style.backgroundPositionY = `${yPosition}px`;
}