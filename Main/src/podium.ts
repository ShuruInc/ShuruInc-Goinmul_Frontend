import styles from "../styles/index_page/podium.module.scss";
import { RankingItem } from "./home_post_board";
import CooperMedal from "../assets/ranking-section-medal/cooper.svg";
import SilverMedal from "../assets/ranking-section-medal/silver.svg";
import GoldMedal from "../assets/ranking-section-medal/gold.svg";
import commaNumber from "comma-number";

export default function createPodium([first, second, third]: RankingItem[]) {
    const nicknameAndHashtag = (data: RankingItem) =>
        typeof data === "undefined" ? "" : `${data.nickname}#${data.hashtag}`;
    const formatScore = (data?: RankingItem) =>
        typeof data?.score === "undefined"
            ? ""
            : commaNumber(data.score) + "점";

    const podium = document.createElement("div");
    podium.className = styles.podium;
    podium.innerHTML = `
        <div class="${styles.side}">
            <img src="${SilverMedal}">
            <div class="${styles.line}">
                <div class="${styles.circle}">
                    2
                </div>
                <div class="${styles.nicknameAndScore}">
                    <div class="${styles.nickname}">${nicknameAndHashtag(
                        second,
                    )}</div>
                    <div class="${styles.score}">${formatScore(second)}</div>
                </div>
            </div>
        </div>
        <div class="${styles.center}">
            <div class="${styles.lightingMedal}">
                <div class="${styles.light}"></div>
                <img src="${GoldMedal}">
            </div>
            <div class="${styles.line}">
                <div class="${styles.circle}">
                    1
                </div>
                <div class="${styles.nicknameAndScore}">
                    <div style="font-weight: 600;" class="${styles.nickname}">${nicknameAndHashtag(
                        first,
                    )}</div>
                    <div style="font-weight: 600;" class="${styles.score}">${formatScore(first)}</div>
                </div>
            </div>
        </div>
        <div class="${styles.side}">
            <img src="${CooperMedal}">
            <div class="${styles.line}">
                <div class="${styles.circle}">
                    3
                </div>
                <div class="${styles.nicknameAndScore}">
                    <div class="${styles.nickname}">${nicknameAndHashtag(
                        third,
                    )}</div>
                    <div class="${styles.score}">${formatScore(third)}</div>
                </div>
            </div>
        </div>`;

    return podium;
}
