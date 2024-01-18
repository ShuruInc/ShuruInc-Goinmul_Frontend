import { MainPostBoardData } from "../home_post_board";
import { PostBoardSectionData } from "../post_board";
import { Api } from "./api_http_client/ApiHttpClient";
import { transformArticleDtoToPost } from "./transform";

export type PostBoardData = {
    id: string;
    title: string;
    fetchNextSection: () => Promise<PostBoardSectionData | null>;
};

const apiClient = new Api();

export default class PostBoardApiClient {
    static async getMainBoard(): Promise<MainPostBoardData> {
        return {
            popularTests: await Promise.all(
                [1, 2, 3, 4, 5, 6, 7, 8]
                    .map(async (i) => apiClient.api.getArticle(i))
                    .map(async (i) => (await i).data)
                    .map(async (i) =>
                        transformArticleDtoToPost((await i).result!),
                    ),
            ),
            rankings: Object.fromEntries(
                (await apiClient.api.getRanks()).data.result!.map((i) => [
                    i.categoryNm,
                    i.rankDtoList!.map((i) => ({
                        nickname: i.nickname!,
                        score: i.score!,
                        hashtag: "1234",
                    })),
                ]),
            ),
        };
    }
    static async getPostBoards(): Promise<PostBoardData[]> {
        const firstCategories = await apiClient.api.getFirstCategories();
        if (firstCategories.ok) {
            const result = (
                await Promise.all(
                    firstCategories.data.result!.map(async (i) => {
                        const secondCategoriesResponse =
                            await apiClient.api.getSecondCategories(i.id!);
                        const secondCategories =
                            secondCategoriesResponse.data.result!;
                        console.log(secondCategories);
                        return { firstCategory: i, secondCategories };
                    }),
                )
            ).map(({ firstCategory, secondCategories }) => {
                return {
                    id: firstCategory.id!.toString(),
                    title: firstCategory.categoryNm!,
                    async fetchNextSection() {
                        let secondCategory = secondCategories.shift();
                        if (typeof secondCategory === "undefined") return null;

                        const articles =
                            await apiClient.api.getArticlesBySecCategory(
                                secondCategory.id!,
                            );

                        return {
                            title: secondCategory.categoryNm!,
                            portraits: articles.data.result!.map(
                                transformArticleDtoToPost,
                            ),
                        };
                    },
                };
            });

            return result;
        } else {
            throw new Error(
                "오류가 발생했습니다: " + firstCategories.data.message,
            );
        }
    }

    static async like(articleId: string | number): Promise<void> {
        await apiClient.api.likeArticle(
            typeof articleId === "string" ? parseInt(articleId) : articleId,
        );
    }
}
