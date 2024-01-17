import "../../styles/index.scss";
import PostBoardApiClient from "../api/posts";
import createFloatingButton, {
    addFloatingButonListener,
} from "../floating_button";

import { displayMainPostBoard } from "../home_post_board";
import { HorizontalInfinityScroller } from "../lib/infinity_scroller";
import { setupPostBoard } from "../post_board";
import { InitTopNav, SetCustomRankingHandler } from "../top_logo_navbar";
import { TopCategoryButtonNav } from "../top_category_button_nav";

createFloatingButton("home");

PostBoardApiClient.getMainBoard()
    .then((mainBoardData) => {
        displayMainPostBoard(
            document.querySelector(".post-board-columns .column.main")!,
            mainBoardData,
        );
    })
    .then(PostBoardApiClient.getPostBoards)
    .then((postBoards) => {
        let buttonData = [
            {
                label: "HOME",
                key: "home",
            },
        ];
        for (const postBoard of postBoards) {
            const article = document.createElement("article");
            article.className = "column";
            article.dataset.key = postBoard.id;
            document.querySelector(".post-board-columns")?.appendChild(article);

            buttonData.push({
                label: postBoard.title,
                key: postBoard.id,
            });

            setupPostBoard(article, postBoard.fetchNextSection);
        }

        return buttonData;
    })
    .then((buttonData) => {
        const scroller = new HorizontalInfinityScroller(
            document.querySelector(".post-board-columns")!,
        );

        const categoryNav = new TopCategoryButtonNav(
            buttonData,
            document.querySelector("nav.top-category-buttons")!,
            scroller,
        );

        scroller.addEventListenerToChildren("scroll", (evt) => {
            const target = evt.target as HTMLElement;
            if (target.dataset.key === "home") {
                if (target.scrollTop !== 0) createFloatingButton("up");
                else createFloatingButton("home");
            }
        });
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
        scroller.addTouchDragScrollEventListener((key, direction) => {
            if (categoryNav._getActiveButton().dataset.key !== key)
                categoryNav.activateButtonByKey(key, true, direction);
        });

        addFloatingButonListener(() => {
            if (
                scroller.getCurrentlyMostVisibleChild(true)?.dataset?.key !==
                "home"
            ) {
                let sign = scroller.scrollIntoCenterView(
                    document.querySelector(".column.main")!,
                    true,
                );
                categoryNav.activateButtonByKey("home", true, sign);
            } else {
                document.querySelector(".column.main")!.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }
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
                const rect = document
                    .querySelector(".column.main section.ranking-section h2")
                    ?.getBoundingClientRect()!;
                if (rect.width === 0 || rect.height === 0)
                    return setTimeout(tryScroll, 1);

                const top = rect.top;

                let scrollDelta = top - 150;
                document.querySelector(".column.main")?.scrollBy({
                    top: scrollDelta,
                    behavior: "smooth",
                });
            };
            // Q. 왜 400ms인가요?
            // A. 너무 짧으면 상단 카테고리 버튼 스크롤링이 중간에 멈추는 버그가 발생한다.
            setTimeout(tryScroll, 400);
        };
        SetCustomRankingHandler(goToRankings);

        if (location.hash.includes("ranking")) goToRankings();

        InitTopNav(true);
    });
