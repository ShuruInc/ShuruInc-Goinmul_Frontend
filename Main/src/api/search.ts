import { backendUrl } from "../env";
import { Post } from "../post_board";
import { Api } from "./api_http_client/Api";
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
    static async randomRecommend(count: number): Promise<Post[]> {
        const articles = (await apiClient.getArticles()).data
            .result!.filter((i) => i.articleType !== "NERD")
            .map(transformArticleDtoToPost);

        return randomPick(articles, count);
    }

    static async recommend(title: string, size: number): Promise<Post[]> {    
        const response = await apiClient.getNextArticles({ title: title, size: size });
    
        const posts = response.data.result!
            .filter((i) => i.articleType !== "NERD")
            .map(transformArticleDtoToPost);

        if(posts == null){ 
            // 인접 아티클을 조회하지 못했으면 랜덤으로 반환
            const articles = (await apiClient.getArticles()).data
            .result!.filter((i) => i.articleType !== "NERD")
            .map(transformArticleDtoToPost);
            return randomPick(articles, size);
        }

        return posts;
    }

    static async hotMakeTestRequests(count: number): Promise<string[]> {
        return (await apiClient.getPopularRequestsList()).data.result!.slice(
            0,
            count,
        );
    }

    static async recommendKeyword(count: number): Promise<string[]> {
        return (await apiClient.getHashtags({ size: count })).data.result!.map(
            (i) => i.tag!,
        );
    }

    static async searchByHashtags(keyword: string): Promise<Post[]> {
        return (
            await apiClient.getArticlesRelatedToHashtags({ keyword })
        ).data.result!.map(transformArticleDtoToPost);
    }

    static async search(query: string): Promise<SearchResult> {
        if (query.length > 30) query = query.substring(0, 30);
        return {
            result: (
                await apiClient.getArticles({ keyword: query })
            ).data.result!.map(transformArticleDtoToPost),
            similar: await this.searchByHashtags(query),
        };
    }

    static async requestMakeTest(query: string): Promise<void> {
        await PostBoardApiClient.requestMakeTest(query);
    }
}
