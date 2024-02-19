import "../../styles/search.scss";
import SearchApiClient from "../api/search";
import { useEffect, useState } from "react";
import SearchView from "../search_ui/search_view";
import PostBoardApiClient from "../api/posts";
import { Post } from "../post_board/types";
import { createRoot } from "react-dom/client";

function SearchPage() {
    const [query, setQuery] = useState<string>(
        new URLSearchParams(location.search).get("query") ?? "",
    );
    const [result, setSearchResult] = useState<
        Partial<{
            result: Post[];
            similar: Post[];
            recommenedPosts: Post[];
        }>
    >({});
    const [popularAndRecommendedQueries, setPopularAndRecommendedQueries] =
        useState<{
            popularQueries: string[];
            recommendedQueries: string[];
        } | null>(null);

    useEffect(() => {
        if (popularAndRecommendedQueries === null) {
            (async () => {
                return {
                    popularQueries: await SearchApiClient.hotQueries(10),
                    recommendedQueries: await SearchApiClient.recommendKeyword(
                        15,
                    ),
                };
            })().then(setPopularAndRecommendedQueries);
        }
    }, [popularAndRecommendedQueries]);

    useEffect(() => {
        SearchApiClient.recommend(10).then((recommended) => {
            setSearchResult((old) => ({
                ...old,
                recommenedPosts: recommended,
            }));
        });
    }, []);

    useEffect(() => {
        SearchApiClient.search(query).then(({ result, similar }) => {
            setSearchResult((old) => ({
                ...old,
                result,
                similar,
            }));
        });
    }, [query]);

    const common = {
        searchInputValue: query,
        onRequestClick: () => {
            PostBoardApiClient.requestMakeTest(query);
        },
        onSearchInputValueChanged: (newInput: string) => {
            setQuery(newInput);
            history.replaceState(
                history.state,
                "",
                "/search.html?query=" + encodeURIComponent(newInput),
            );
        },
    };

    return query === "" ? (
        <SearchView
            noMissingResultMark
            {...popularAndRecommendedQueries}
            {...common}
        ></SearchView>
    ) : (
        <SearchView {...result} {...common}></SearchView>
    );
}

const root = createRoot(document.body);
root.render(<SearchPage></SearchPage>);
