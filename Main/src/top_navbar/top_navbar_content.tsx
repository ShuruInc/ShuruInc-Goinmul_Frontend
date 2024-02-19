import { ReactNode, useEffect, useRef } from "react";
import { TopNavbarProgressColor, TopNavbarType } from "./top_navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleLeft,
    faChevronLeft,
    faMagnifyingGlass,
    faRankingStar,
} from "@fortawesome/free-solid-svg-icons";
import tippy from "tippy.js";

type TopNavbarContentProp = ({
    type: TopNavbarType;
} & Partial<
    NormalTopNavbarContentProp &
        QuizTopNavbarContentProp &
        SearchTopNavbarContentProp
>) &
    (
        | ({ type: "normal" } & NormalTopNavbarContentProp)
        | ({ type: "quiz" } & QuizTopNavbarContentProp)
        | ({ type: "search" } & SearchTopNavbarContentProp)
    );

type NormalTopNavbarContentProp = {
    logoImgSrc: string;
    tippyText?: string;
    onRankingClick: () => void;
    onSearchClick: () => void;
};

type QuizTopNavbarContentProp = {
    onGoBackClick: () => void;
    title: ReactNode;
    progress: { text?: ReactNode; color?: TopNavbarProgressColor };
};

type SearchTopNavbarContentProp = {
    onInput: (input: string) => void;
    value: string;
    onGoBackClick: () => void;
};

function NormalTopNavbarContent(props: NormalTopNavbarContentProp) {
    const searchButtonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (props.tippyText && searchButtonRef.current !== null) {
            const tippyInstance = tippy(searchButtonRef.current, {
                content: props.tippyText,
                placement: "left",
            });
            if (location.pathname === "/")
                setTimeout(() => {
                    tippyInstance.show();
                    setTimeout(() => {
                        tippyInstance.hide();
                    }, 800);
                }, 100);
        }
    }, [props.tippyText]);
    return (
        <>
            <a className="main-top-logo" href="/">
                <img className="main-top-logo-image" src={props.logoImgSrc} />
            </a>
            <div className="buttons">
                <button className="ranking-icon" onClick={props.onRankingClick}>
                    <FontAwesomeIcon icon={faRankingStar}></FontAwesomeIcon>
                </button>
                <button
                    className="search-icon"
                    onClick={props.onSearchClick}
                    ref={searchButtonRef}
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
                </button>
            </div>
        </>
    );
}

function QuizTopNavbarContent(props: QuizTopNavbarContentProp) {
    let colorClass = "";
    if (props.progress.color) colorClass = props.progress.color;

    return (
        <nav>
            <button className="go-back" onClick={props.onGoBackClick}>
                <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
            </button>
            <div className="test-title">{props.title}</div>
            <div className={colorClass}>{props.progress?.text}</div>
        </nav>
    );
}
function SearchTopNavbarContent(props: SearchTopNavbarContentProp) {
    return (
        <>
            <button className="go-back" onClick={props.onGoBackClick}>
                <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
            </button>
            <input
                type="input"
                className="search"
                maxLength={30}
                placeholder="검색어를 입력해 주세요."
                onInput={(evt) =>
                    props.onInput((evt.target as HTMLInputElement).value)
                }
                value={props.value}
            />
        </>
    );
}

export default function TopNavbarContent(prop: TopNavbarContentProp) {
    switch (prop.type) {
        case "search":
            return <nav>{SearchTopNavbarContent(prop)}</nav>;
        case "normal":
            return <nav>{NormalTopNavbarContent(prop)}</nav>;
        case "quiz":
            return (
                <div className="container">{QuizTopNavbarContent(prop)}</div>
            );
    }
}
