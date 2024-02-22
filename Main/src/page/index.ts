import PostBoardApiClient from "../api/posts";
import createFloatingButton, {
    addFloatingButonListener,
} from "../floating_button";
import { displayMainPostBoard } from "../home_post_board";
import { setupPostBoard } from "../post_board";
import { InitTopNav, SetCustomRankingHandler } from "../top_logo_navbar";
import SmoothScrollbar from "smooth-scrollbar";
import PrepareHorizontalInfiniteScrollLayout from "../prepare_horizontal_infinite_scroll_layout";

createFloatingButton("home");

(async () => {
    return {
        mainBoard: await PostBoardApiClient.getMainBoard(),
        postBoards: await PostBoardApiClient.getPostBoards(),
    };
})()
    .then((data) => {
        return [
            {
                label: "HOME",
                id: "home",
                prepare(element: HTMLElement) {
                    element.classList.add("main");

                    displayMainPostBoard(element, data.mainBoard);
                },
            },
            ...data.postBoards.map((i) => ({
                label: i.title,
                id: i.id,
                prepare(element: HTMLElement) {
                    setupPostBoard(element, i.fetchNextSection);
                },
            })),
        ];
    })
    .then(PrepareHorizontalInfiniteScrollLayout)
    .then(({ scroller, categoryNav }) => {
        // Post board column의 좌우 스크롤
        // 상하 스크롤시 플로팅버튼을 변경한다.
        scroller.addEventListenerToChildren("scroll", (evt) => {
            const target = evt.target as HTMLElement;
            if (target.scrollTop !== 0) createFloatingButton("up");
            else createFloatingButton("home");
        });

        //let _contentScrollerScrollingByUserDrag = false;
        // 좌우 스크롤시 플로팅버튼을 변경한다.
        scroller.addScrollEventListener(() => {
            if (
                scroller.getCurrentlyMostVisibleChild(false)?.dataset?.key !==
                "home"
            ) {
                createFloatingButton("home");
            } else {
                createFloatingButton(
                    document.querySelector(".column.main")?.scrollTop === 0
                        ? "home"
                        : "up",
                );
            }
        });

        // 플로팅 버튼 동작 설정
        addFloatingButonListener(() => {
            const currentVisibleChild =
                scroller.getCurrentlyMostVisibleChild(true);
            if (currentVisibleChild === null) return;

            if (currentVisibleChild.scrollTop !== 0)
                currentVisibleChild.scrollTo({ top: 0, behavior: "smooth" });
            else if (currentVisibleChild.dataset.key !== "home")
                scroller.scrollIntoCenterView(
                    document.querySelector(".column.main")!,
                    true,
                );
        });

        const goToRankings = () => {
            if (
                scroller.getCurrentlyMostVisibleChild(true)?.dataset?.key !==
                "home"
            ) {
                let sign = scroller.scrollIntoCenterView(
                    document.querySelector(".column.main")!,
                    true,
                );
                categoryNav.activateButtonByKey("home", true, sign);
            }
            const tryScroll: () => void = () => {
                const scrollBar = SmoothScrollbar.get(
                    document.querySelector(".column.main [data-scrollbar]")!,
                );

                const h2 = document.querySelector(
                    ".column.main section.ranking-section h2",
                ) as HTMLElement;
                const rect = h2?.getBoundingClientRect()!;
                if (rect.width === 0 || rect.height === 0)
                    return setTimeout(tryScroll, 1);

                // 여백(150)을 안 주면 viewport 맨 위에 딱 맞아서 상단 로고 nav에 가려진다
                scrollBar?.scrollIntoView(h2, { offsetTop: 150 });
            };
            // Q. 왜 400ms인가요?
            // A. 너무 짧으면 상단 카테고리 버튼 스크롤링이 중간에 멈추는 버그가 발생한다.
            setTimeout(tryScroll, 400);
        };
        SetCustomRankingHandler(goToRankings);

        if (location.hash.includes("ranking")) goToRankings();

        InitTopNav(true);
    });
