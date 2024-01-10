import { initDummyProblemData } from "./dummy_data/problems";
import { QuizSession } from "./quiz_session";

export class QuizApiClient {
    static async isNerdTest(id: string): Promise<boolean> {
        return id.includes("nerd");
    }

    static async startQuiz(id: string): Promise<QuizSession> {
        initDummyProblemData(id);
        const sessionId = Date.now() + "-" + Math.floor(Math.random() * 5000);
        localStorage.setItem(
            `session-${sessionId}`,
            JSON.stringify({
                quizId: id,
                problemIndex: 0,
                points: 0,
                nerdTest: false,
                email: "",
                nickname: "",
                startedAt: Date.now(),
            })
        );

        return new QuizSession(sessionId);
    }
    static async startNerdQuiz(
        id: string,
        info: { nickname: string; email: string }
    ): Promise<QuizSession> {
        initDummyProblemData(id);
        const sessionId = Date.now() + "-" + Math.floor(Math.random() * 5000);
        localStorage.setItem(
            `session-${sessionId}`,
            JSON.stringify({
                quizId: id,
                problemIndex: 0,
                points: 0,
                nerdTest: true,
                ...info,
                startedAt: Date.now(),
            })
        );

        return new QuizSession(sessionId);
    }
}
