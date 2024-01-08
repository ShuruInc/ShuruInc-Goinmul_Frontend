import "../../../styles/quiz";
import {
    fillPlaceholderSectionInto,
    preparePlaceholderSection,
} from "../../post_board";

preparePlaceholderSection(document.querySelector(".post-section")!);
fillPlaceholderSectionInto(
    {
        portraits: [0, 1, 2, 3, 4, 5, 6, 7]
            .map(
                (_i) =>
                    `https://picsum.photos/200/300?${Date.now()}${Math.floor(
                        Math.random() * 1000
                    )}`
            )
            .map((imgUrl) => ({
                imgUrl,
                title: `테스트${Math.floor(Math.random() * 100)}`,
                likes: 100,
                views: 100,
            })),
    },
    document.querySelector(".post-section")!
);
