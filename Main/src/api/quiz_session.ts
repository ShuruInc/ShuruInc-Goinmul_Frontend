import { backendUrl, nerdTestExitFeatureEnabled } from "../env";
import { QuizProblem } from "../quiz_solve_ui";
import StopWatch from "../stopwatch";
import { Api } from "./api_http_client/Api";

type QuizSessionId = string;

type QuizResult = {
    quizId: string;
    points: number;
    title: string;
    hashtag?: string;
    nickname?: string;
    ranking?: number;
    percentage?: number;
    category: string;
    comment: string;
} & (
    | {
          ranking: number;
          hashtag: string;
          nickname: string;
      }
    | {
          percentage: number;
      }
);

type QuizSessionInfo = {
    isNerdTest: boolean;
    totalProblemCount?: number;
    quizId: string;
    title: string;
    category: string;
};

export type QuizInternalSessionData = {
    quizId: string;
    title: string;
    problemIndex: number;
    points: number;
    nerdTest: boolean;
    email: string;
    nickname: string;
    startedAt: number;
    postedRank: boolean;
    hashtag: string;
    category: string;
    forcedEnded: boolean;
    ranking: {
        comment: string;
        percentage: number;
        rank: number;
    } | null;
};

const apiClient = new Api({ baseUrl: backendUrl });

export class QuizSession {
    private sessionId: string = "";
    private stopwatch: StopWatch;
    private posted: boolean;
    private sentEmail: boolean;
    constructor(sessionId: QuizSessionId) {
        this.sessionId = sessionId;
        this.stopwatch = new StopWatch(sessionId);
        this.stopwatch.start();
        this.posted = false;
        this.sentEmail = false;
    }
    getStopWatch() {
        return this.stopwatch;
    }
    static hasSession(sessionId: string): boolean {
        return localStorage.getItem(`session-${sessionId}`) !== null;
    }
    private getLocalSession(): QuizInternalSessionData {
        return JSON.parse(
            localStorage.getItem(`session-${this.sessionId}`) ?? "{}",
        );
    }
    private saveLocalSession(session: QuizInternalSessionData) {
        localStorage.setItem(
            `session-${this.sessionId}`,
            JSON.stringify(session),
        );
    }
    private problems() {
        return JSON.parse(
            localStorage.getItem(`problems-${this.getLocalSession().quizId}`) ??
                "[]",
        ) as QuizProblem[];
    }
    private ended() {
        return (
            this.getLocalSession().problemIndex >= this.problems().length ||
            (this.getLocalSession().nerdTest &&
                this.stopwatch.elapsed() >= 1000 * 60 * 1) ||
            (nerdTestExitFeatureEnabled && this.getLocalSession().forcedEnded)
        );
    }
    forcedEnd() {
        this.saveLocalSession({
            ...this.getLocalSession(),
            forcedEnded: true,
        });
    }
    async sessionInfo(): Promise<QuizSessionInfo> {
        return {
            isNerdTest: this.getLocalSession().nerdTest,
            totalProblemCount: this.getLocalSession().nerdTest
                ? undefined
                : this.problems().length,
            quizId: this.getLocalSession().quizId,
            title: this.getLocalSession().title,
            category: this.getLocalSession().category,
        };
    }
    async firstCategory() {
        const quizId = this.getLocalSession().quizId;
        const article = await apiClient.getArticle(parseInt(quizId));

        const firstCategoryName = this.getLocalSession().nerdTest
            ? this.getLocalSession().category
            : article.data.result?.parentCategoryNm!;
        const firstCategoryId = (
            await apiClient.getFirstCategories()
        ).data.result!.find((i) => i.categoryNm === firstCategoryName)!.id!;

        return {
            name: firstCategoryName,
            id: firstCategoryId,
        };
    }
    async currentProblem(): Promise<(QuizProblem & { index: number }) | null> {
        return this.ended()
            ? null
            : {
                  ...this.problems()[this.getLocalSession().problemIndex],
                  index: this.getLocalSession().problemIndex + 1,
              };
    }
    async submit(
        answer: string,
        subjective: boolean,
    ): Promise<{ combo?: number; correct?: boolean; score?: number }> {
        let correct = (
            await apiClient.getAnswers((await this.currentProblem())!.id!, {
                answer,
                problemType: subjective ? "SUBJECTIVE" : "MULTIPLE_CHOICE",
            })
        ).data.result!;

        let newProblemIndex = this.getLocalSession().problemIndex + 1;
        let newPoints =
            this.getLocalSession().points + (correct.correct ? 10 : 0);
        this.saveLocalSession({
            ...this.getLocalSession(),
            problemIndex: newProblemIndex,
            points: newPoints,
        });

        return correct;
    }
    async submitEmail(email: string) {
        await apiClient.saveTempEmail({ email });

        this.sentEmail = true;
    }
    async postRank(): Promise<void> {
        const localSession = this.getLocalSession();
        if (localSession.postedRank) return;

        const result = await apiClient.postRank({
            articleId: parseInt(localSession.quizId),
            articleType: localSession.nerdTest ? "NERD" : "NORMAL",
            score: localSession.points,
        });

        const points = this.getLocalSession().nerdTest
            ? result.data.result!.score!
            : this.getLocalSession().points;

        this.saveLocalSession({
            ...localSession,
            postedRank: true,
            hashtag: result.data!.result!.nicknameHashtag!,
            ranking: {
                comment: result.data!.result!.comment!,
                percentage: result.data!.result!.percentile!,
                rank: result.data!.result!.rank!,
            },
            points,
        });
    }
    async getImageLinks(): Promise<string[]> {
        return this.problems()
            .filter((i) => i.figureType === "image")
            .map((i) => i.figure);
    }
    async result(): Promise<QuizResult | null> {
        const ended = this.ended();
        if (ended) {
            if (!this.posted) {
                await this.postRank();
                this.posted = true;
            }
            return {
                points: this.getLocalSession().points,
                title: this.getLocalSession().title,
                quizId: this.getLocalSession().quizId,
                category: this.getLocalSession().category,
                comment: this.getLocalSession().ranking!.comment ?? "",
                ...(this.getLocalSession().nerdTest
                    ? {
                          ranking: this.getLocalSession().ranking!.rank,
                          hashtag: this.getLocalSession().hashtag,
                          nickname: this.getLocalSession().nickname,
                      }
                    : {
                          percentage:
                              this.getLocalSession().ranking!.percentage,
                      }),
            };
        } else {
            return null;
        }
    }
    getSessionId(): string {
        return this.sessionId;
    }
    getSentEmail(): boolean {
        return this.sentEmail;
    }
}
