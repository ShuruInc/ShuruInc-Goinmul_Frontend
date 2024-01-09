import "../../styles/index.scss";
import PostBoardApiClient from "../api/posts";
import createFloatingButton, {
    addFloatingButonListener,
} from "../floatingButton";

import { displayMainPostBoard } from "../home_post_board";
import { HorizontalInfinityScroller } from "../lib/infinity_scroller";
import { setupPostBoard } from "../post_board";
import { InitTopBottomAnimation } from "../top_bottom_animation";
import { TopCategoryButtonNav } from "../top_category_button_nav";

createFloatingButton("home");

PostBoardApiClient.getMainBoard()
    .then((mainBoardData) => {
        displayMainPostBoard(
            document.querySelector(".post-board-columns .column.main")!,
            mainBoardData
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
            document.querySelector(".post-board-columns")!
        );

        const categoryNav = new TopCategoryButtonNav(
            buttonData,
            document.querySelector("nav.top-category-buttons")!,
            scroller
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
                        : "up"
                );
            }
        });

        addFloatingButonListener(() => {
            if (
                scroller.getCurrentlyMostVisibleChild(true)?.dataset?.key !==
                "home"
            ) {
                let sign = scroller.scrollIntoCenterView(
                    document.querySelector(".column.main")!,
                    true
                );
                categoryNav.activateButtonByKey("home", true, sign);
            } else {
                document.querySelector(".column.main")!.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }
        });

        InitTopBottomAnimation();
    });
