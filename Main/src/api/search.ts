import { backendUrl } from "../env";
import { Post } from "../post_board";
import { Api } from "./api_http_client/ApiHttpClient";
import PostBoardApiClient from "./posts";
import { transformArticleDtoToPost } from "./transform";

type SearchResult = {
    result: Post[];
    similar: Post[];
};

const randomPick = <T>(arr: T[], count: number): T[] => {
    let result = [],
        clonedArr = [...arr];
    for (let i = 0; i < count && clonedArr.length > 0; i++) {
        result.push(
            clonedArr.splice(
                Math.floor(Math.random() * clonedArr.length),
                1,
            )[0],
        );
    }

    return result;
};

const apiClient = new Api({ baseUrl: backendUrl });

export default class SearchApiClient {
    static async recommend(count: number): Promise<Post[]> {
        const articles = (await apiClient.api.getArticles()).data
            .result!.filter((i) => i.articleType !== "NERD")
            .map(transformArticleDtoToPost);

        return randomPick(articles, count);
    }

    static async hotQueries(count: number): Promise<string[]> {
        return (await apiClient.api.getPopularSearchList()).data.result!.slice(
            0,
            count,
        );
    }

    static async recommendKeyword(count: number): Promise<string[]> {
        return (
            await apiClient.api.getHashtags({ size: count })
        ).data.result!.map((i) => i.tag!);
    }

    static async searchByHashtags(keyword: string): Promise<Post[]> {
        return (
            await apiClient.api.getArticlesRelatedToHashtags({ keyword })
        ).data.result!.map(transformArticleDtoToPost);
    }

    static async search(query: string): Promise<SearchResult> {
        return {
            result: (
                await apiClient.api.getArticles({ keyword: query })
            ).data.result!.map(transformArticleDtoToPost),
            similar: await this.searchByHashtags(query),
        };
    }

    static async requestMakeTest(query: string): Promise<void> {
        await PostBoardApiClient.requestMakeTest(query);
    }
}
