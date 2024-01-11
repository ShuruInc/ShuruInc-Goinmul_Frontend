import { MainPostBoardData } from "../home_post_board";
import { PostBoardSectionData } from "../post_board";
import { dummyPosts, dummyTopCategories } from "./dummy_data/posts";

export type PostBoardData = {
    id: string;
    title: string;
    fetchNextSection: () => Promise<PostBoardSectionData | null>;
};

function randomPick<T>(arr: T[], count: number): T[] {
    let result = [],
        newArr = [...arr];
    while (result.length < count && newArr.length > 0)
        result.push(newArr.splice(Math.random() * newArr.length, 1)[0]);

    return result;
}

export default class PostBoardApiClient {
    static async getMainBoard(): Promise<MainPostBoardData> {
        const dummyNicknames =
            "Curabitur et pharetra nisi. Mauris sapien leo, dictum porttitor diam ut, mollis dictum urna. Maecenas hendrerit sapien dui, eu sagittis ipsum porttitor non. Nullam vehicula consequat lorem a egestas. Donec sapien ante, placerat eget gravida in, tristique vitae risus. Suspendisse mattis, ipsum."
                .replace(/[.,]/g, "")
                .split(" ");
        return {
            popularTests: randomPick(
                Object.values(dummyPosts)
                    .reduce((pv, cv) => pv.concat(cv), [])
                    .map((i) => i.portraits ?? [])
                    .reduce((pv, cv) => pv.concat(cv), []),
                10
            ),
            rankings: Object.fromEntries(
                dummyTopCategories.map((i, idx) => [
                    i,
                    dummyNicknames.slice(14 * idx, 14 * (idx + 1)).map((i) => ({
                        nickname: i,
                        score: Math.round(Math.random() * 100),
                        hashtag: Math.round(Math.random() * 9999).toString(),
                    })),
                ])
            ),
        };
    }
    static async getPostBoards(): Promise<PostBoardData[]> {
        return dummyTopCategories.map((title) => {
            let index = 0;
            return {
                id: title + "00",
                title,
                async fetchNextSection() {
                    let currentIdx = index++;
                    return currentIdx < dummyPosts[title].length
                        ? dummyPosts[title][currentIdx]
                        : null;
                },
            };
        });
    }
}
