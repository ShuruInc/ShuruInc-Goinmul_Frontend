import { encode } from "html-entities";
import paperCorner from "../assets/paper-corner.svg";
import rankingIcon from "../assets/ranking-icon.svg";

/**
 * 고인물테스트 성적결과표 데이터
 */
type NerdTestResultElementContent = {
    nerd: true;
    /** 해시태그 */
    hashtag: string;
    /** 닉네임 */
    nickname: string;
    /** 점수 */
    points: number;
    /** 순위 */
    ranking: number;
    /** 대분류 이름 */
    topCategory: string;
};

/**
 * 모의고사 성적결과표 데이터
 */
type NonNerdTestResultElementContent = {
    nerd: false;
    /** 점수 */
    points: number;
    /** 상위 퍼센테이지 */
    percentage: number;
    /** 중분류 이름 */
    middleCategory: string;
    /** 모의고사 이름 */
    lowCategory: string;
    /** 모의고사가 포함되는 고인물 테스트의 링크 */
    nerdTestLink: {
        text: string;
        href: string;
    };
};

/**
 * 성적결과표 데이터
 */
export type ResultElementContent = {
    /** 고인물테스트 여부 */
    nerd: boolean;
    /** 시험 응시날짜 */
    date: Date;
} & (NerdTestResultElementContent | NonNerdTestResultElementContent);

/**
 * 성적결과표를 주어진 element에 만듭니다.
 * @param element 성적결과표가 만들어지는 요소
 * @param data 성적데이터
 */
export default function createResultElement(
    element: HTMLElement,
    data: ResultElementContent,
) {
    element.innerHTML = `
            <h1 class="title">
                성적통지표
            </h1>
            <h2 class="subtitle">${encode(
                data.nerd
                    ? data.topCategory + " 고인물 테스트"
                    : data.middleCategory + " 모의고사",
            )}</h2>
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
                <p class="comment"></p>
                <time>${data.date.getFullYear()}. ${
                    data.date.getMonth() + 1
                }. ${data.date.getDate()}.</time>
                <div class="logo">슈르네 고인물테스트 (인)<div class="stamp"></div></div>
            </div>
            <img class="paper-corner">
            `;

    (element.querySelector("img.paper-corner") as HTMLImageElement).src =
        paperCorner;

    // 표 데이터 ([1행 1열, 1행 2열, 1행 3,열 2행 1열, 2행 2열, 2행 3열])
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
              "등급",
              data.lowCategory,
              data.points.toString() + "점",
              //절대평가
              data.points >= 100 ? 'A+' :
              data.points >= 90 ? 'A' :
              data.points >= 80 ? 'B+' :
              data.points >= 70 ? 'B' :
              data.points >= 60 ? 'C+' :
              data.points >= 50 ? 'C' :
              data.points >= 40 ? 'D+' :
              data.points >= 30 ? 'D' :
              'F'
          ];
    const tableColumnCount = tableData.length / 2;

    // 표 생성
    const table = element.querySelector("table")!;
    for (let i = 0; i < tableColumnCount; i++) {
        table.querySelector("thead tr")!.innerHTML += `<td>${encode(
            tableData[i],
        )}</td>`;
        table.querySelector("tbody tr")!.innerHTML += `<td>${encode(
            tableData[i + tableColumnCount],
        )}</td>`;
    }

    // 문구설정
    const comment = element.querySelector(".comment")!;
    if (data.nerd) {
        const iconHtml = `<img src="${rankingIcon}" class="ranking-icon"></img>`;
        comment.innerHTML = `홈에서 ${iconHtml} 아이콘을 누르면 실시간 랭킹을 확인하실 수 있습니다.`;
    } else if (data.points === 100) {
        comment.innerHTML = `완벽합니다! <a class="nerd-test-link"></a>에 도전해 보시겠어요?`;
    } else if (data.points >= 70) {
        comment.innerHTML = `굉장합니다! <a class="nerd-test-link"></a>에 도전해 보시겠어요?`;
    } else if (data.points >= 30) {
        comment.innerHTML = `아쉽습니다!<br>더 높은 점수에 도전해 보세요.`;
    } else {
        comment.innerHTML = `아쉽습니다! 다시 도전해 보시겠어요?`;
    }

    // 고인물 테스트 링크 설정
    const nerdTestLink = comment.querySelector(
        "a.nerd-test-link",
    ) as HTMLAnchorElement;
    if (nerdTestLink !== null) {
        const { text, href } = (data as NonNerdTestResultElementContent)
            .nerdTestLink;
        nerdTestLink.textContent = text;
        nerdTestLink.href = href;
    }
}
