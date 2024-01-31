import { icon } from "@fortawesome/fontawesome-svg-core";
import { faRankingStar } from "@fortawesome/free-solid-svg-icons";
import { encode } from "html-entities";

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
            </div>`;

    const table = element.querySelector("table")!;
    const tableData = data.nerd
        ? [
              "수험번호",
              "성명",
              "점수",
              "랭킹",
              "#" + data.hashtag,
              data.nickname,
              data.points.toString(),
              data.ranking.toString(),
          ]
        : [
              "과목명",
              "점수",
              "상위",
              data.lowCategory,
              data.points.toString(),
              data.percentage.toString(),
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
        const iconHtml = icon(faRankingStar, { styles: { width: "1em" } })
            .html[0];
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
