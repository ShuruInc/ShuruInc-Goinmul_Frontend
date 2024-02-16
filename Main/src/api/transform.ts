import { backendUrl } from "../env";
import { Post } from "../post_board/types";
import { ArticleDto } from "./api_http_client/data-contracts";

export function transformArticleDtoToPost(article: ArticleDto): Post {
    return {
        title: article.title!,
        imgUrl: backendUrl + "/" + article.imgUrl,
        href: `/quiz/solve.html?id=${encodeURIComponent(article.id!)}`,
        likes: article.likes!,
        views: article.views!,
        id: article.id!,
    };
}
