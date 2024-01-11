type TimerInternalState = Partial<{
    startedAt: number;
    negativeDelta: number;
    pausedAt: number;
    stoppedAt: number;
}>;

export default class StopWatch {
    private id: string;
    constructor(id: string) {
        this.id = id;
    }
    private getInternalState(): TimerInternalState {
        return JSON.parse(localStorage.getItem(`stopwatch-${this.id}`) ?? "{}");
    }
    private setInternalState(state: TimerInternalState) {
        localStorage.setItem(`stopwatch-${this.id}`, JSON.stringify(state));
    }

    start() {
        if (typeof this.getInternalState().startedAt === "undefined")
            this.setInternalState({
                ...this.getInternalState(),
                startedAt: Date.now(),
            });
    }
    pause() {
        this.setInternalState({
            ...this.getInternalState(),
            pausedAt: Date.now(),
        });
    }
    resume() {
        let state = this.getInternalState();
        if (typeof state.pausedAt === "undefined") return;

        state.negativeDelta =
            (state.negativeDelta ?? 0) + (Date.now() - state.pausedAt);
        delete state.pausedAt;

        this.setInternalState(state);
    }
    stop() {
        this.setInternalState({
            ...this.getInternalState(),
            stoppedAt: Date.now(),
        });
    }
    elapsed() {
        const state = this.getInternalState(),
            now = Date.now();
        return (
            (state.stoppedAt ?? state.pausedAt ?? now) -
            (state.startedAt ?? now) -
            (state.negativeDelta ?? 0)
        );
    }
}
