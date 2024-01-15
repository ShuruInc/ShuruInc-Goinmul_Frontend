import { dom, icon, library } from "@fortawesome/fontawesome-svg-core";
import "../../styles/search.scss";
import { faChevronLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import createFloatingButton from "../floatingButton";
import SearchApiClient from "../api/search";
import {
    fillPlaceholderSectionInto,
    preparePlaceholderSection,
} from "../post_board";
import setHorizontalDragScrollOnDesktop from "../horizontal_drag_to_scroll_on_desktop";

// 아이콘 렌더링
library.add(faSearch);
library.add(faChevronLeft);
dom.i2svg({ node: document.querySelector("#topFixedBar")! });
document.body.style.setProperty(
    "--search-icon",
    `url("data:image/svg+xml;,${encodeURIComponent(
        icon(faSearch, { styles: { opacity: "0.5" } }).html[0]
    )}")`
);
document.body.style.setProperty(
    "--search-icon-active",
    `url("data:image/svg+xml;,${encodeURIComponent(icon(faSearch).html[0])}")`
);

// 뒤로 가기 버튼
document.querySelector("button.go-back")?.addEventListener("click", (evt) => {
    evt.preventDefault();
    history.state;
    history.back();
});

// 홈 버튼 추가
createFloatingButton("home");

// query 매개변수 가져오기
const params = new URLSearchParams(
    location.search.length > 0 ? location.search.substring(1) : ""
);
let query = params.get("query") ?? "";
const searchInput = document.querySelector("input.search") as HTMLInputElement;
searchInput.value = query;

const renderPopularQueries = (queries: string[]) => {
    const columns = document.querySelector(
        ".popularNow .columns"
    ) as HTMLElement;
    columns.innerHTML = "";
    setHorizontalDragScrollOnDesktop(columns);

    while (queries.length > 0) {
        let ol = document.createElement("ol");
        ol.className = "column";

        for (let i = 0; i < 5; i++) {
            const query = queries.pop();
            if (typeof query === "undefined") break;

            const li = document.createElement("li");
            li.innerHTML = '<a href="#"></a>';

            const a = li.querySelector("a")!;
            a.href = "?query=" + encodeURIComponent(query);
            a.addEventListener("click", (evt) => {
                evt.preventDefault();
                setQuery(query, true);
            });
            a.textContent = query;

            ol.appendChild(li);
        }

        columns.appendChild(ol);
    }
};

const renderKeywords = (keywords: string[]) => {
    const keywordsContainer = document.querySelector(".keywords .bubbles")!;
    keywordsContainer.innerHTML = "";

    while (keywords.length > 0) {
        const keyword = keywords.pop();
        if (typeof keyword === "undefined") break;

        const bubble = document.createElement("a");
        bubble.className = "bubble";
        bubble.href = "?query=" + encodeURIComponent(keyword);
        bubble.addEventListener("click", (evt) => {
            evt.preventDefault();
            setQuery(keyword, true);
        });
        bubble.textContent = keyword;

        keywordsContainer.appendChild(bubble);
    }
};

const render = async () => {
    [...document.querySelectorAll("section")].forEach((i) =>
        i.classList.add("display-none")
    );
    [...document.querySelectorAll("section.post-section")].forEach(
        (i) => (i.innerHTML = "")
    );

    if (query === "") {
        [...document.querySelectorAll("section")].forEach((i) =>
            i.classList.contains("popularNow") ||
            i.classList.contains("keywords")
                ? i.classList.remove("display-none")
                : i.classList.add("display-none")
        );
        renderKeywords(await SearchApiClient.recommendKeyword(15));
        renderPopularQueries(await SearchApiClient.hotQueries(10));
    } else {
        // 검색
        const result = await SearchApiClient.search(query);
        const hasResults = result.result.length > 0;
        if (hasResults) {
            // 검색 결과
            const resultSection = document.querySelector(
                ".result"
            )! as HTMLElement;
            preparePlaceholderSection(resultSection, [
                {
                    count: result.result.length,
                    landscape: false,
                },
            ]);
            fillPlaceholderSectionInto(
                {
                    portraits: result.result,
                    title: `총 ${result.result.length}건의 검색 결과가 있습니다.`,
                },
                resultSection
            );
            resultSection.classList.remove("display-none");

            // 연관 모의고사
            if (result.similar.length > 0) {
                const similarSection = document.querySelector(
                    ".similar"
                )! as HTMLElement;
                preparePlaceholderSection(similarSection, [
                    {
                        count: result.similar.length,
                        landscape: false,
                    },
                ]);
                fillPlaceholderSectionInto(
                    {
                        portraits: result.similar,
                        title: "연간된 모의고사",
                    },
                    similarSection
                );
                similarSection.classList.remove("display-none");
            }
        } else {
            // 요청 버튼 활성화
            const requestBtn = document.querySelector(
                "button.request"
            ) as HTMLButtonElement;
            requestBtn.classList.remove("requested");
            requestBtn.disabled = false;
            requestBtn.textContent = "출제 요청하기";
            document
                .querySelector(".no-results")
                ?.classList.remove("display-none");
        }

        // 추천 모의고사
        const recommendedPosts = await SearchApiClient.recommend(10);
        const recommendSection = document.querySelector(
            ".recommended"
        )! as HTMLElement;
        preparePlaceholderSection(recommendSection, [
            {
                count: 10,
                landscape: false,
            },
        ]);
        fillPlaceholderSectionInto(
            {
                portraits: recommendedPosts,
                title: "추천 모의고사",
            },
            recommendSection
        );
        recommendSection.classList.remove("display-none");
    }
};

let timeoutIdx: NodeJS.Timeout | undefined = undefined;
const setQuery = (newQuery: string, setInputValue = false) => {
    query = newQuery;
    history.replaceState(
        history.state,
        "",
        "/search.html?query=" + encodeURIComponent(newQuery)
    );
    clearTimeout(timeoutIdx);
    timeoutIdx = setTimeout(() => {
        render();
    }, 100);
    if (setInputValue) searchInput.value = newQuery;
};
searchInput.addEventListener("input", (evt) => {
    setQuery((evt.target as HTMLInputElement).value);
});

const requestBtn = document.querySelector(
    "button.request"
) as HTMLButtonElement;
requestBtn?.addEventListener("click", (evt) => {
    evt.preventDefault();
    SearchApiClient.requestMakeTest(query).then(() => {
        requestBtn.disabled = true;
        requestBtn.classList.add("requested");
        requestBtn.textContent = "요청되었습니다.";
    });
});

render();
