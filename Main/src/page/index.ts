import { displayMainPostBoard } from "../home_post_board";
import { HorizontalInfinityScroller } from "../lib/infinity_scroller";
import { setupPostBoard } from "../post_board";
import { InitTopBottomAnimation } from "../top_bottom_animation";
import { TopCategoryButtonNav } from "../top_category_button_nav";

for (let i of [...document.querySelectorAll("article.column")] as HTMLElement[])
    if (i.dataset.key === "home-board")
        displayMainPostBoard(i, {
            popularTests: [0, 1, 2, 3, 4, 5, 6, 7, 8]
                .map((i) => `https://picsum.photos/200/300?${Date.now()}0${i}`)
                .map((i) => ({
                    imgUrl: i,
                    title: `테스트${Math.floor(Math.random() * 100)}`,
                    likes: 100,
                    views: 100,
                })),
            rankings: {
                "K-POP": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `사람${i}`),
                "J-POP": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `사람${i}`),
                "C-POP": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `사람${i}`),
                "COL-POP": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                    (i) => `사람${i}`
                ),
            },
        });
    else
        setupPostBoard(i, () => {
            // 랜덤 색을 생성한다.
            const randomColor = () => {
                return `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
                    Math.random() * 255
                )},${Math.floor(Math.random() * 255)})`;
            };

            const images = [];
            for (let i = 0; i < 9; i++) {
                images.push({
                    url: `https://picsum.photos/200/300?${Date.now()}0${i}1${Math.floor(
                        Math.random() * 1000
                    )}`,
                    color: randomColor(),
                });
            }
            return {
                title: `Lorem ipsum 가나다라마바사 ${[
                    ...i.parentNode!.children,
                ].indexOf(i)}`,
                landscape: {
                    bgColor: images[0].color,
                    imgUrl: images[0].url,
                    title: `테스트${Math.floor(Math.random() * 100)}`,
                    likes: 100,
                    views: 100,
                },
                portraits: images.slice(1).map((img) => ({
                    bgColor: img.color,
                    imgUrl: img.url,
                    title: `테스트${Math.floor(Math.random() * 100)}`,
                    likes: 100,
                    views: 100,
                })),
            };
        });

// 네브 데이터
const buttonData = [
    {
        label: "Home",
        key: "home-board",
    },
    {
        label: "K-POP",
        key: "article-board-0",
    },
    {
        label: "J-POP",
        key: "article-board-1",
    },
    {
        label: "C-POP",
        key: "article-board-2",
    },
];

const scroller = new HorizontalInfinityScroller(
    document.querySelector(".post-board-columns")!
);

new TopCategoryButtonNav(
    buttonData,
    document.querySelector("nav.top-category-buttons")!,
    scroller
);

InitTopBottomAnimation();
