import classNames from "classnames";
import styles from "../../styles/post-board.module.scss";
import PostContainer from "./post_container";
import PostView from "./post";
import PostBoardApiClient from "../api/posts";
import { Post as PostType } from "./types";

type PostSectionProp = {
    title?: string;
    landscape?: PostType;
    portraits?: PostType[];
    noPopularityInfo?: boolean;
    className?: string;
};

type PostProp = {
    post: PostType;
    landscape?: boolean;
    noPopularityInfo?: boolean;
};

function Post({ post, landscape, noPopularityInfo }: PostProp) {
    return (
        <PostView
            title={post.title}
            views={post.views}
            likes={post.likes}
            landscape={landscape}
            noPopularity={noPopularityInfo}
            onLikeRequest={() => PostBoardApiClient.like(post.id)}
            onThumbnailVisible={() => {
                PostBoardApiClient.hit(post.id.toString());
            }}
        ></PostView>
    );
}

export default function PostSection({
    title,
    landscape,
    portraits,
    noPopularityInfo,
    className,
}: PostSectionProp) {
    return (
        <div className={classNames(styles.postSection, className)}>
            {title && title !== "" && <h2>{title}</h2>}
            {landscape && (
                <PostContainer landscape>
                    <Post
                        post={landscape}
                        landscape
                        noPopularityInfo={noPopularityInfo}
                    ></Post>
                </PostContainer>
            )}
            {portraits && (
                <PostContainer>
                    {portraits.map((i) => (
                        <Post
                            post={i}
                            noPopularityInfo={noPopularityInfo}
                            key={i.id}
                        ></Post>
                    ))}
                </PostContainer>
            )}
        </div>
    );
}
