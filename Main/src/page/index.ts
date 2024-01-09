import "../../styles/index.scss";
import PostBoardApiClient from "../api/posts";

import { displayMainPostBoard } from "../home_post_board";
import { HorizontalInfinityScroller } from "../lib/infinity_scroller";
import { setupPostBoard } from "../post_board";
import { InitTopBottomAnimation } from "../top_bottom_animation";
import { TopCategoryButtonNav } from "../top_category_button_nav";

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

        new TopCategoryButtonNav(
            buttonData,
            document.querySelector("nav.top-category-buttons")!,
            scroller
        );

        InitTopBottomAnimation();
    });
