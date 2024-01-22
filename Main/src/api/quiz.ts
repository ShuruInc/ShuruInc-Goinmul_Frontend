import { backendUrl } from "../env";
import { QuizProblem } from "../quiz_solve_ui";
import { Api } from "./api_http_client/ApiHttpClient";
import { QuizSession, QuizInternalSessionData } from "./quiz_session";

const apiClient = new Api({ baseUrl: backendUrl });

export class QuizApiClient {
    static async isNerdTest(id: string): Promise<boolean> {
        return (
            (await apiClient.api.getArticle(parseInt(id))).data.result!
                .articleType === "NERD"
        );
    }

    private static async prepareQuestions(id: string, nerd = false) {
        localStorage.setItem(
            `problems-${id}`,
            JSON.stringify(
                (
                    await apiClient.api.getArticleProblems(parseInt(id))
                ).data.result!.map(
                    (i) =>
                        ({
                            choices:
                                i.choiceDtoList?.length === 0
                                    ? null
                                    : i.choiceDtoList?.map((j) => ({
                                          label: j.choiceContent,
                                          value: j.choiceContent,
                                      })),
                            figure:
                                i.problemFigure !== "" &&
                                i.problemFigure !== null
                                    ? i.problemFigure
                                    : i.imgUrl !== "" && i.imgUrl !== null
                                    ? backendUrl + "/" + i.imgUrl
                                    : null,
                            figureType:
                                i.problemFigure !== "" &&
                                i.problemFigure !== null
                                    ? "initials"
                                    : i.imgUrl !== "" && i.imgUrl !== null
                                    ? "image"
                                    : "empty",
                            points: 10,
                            question: i.problemContent,
                            id: i.problemId,
                            secondCategoryName: nerd ? i.categoryNm : "",
                            condition: i.condition,
                        }) as QuizProblem,
                ),
            ),
        );
        console.log(JSON.parse(localStorage.getItem(`problems-${id}`) ?? "[]"));
    }

    private static shakeProblems(id: string) {
        const problems: any[] = JSON.parse(
            localStorage.getItem(`problems-${id}`) ?? "[]",
        );
        const result: any[] = [];
        while (problems.length > 0) {
            result.push(
                problems.splice(
                    Math.floor(Math.random() * problems.length),
                    1,
                )[0],
            );
        }

        localStorage.setItem(`problems-${id}`, JSON.stringify(result));
    }

    static async startQuiz(id: string): Promise<QuizSession> {
        const sessionId = Date.now() + "-" + Math.floor(Math.random() * 5000);
        const title = (await apiClient.api.getArticle(parseInt(id))).data
            .result!.title!;
        await QuizApiClient.prepareQuestions(id, false);
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
                title,
            } as QuizInternalSessionData),
        );

        return new QuizSession(sessionId);
    }
    static async startNerdQuiz(
        id: string,
        info: { nickname: string; email: string },
    ): Promise<QuizSession> {
        const sessionId = Date.now() + "-" + Math.floor(Math.random() * 5000);
        const title = (await apiClient.api.getArticle(parseInt(id))).data
            .result!.title!;
        await QuizApiClient.prepareQuestions(id, true);
        this.shakeProblems(id);
        localStorage.setItem(
            `session-${sessionId}`,
            JSON.stringify({
                quizId: id,
                problemIndex: 0,
                points: 0,
                nerdTest: true,
                ...info,
                startedAt: Date.now(),
                title,
            } as QuizInternalSessionData),
        );

        return new QuizSession(sessionId);
    }
    static async sendStatistics(gender: string | null, age: string | null) {
        console.log(`received statistics: gender=${gender}, age=${age}`);
    }
}
