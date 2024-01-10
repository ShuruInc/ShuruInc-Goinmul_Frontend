import { Post } from "../post_board";
import { dummyPosts } from "./dummy_data/posts";

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
}
