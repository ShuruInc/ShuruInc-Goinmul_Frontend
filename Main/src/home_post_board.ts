import { encode } from "html-entities";
import footer from "./footer";
import { createPodium } from "./podium";
import {
    Post,
    fillPlaceholderSectionInto,
    preparePlaceholderSection,
} from "./post_board";
import setHorizontalDragScrollOnDesktop from "./horizontal_drag_to_scroll_on_desktop";
import SmoothScrollbar from "smooth-scrollbar";
import "./smooth-scrollbar-scroll-lock-plugin";

/**
 * 랭킹 아이템
 */
export type RankingItem = {
    nickname: string;
    hashtag: string;
    score: number;
};

/**
 * 메인 post board에서 표시될 데이터
 */
export type MainPostBoardData = {
    /** 인기 BEST 테스트 데이터 */
    popularTests: Post[];
    /** 명예의 전당 데이터 */
    rankings: { [key: string]: RankingItem[] };
};

/**
 * 랭킹을 표시하는 section DOM 요소를 만듭니다.
 * @param title 제목
 * @param data 랭킹
 */
export function createRankingSection(title: string, data: RankingItem[]) {
    const nicknameAndHashtag = (data: RankingItem) =>
        `${data.nickname}#${data.hashtag}`;
    const section = document.createElement("section");
    console.log(data);

    section.className = "ranking-section";
    section.innerHTML = `<h2></h2>
    <img class="podium">
    <div class="more">
    </div>
    `;

    const podium = createPodium(
        data.length < 1 ? "" : nicknameAndHashtag(data[0]),
        data.length < 2 ? "" : nicknameAndHashtag(data[1]),
        data.length < 3 ? "" : nicknameAndHashtag(data[2]),
    );
    data.splice(0, 3);
    (section.querySelector("img.podium") as HTMLImageElement).src = podium;
    section.querySelector("h2")!.textContent = title;
    const more = section.querySelector(".more") as HTMLElement;
    setHorizontalDragScrollOnDesktop(more);

    let start = 4;
    while (data.length > 0) {
        const three = data.splice(0, 3);
        const column = document.createElement("div");
        column.className = "more-column";

        const ol = document.createElement("ol");
        ol.start = start;
        three
            .map((i, idx) => {
                const li = document.createElement("li");
                li.innerHTML = `<div class="marker">${
                    start + idx
                }</div><div>${encode(
                    i.nickname,
                )}<span class="hashtag">#${encode(i.hashtag)}</span> (${
                    i.score
                }점)</div>`;
                return li;
            })
            .forEach((i) => ol.appendChild(i));

        column.appendChild(ol);
        more.appendChild(column);
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
    data: MainPostBoardData,
) {
    const columnScrollbar = document.createElement("div");
    columnScrollbar.style.height = "100vh";
    element.appendChild(columnScrollbar);

    // Smooth-scrollbar를 쓴다.
    const scrollbar = SmoothScrollbar.init(columnScrollbar, {
        alwaysShowTracks: false,
    });
    scrollbar.track.yAxis.element.remove();
    const column = scrollbar.contentEl;

    column.innerHTML = `<section class="post-section"></section>`;
    preparePlaceholderSection(column.querySelector(".post-section")!, [
        { landscape: true, count: 1 },
        { landscape: false, count: data.popularTests.length - 1 },
    ]);
    fillPlaceholderSectionInto(
        {
            title: "인기 BEST",
            landscape: data.popularTests[0],
            portraits: data.popularTests.slice(1),
        },
        column.querySelector(".post-section")!,
        true,
    );
    for (const i in data.rankings) {
        const rankingSection = createRankingSection(i, data.rankings[i]);
        column.appendChild(rankingSection);
    }
    column.appendChild(footer());
}
