import "../../../styles/quiz";
import { QuizApiClient } from "../../api/quiz";
import viewBody from "../../view_page.html";
import PostBoardApiClient from "../../api/posts";
import { createAnswerElementForShare, createQuestionElement } from "../../quiz_solve_ui";

const params = new URLSearchParams(location.search.substring(1));
const quizId = params.get("id");
const problemId = params.get("problem");

const init = async () => {
    if (quizId !== null) {
        await PostBoardApiClient.hit(quizId);
        
        document.body.innerHTML = viewBody;

        const session = await QuizApiClient.startQuiz(quizId);
        const sessionInfo = await session.sessionInfo();
        const problems = session.getProblems();
        const problem = problems.find((p) => p.id.toString() === problemId);

        if (problem === undefined) {
            alert('문제를 찾을 수 없습니다.');
            
            window.location.href = '/';

            return;
        }

        document.querySelector('.go-back')?.addEventListener('click', (evt) => {
            evt.preventDefault();

            location.href = '/';
        });

        document.querySelector('.test-title')!.textContent = sessionInfo.title;

        const container = document.querySelector('article')!;

        const questionElement = createQuestionElement(problem, 1);
        questionElement.classList.add('help-me');

        const answerElement = createAnswerElementForShare(problem);

        const answerContainerElement = document.createElement('div');
        answerContainerElement.classList.add('answer');

        const answerButtonContainerElement = document.createElement('div');
        answerButtonContainerElement.id = 'answerButtons';
        answerButtonContainerElement.classList.add('row');

        const startButtonElement = document.createElement('button');
        startButtonElement.classList.add('submit');
        startButtonElement.type = 'submit';
        startButtonElement.textContent = '나도 풀어보기';
        startButtonElement.addEventListener('click', () => {
            window.location.href = `/quiz/solve.html?id=${quizId}`;
        });

        answerButtonContainerElement.appendChild(startButtonElement);

        container.appendChild(questionElement);
        questionElement.querySelector('.problem-paper-box')?.appendChild(answerElement);
        container.appendChild(answerButtonContainerElement);

        document.getElementById('idkCount')?.remove();
    } else {
        alert('오류가 발생했습니다.');
            
        window.location.href = '/';

        return;
    }
};

init();

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
