import { Post, PostBoardSectionData } from "../../post_board";
import RandomImageUrl from "./randomImageUrl";

export const dummyCategories = {
    "K-POP": [
        "보이그룹",
        "걸그룹",
        "아이브",
        "트와이스",
        "소녀시대",
        "틴탑",
        "BTS",
    ],
    애니메이션: [
        "짱구",
        "케로로",
        "도라에몽",
        "스펀지밥",
        "패트와 매트",
        "핑구",
        "티미의 못말리는 수호천사",
    ],
    웹툰: [
        "신의탑",
        "와라! 편의점",
        "마음의 소리",
        "아스란 영웅전",
        "묵회",
        "정열맨",
        "정글고",
    ],
};
export const dummyTopCategories = Object.keys(dummyCategories);
const generateDummyPost = (title: string, href: string): Post => ({
    title,
    href,
    likes: 100,
    views: 100,
    imgUrl: RandomImageUrl(),
});
export const dummyPosts: { [key: string]: PostBoardSectionData[] } =
    Object.fromEntries(
        Object.entries(dummyCategories).map(
            ([topCategoryName, middleCategoryNames]) => [
                topCategoryName,
                [
                    {
                        landscape: generateDummyPost(
                            `${topCategoryName} 고인물 테스트 도전!`,
                            "/quiz/entry.html?id=" +
                                encodeURIComponent(`nerd-${topCategoryName}`)
                        ),
                    },
                    ...middleCategoryNames.map((i) => ({
                        title: `${i} 모의고사`,
                        portraits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) =>
                            generateDummyPost(
                                `${i} 모의고사 ${j}탄`,
                                `/quiz/entry.html?id=` +
                                    encodeURIComponent(
                                        `quiz-${topCategoryName}-${i}-${j}`
                                    )
                            )
                        ),
                    })),
                ],
            ]
        )
    );
