import { encode } from "html-entities";
import goldMedal from "../assets/medal/gold.png";
import silverMedal from "../assets/medal/silver.png";
import cooperMedal from "../assets/medal/cooper.png";
import { randomMedalEnabled } from "./env";
import paperCorner from "../assets/paper-corner.svg";
import rankingIcon from "../assets/ranking-icon.svg";

type NerdTestResultElementContent = {
    nerd: true;
    hashtag: string;
    nickname: string;
    points: number;
    ranking: number;
    topCategory: string;
};

type NonNerdTestResultElementContent = {
    nerd: false;
    points: number;
    percentage: number;
    middleCategory: string;
    lowCategory: string;
    link: {
        text: string;
        href: string;
    };
};

type ResultElementContent = {
    nerd: boolean;
    date: Date;
} & (NerdTestResultElementContent | NonNerdTestResultElementContent);

export default function createResultElement(
    element: HTMLElement,
    data: ResultElementContent,
) {
    element.innerHTML = `
            <h1 class="title">
                <div class="subtitle">${encode(
                    data.nerd
                        ? data.topCategory + " 고인물 테스트"
                        : data.middleCategory + " 모의고사",
                )}</div>
                성적통지표
            </h1>
            <div class="content">
                <table>
                    <thead>
                        <tr>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        </tr>
                    </tbody>
                </table>
                <time>${data.date.getFullYear()}. ${
                    data.date.getMonth() + 1
                }. ${data.date.getDate()}.</time>
                <p class="comment"></p>
            </div>
            <img class="paper-corner">
            `;

    let medal = null;
    (element.querySelector("img.paper-corner") as HTMLImageElement).src =
        paperCorner;
    switch (
        randomMedalEnabled
            ? Math.floor(Math.random() * 3) + 1
            : data.nerd
            ? data.ranking
            : 0
    ) {
        case 1:
            medal = goldMedal;
            break;
        case 2:
            medal = silverMedal;
            break;
        case 3:
            medal = cooperMedal;
            break;
    }
    if (medal !== null) {
        element.querySelector(
            ".title",
        )!.innerHTML += `<div class="medal"><img src="${encode(medal)}"></div>`;
    }

    const table = element.querySelector("table")!;
    const tableData = data.nerd
        ? [
              "수험번호",
              "성명",
              "점수",
              "랭킹",
              "#" + data.hashtag,
              data.nickname,
              data.points.toString() + "점",
              data.ranking.toString() + "등",
          ]
        : [
              "과목명",
              "점수",
              "상위",
              data.lowCategory,
              data.points.toString() + "점",
              data.percentage.toString() + "%",
          ];
    const tableColumnCount = tableData.length / 2;

    for (let i = 0; i < tableColumnCount; i++) {
        table.querySelector("thead tr")!.innerHTML += `<td>${encode(
            tableData[i],
        )}</td>`;
        table.querySelector("tbody tr")!.innerHTML += `<td>${encode(
            tableData[i + tableColumnCount],
        )}</td>`;
    }

    const comment = element.querySelector(".comment")!;
    if (data.nerd) {
        const iconHtml = `<img src="${rankingIcon}" class="ranking-icon"></img>`;
        comment.innerHTML = `왼족 상단의 ${iconHtml} 버튼을 누르면 실시간 랭킹을 확인할 수 있습니다.`;
    } else if (data.points === 100) {
        comment.innerHTML = `완벽합니다! <a class="nerd-test-link"></a>에 도전해 보시겠어요?`;
    } else if (data.points >= 70) {
        comment.innerHTML = `굉장합니다! <a class="nerd-test-link"></a>에 도전해 보시겠어요?`;
    } else if (data.points >= 30) {
        comment.innerHTML = `휼룡합니다!<br>더 높은 점수에 도전해 보세요.`;
    } else {
        comment.innerHTML = `아쉽습니다! 다시 도전해 보시겠어요?`;
    }

    const nerdTestLink = comment.querySelector(
        "a.nerd-test-link",
    ) as HTMLAnchorElement;
    if (nerdTestLink !== null) {
        const { text, href } = (data as NonNerdTestResultElementContent).link;
        nerdTestLink.textContent = text;
        nerdTestLink.href = href;
    }
}
