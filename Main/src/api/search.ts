import { Post } from "../post_board";
import { dummyPosts } from "./dummy_data/posts";

type SearchResult = {
    result: Post[];
    similar: Post[];
};

const randomPick = <T>(arr: T[], count: number): T[] => {
    let result = [],
        clonedArr = [...arr];
    for (let i = 0; i < count && clonedArr.length > 0; i++) {
        result.push(
            clonedArr.splice(Math.floor(Math.random() * clonedArr.length), 1)[0]
        );
    }

    return result;
};

export default class SearchApiClient {
    static async recommend(count: number): Promise<Post[]> {
        const posts = Object.values(dummyPosts)
            .reduce((pv, cv) => pv.concat(cv), [])
            .map((i) => i.portraits ?? [])
            .reduce((pv, cv) => pv.concat(cv), []);

        let result = [];
        for (let i = 0; i < count && posts.length > 0; i++) {
            result.push(
                posts.splice(Math.floor(Math.random() * posts.length), 1)[0]
            );
        }

        return result;
    }

    static async hotQueries(count: number): Promise<string[]> {
        const titles = Object.entries(dummyPosts).reduce((pv, cv) => {
            pv.push(cv[0]);
            pv = pv.concat(
                cv[1].reduce((pv, cv) => {
                    if (cv.title) pv.push(cv.title);

                    if (cv.landscape) pv.push(cv.landscape.title);

                    if (cv.portraits)
                        pv = pv.concat(cv.portraits.map((i) => i.title));

                    return pv;
                }, [] as string[])
            );

            return pv;
        }, [] as string[]);

        return randomPick(titles, count);
    }

    static async recommendKeyword(count: number): Promise<string[]> {
        const words = Object.entries(dummyPosts)
            .reduce((pv, cv) => {
                pv.push(cv[0]);
                pv = pv.concat(
                    cv[1].reduce((pv, cv) => {
                        if (cv.title) pv.push(cv.title);

                        if (cv.landscape) pv.push(cv.landscape.title);

                        if (cv.portraits)
                            pv = pv.concat(cv.portraits.map((i) => i.title));

                        return pv;
                    }, [] as string[])
                );

                return pv;
            }, [] as string[])
            .reduce((pv, cv) => {
                pv = pv.concat(cv.split(" "));
                return pv;
            }, [] as string[])
            .reduce((pv, cv) => {
                if (!pv.includes(cv)) pv.push(cv);

                return pv;
            }, [] as string[]);

        return randomPick(words, count);
    }

    static async search(query: string): Promise<SearchResult> {
        const result = Object.entries(dummyPosts).reduce((pv, cv) => {
            pv = pv.concat(
                cv[1].reduce((pv, cv) => {
                    if (cv.title?.includes(query)) {
                        if (cv.landscape) pv.push(cv.landscape);
                        if (cv.portraits) pv = pv.concat(cv.portraits);
                    } else {
                        if (cv.landscape?.title?.includes(query))
                            pv.push(cv.landscape);

                        if (cv.portraits)
                            pv = pv.concat(
                                cv.portraits.filter((i) =>
                                    i.title.includes(query)
                                )
                            );
                    }
                    return pv;
                }, [] as Post[])
            );

            return pv;
        }, [] as Post[]);

        return {
            result,
            similar: await this.recommend(10),
        };
    }

    static async requestMakeTest(query: string): Promise<void> {
        console.log(`requested: ${query}`);
    }
}
