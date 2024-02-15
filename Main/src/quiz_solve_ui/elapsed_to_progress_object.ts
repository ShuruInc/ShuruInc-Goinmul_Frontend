import { TopNavbarProgressColor } from "../top_navbar/top_navbar";

export default function elapsedTimeToProgressObject(elapsed: number) {
    const totalTime = 1000 * 60 * 5;
    const percentage = (elapsed / totalTime) * 100;

    const leftTime = totalTime - elapsed;
    return {
        value: percentage,
        text: `${Math.floor(leftTime / 1000 / 60)}:${(
            Math.floor(leftTime / 1000) % 60
        )
            .toString()
            .padStart(2, "0")}`,
        // 1분 이하로 남았으면 노란색, 30초 이하로 남았으면 빨간색
        color: (leftTime < 1000 * 30
            ? "red"
            : leftTime < 1000 * 60
            ? "yellow"
            : undefined) as TopNavbarProgressColor,
    };
}
