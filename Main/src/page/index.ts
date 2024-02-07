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
        // HOME을 렌더링한다.
        displayMainPostBoard(
            document.querySelector(".post-board-columns .column.main")!,
            mainBoardData,
        );
    })
    .then(PostBoardApiClient.getPostBoards)
    .then((postBoards) => {
        // 상단 카테고리 버튼에 HOME을 추가한다.
        let buttonData = [
            {
                label: "HOME",
                key: "home",
            },
        ];
        // HOME이 아닌 다른 것들을 렌더링한다.
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
        // Post board column의 좌우 스크롤
        const scroller = new HorizontalInfinityScroller(
            document.querySelector(".post-board-columns")!,
        );

        // 상단 카테고리 버튼 nav의 좌우 스크롤
        const categoryNav = new TopCategoryButtonNav(
            buttonData,
            document.querySelector("nav.top-category-buttons")!,
            scroller,
        );

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

            //_contentScrollerScrollingByUserDrag = byUserDrag;
            const basis = scroller.centerEnsuredBasis();
            categoryNav.activateWithMarginToBasis(
                scroller._children()[basis.basisIndex].dataset.key as string,
                basis.offset! / scroller._rootWidth(),
            );
        });

        // Post board column이 좌우 스크롤됐다면 상단 카테고리 버튼도 변경하낟.
        scroller.addTouchDragScrollEventListener((key, direction) => {
            if (categoryNav._getActiveButton().dataset.key !== key)
                /**
                 * 방향(direction)을 주는 이유:
                 * Post board column의 스크롤 방향과 상단 카테고리 버튼의 스크롤 방향을
                 * 동일하게 하려고
                 */
                categoryNav.activateButtonByKey(key, true, direction);
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
                const rect = document
                    .querySelector(".column.main section.ranking-section h2")
                    ?.getBoundingClientRect()!;
                if (rect.width === 0 || rect.height === 0)
                    return setTimeout(tryScroll, 1);

                const top = rect.top;

                // 여백(150)을 안 주면 viewport 맨 위에 딱 맞아서 상단 로고 nav에 가려진다
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

        // container 밖에서 스크롤해도 container가 스크롤되도록 설정
        document.body.addEventListener("wheel", (evt) => {
            if (evt.target !== document.body) return;

            console.log(evt.deltaY);
            scroller
                .getCurrentlyMostVisibleChild()
                ?.scrollBy({ top: evt.deltaY });
        });
    });
