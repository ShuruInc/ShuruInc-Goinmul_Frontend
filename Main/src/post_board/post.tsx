import classNames from "classnames";
import styles from "../../styles/post-board.module.scss";
import { useCallback, useState } from "react";
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

    // 배경 이미지 lazy-loading
    const setupLazyloadAndHit = useCallback((node: HTMLElement | null) => {
        if (node) {
            if (lazyBackground) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        if (
                            entries.some((i) => i.isIntersecting) &&
                            !loadBackgroundImage
                        )
                            setLoadBackgroundImage(true);
                    },
                    {
                        rootMargin: "10% 10% 10% 10%",
                    },
                );
                observer.observe(node);
            }

            if (onThumbnailVisible) {
                let hitted = false;
                const observer = new IntersectionObserver((entries) => {
                    const intersecting =
                        entries.length > 0 &&
                        entries.some((i) => i.isIntersecting);
                    if (intersecting && !hitted) {
                        setTimeout(onThumbnailVisible, 1);
                        hitted = true;
                    } else if (!intersecting) {
                        hitted = false;
                    }
                });
                observer.observe(node);
            }
        }
    }, []);

    return (
        <a
            href={href}
            className={classNames(
                styles.post,
                landscape ? styles.landscape : styles.portrait,
            )}
            ref={setupLazyloadAndHit}
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
                                        : likes ?? 0}
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
