import { createPodium } from "./podium";
import {
    fillPlaceholderSectionInto,
    preparePlaceholderSection,
} from "./post_board";

/**
 * 메인 post board에서 표시될 데이터
 */
export type MainPostBoardData = {
    /** 인기 BEST 테스트 데이터 */
    popularTests: {
        imgUrl: string;
        title: string;
        likes: number;
        views: number;
        href: string;
    }[];
    /** 명예의 전당 데이터 */
    rankings: { [key: string]: string[] };
};

/**
 * 랭킹을 표시하는 section DOM 요소를 만듭니다.
 * @param title 제목
 * @param data 랭킹
 */
export function createRankingSection(title: string, data: string[]) {
    const section = document.createElement("section");
    section.className = "ranking-section";
    section.innerHTML = `<h2></h2>
    <img class="podium">
    <div class="more">
    </div>
    `;

    const podium = createPodium(data[0], data[1], data[2]);
    data.splice(0, 3);
    (section.querySelector("img.podium") as HTMLImageElement).src = podium;
    section.querySelector("h2")!.textContent = title;

    let start = 4;
    while (data.length > 0) {
        const three = data.splice(0, 3);
        const column = document.createElement("div");
        column.className = "more-column";

        const ol = document.createElement("ol");
        ol.start = start;
        three
            .map((i) => {
                const li = document.createElement("li");
                li.textContent = i;
                return li;
            })
            .forEach((i) => ol.appendChild(i));

        column.appendChild(ol);
        section.querySelector(".more")!.appendChild(column);
        start += 3;
    }

    return section;
}

/**
 * 홈 post board 컨텐츠를 표시합니다.
 * @param element 표시될 요소
 * @param data 컨텐츠 데이터
 */
export function displayMainPostBoard(
    element: HTMLElement,
    data: MainPostBoardData
) {
    element.innerHTML = `<section class="post-section"></section>`;
    preparePlaceholderSection(element.querySelector(".post-section")!, [
        { landscape: true, count: 1 },
        { landscape: false, count: data.popularTests.length - 1 },
    ]);
    fillPlaceholderSectionInto(
        {
            title: "인기 BEST",
            landscape: data.popularTests[0],
            portraits: data.popularTests.slice(1),
        },
        element.querySelector(".post-section")!
    );
    for (const i in data.rankings) {
        const rankingSection = createRankingSection(i, data.rankings[i]);
        element.appendChild(rankingSection);
    }
}
