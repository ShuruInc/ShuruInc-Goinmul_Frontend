import { useEffect, useRef, useState } from "react";
import { Post } from "./types";
import { Scrollbar as ReactSmoothScrollbar } from "smooth-scrollbar-react";
import Scrollbar from "smooth-scrollbar";
import PostSection from "./post_section";
import Footer from "../footer";

export type PostBoardSectionData = Partial<{
    title: string;
    landscape: Post;
    portraits: Post[];
}>;

type PostBoadProp = {
    getNextSection: () => Promise<PostBoardSectionData | null>;
};

export default function PostBoard({ getNextSection }: PostBoadProp) {
    const [fetchedAll, setFetchedAll] = useState<boolean>(false);
    const [sections, setSections] = useState<PostBoardSectionData[]>([]);
    const scrollbarRef = useRef<Scrollbar>(null);

    useEffect(() => {
        if (!fetchedAll) {
            getNextSection().then((newSections) => {
                if (newSections) setSections([...sections, newSections]);
                else setFetchedAll(true);
            });
        }
    }, [sections]);

    useEffect(() => {
        if (scrollbarRef.current)
            scrollbarRef.current.track.yAxis.element.remove();
    });

    return (
        <ReactSmoothScrollbar ref={scrollbarRef} style={{ height: "100vh" }}>
            {sections.map((i) => (
                <PostSection
                    title={i.title}
                    landscape={i.landscape}
                    portraits={i.portraits}
                ></PostSection>
            ))}
            {fetchedAll && <Footer></Footer>}
        </ReactSmoothScrollbar>
    );
}
