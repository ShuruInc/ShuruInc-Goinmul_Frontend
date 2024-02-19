import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import {
    TopCategoryButtonData,
    TopCategoryButtonNav as TopCategoryButtonNavCls,
} from "../top_category_button_nav";
import { HorizontalInfinityScroller } from "../lib/infinity_scroller";

type TopCategoryButtonNavProp = {
    getScroller: () => HorizontalInfinityScroller | null;
    buttonData: TopCategoryButtonData[];
};

const ReactTopCategoryButtonNav = forwardRef<
    TopCategoryButtonNavCls | null,
    TopCategoryButtonNavProp
>(({ getScroller, buttonData }, ref) => {
    const instance = useRef<TopCategoryButtonNavCls | null>(null);

    const createNavRef = useCallback((navEl: HTMLElement) => {
        if (navEl !== null)
            instance.current = new TopCategoryButtonNavCls(
                buttonData,
                navEl,
                getScroller,
            );
    }, []);

    useImperativeHandle<
        TopCategoryButtonNavCls | null,
        TopCategoryButtonNavCls | null
    >(ref, () => instance.current);

    return <nav className="top-category-buttons" ref={createNavRef}></nav>;
});

export default ReactTopCategoryButtonNav;
