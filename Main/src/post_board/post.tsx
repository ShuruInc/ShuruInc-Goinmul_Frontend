import classNames from "classnames";
import styles from "../../styles/post-board.module.scss";
import { useEffect, useRef, useState } from "react";
import millify from "../util/millify";

type PostProp = {
    landscape?: boolean;
    title?: string;
    noPopularity?: boolean;
    likes?: number;
    views?: number;
    href?: string;
    backgroundImageUrl?: string;
    lazyBackground?: boolean;
    onLikeRequest?: () => Promise<any>;
    onThumbnailVisible: () => void;
};

export default function PostView({
    landscape,
    title,
    noPopularity,
    likes,
    views,
    href,
    lazyBackground,
    backgroundImageUrl,
    onLikeRequest,
    onThumbnailVisible,
}: PostProp) {
    const [loadBackgroundImage, setLoadBackgroundImage] = useState<boolean>(
        lazyBackground ? false : true,
    );
    const [liked, setLiked] = useState<boolean>(false);
    const postRef = useRef<HTMLAnchorElement>(null);

    // 배경 이미지 lazy-loading
    useEffect(() => {
        if (lazyBackground && postRef.current) {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries.some((i) => i.isIntersecting))
                        setLoadBackgroundImage(true);
                },
                {
                    root: postRef.current,
                    rootMargin: "10% 10% 10% 10%",
                },
            );

            return () => observer.disconnect();
        }
    }, [lazyBackground]);

    useEffect(() => {
        if (onThumbnailVisible) {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries.some((i) => i.isIntersecting))
                        onThumbnailVisible();
                },
                {
                    root: postRef.current,
                },
            );

            return () => observer.disconnect();
        }
    }, [onThumbnailVisible]);

    return (
        <a
            href={href}
            className={classNames(
                styles.post,
                landscape ? styles.landscape : styles.portrait,
            )}
            style={{
                backgroundImage:
                    loadBackgroundImage || !lazyBackground
                        ? `url(${backgroundImageUrl})`
                        : "",
            }}
        >
            <div className={styles.cellInfo}>
                <div className={styles.title}>{title}</div>
                {!noPopularity && (
                    <div className={styles.popularity}>
                        <a
                            href="#"
                            className={styles.likesLink}
                            onClick={(evt) => {
                                evt.preventDefault();
                                if (onLikeRequest)
                                    onLikeRequest().then(() => setLiked(true));
                            }}
                        >
                            <div
                                className={classNames(
                                    styles.likes,
                                    liked && styles.liked,
                                )}
                            >
                                <span>
                                    {liked
                                        ? ":D"
                                        : likes
                                        ? millify(likes)
                                        : "?"}
                                </span>
                            </div>
                        </a>
                        <div className={styles.views}>
                            <span>{views ? millify(views) : "?"}</span>
                        </div>
                    </div>
                )}
            </div>
        </a>
    );
}
