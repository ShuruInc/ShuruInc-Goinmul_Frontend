import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import {
    TopCategoryButtonData,
    TopCategoryButtonNav as TopCategoryButtonNavCls,
} from "../top_category_button_nav";
import { HorizontalInfinityScroller } from "../lib/infinity_scroller";

type TopCategoryButtonNavProp = {
    getScroller: () => HorizontalInfinityScroller;
    buttonData: TopCategoryButtonData[];
};

const ReactTopCategoryButtonNav = forwardRef<
    TopCategoryButtonNavCls | null,
    TopCategoryButtonNavProp
>(({ getScroller, buttonData }, ref) => {
    const navRef = useRef<HTMLElement>(null);
    const [instance, setInstance] = useState<TopCategoryButtonNavCls | null>(
        null,
    );

    useEffect(() => {
        if (navRef.current !== null)
            setInstance(
                new TopCategoryButtonNavCls(
                    buttonData,
                    navRef.current,
                    getScroller,
                ),
            );
    }, [buttonData]);

    useImperativeHandle<
        TopCategoryButtonNavCls | null,
        TopCategoryButtonNavCls | null
    >(ref, () => instance);

    return <nav className="top-category-buttos" ref={navRef}></nav>;
});

export default ReactTopCategoryButtonNav;
