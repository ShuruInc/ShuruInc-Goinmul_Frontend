import classNames from "classnames";
import styles from "../../styles/post-board.module.scss";
import { ReactNode, useEffect, useRef } from "react";
import setHorizontalDragScrollOnDesktop from "../util/horizontal_drag_to_scroll_on_desktop";

type PostContainerProp = {
    landscape?: boolean;
    children: ReactNode;
};

export default function PostContainer({
    landscape,
    children,
}: PostContainerProp) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    if (!landscape) {
        useEffect(() => {
            if (containerRef.current) {
                return setHorizontalDragScrollOnDesktop(containerRef.current);
            }
        }, []);
    }

    return (
        <div
            ref={containerRef}
            className={classNames(
                styles.postContainer,
                landscape ? styles.landscape : styles.portrait,
            )}
        >
            {children}
        </div>
    );
}
