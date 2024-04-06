import footer from "./footer";
import createPodium from "./podium";
import {
    Post,
    fillPlaceholderSectionInto,
    preparePlaceholderSection,
} from "./post_board";
import "./smooth-scrollbar-scroll-lock-plugin";
import rankingSectionHeaderImg from "../assets/rankings-heading-bottom-line.svg";
import rankingSectionStyles from "../styles/index_page/ranking-section.module.scss";
import SmoothScrollbar, { ScrollbarPlugin } from "smooth-scrollbar";
// import { isMobile } from "./is_mobile";

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
    const section = document.createElement("section");

    section.className = rankingSectionStyles.rankingSection;
    section.innerHTML = `<h2></h2>
    <img src="${rankingSectionHeaderImg}" class="${rankingSectionStyles.separator}">
    <div class="podium"></div>
    `;
    
    section.replaceChild(
        createPodium(data.slice(0, 3)),
        section.querySelector(".podium")!,
    );

    data.splice(0, 3);
    section.querySelector("h2")!.textContent = title;

    return section;
}


class MobilePlugin extends ScrollbarPlugin {
    static pluginName = 'mobile';
    static defaultOptions = {
        speed: 0.5,
    };

    transformDelta(delta: any, fromEvent: any) {
        if (fromEvent.type !== 'touchend') {
            return delta;
        }

        return {
            x: delta.x * this.options.speed,
            y: delta.y * this.options.speed,
        };
    }
}


SmoothScrollbar.use(MobilePlugin);

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
        damping: 0.2,
        plugins: {
            mobile: { // this is optional
                speed: 0.2,
            },
        },
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
