import { backendUrl } from "../env";
import { MainPostBoardData } from "../home_post_board";
import { PostBoardSectionData } from "../post_board";
import { Api } from "./api_http_client/Api";
import { transformArticleDtoToPost } from "./transform";

export type PostBoardData = {
    id: string;
    title: string;
    fetchNextSection: () => Promise<PostBoardSectionData | null>;
};

const apiClient = new Api({ baseUrl: backendUrl });

export default class PostBoardApiClient {
    static async getMainBoard(): Promise<MainPostBoardData> {
        return {
            popularTests: await Promise.all(
                [1, 2, 3, 4, 5, 6, 7, 8]
                    .map(async (i) => apiClient.getArticle(i))
                    .map(async (i) => (await i).data)
                    .map(async (i) =>
                        transformArticleDtoToPost((await i).result!),
                    ),
            ),
            rankings: Object.fromEntries(
                (await apiClient.getRanks()).data.result!.map((i) => [
                    i.categoryNm + " 모의고사",
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
        const firstCategories = await apiClient.getFirstCategories();
        if (firstCategories.ok) {
            const result = (
                await Promise.all(
                    firstCategories.data.result!.map(async (i) => {
                        const secondCategoriesResponse =
                            await apiClient.getSecondCategories(i.id!);
                        const secondCategories =
                            secondCategoriesResponse.data.result!;
                        console.log(secondCategories);
                        return { firstCategory: i, secondCategories };
                    }),
                )
            ).map(({ firstCategory, secondCategories }) => {
                let nerd = true;
                return {
                    id: firstCategory.id!.toString(),
                    title: firstCategory.categoryNm!,
                    async fetchNextSection() {
                        if (nerd) {
                            const articles =
                                await apiClient.getArticlesBySecCategory(
                                    firstCategory.id!,
                                );
                            nerd = false;

                            return {
                                title: "",
                                landscape: transformArticleDtoToPost(
                                    articles.data.result![0]!,
                                ),
                            };
                        }
                        let secondCategory = secondCategories.shift();
                        if (typeof secondCategory === "undefined") return null;

                        const articles =
                            await apiClient.getArticlesBySecCategory(
                                secondCategory.id!,
                            );

                        return {
                            title: secondCategory.categoryNm! + " 모의고사",
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

    static async like(articleId: string | number): Promise<boolean> {
        const result = await apiClient.likeArticle(
            typeof articleId === "string" ? parseInt(articleId) : articleId,
        );
        return result.ok;
    }

    static async requestMakeTest(keyword: string): Promise<void> {
        await apiClient.postKeyword({ keyword });
    }

    static async hit(articleId: string) {
        await apiClient.viewArticle(parseInt(articleId));
    }
}
