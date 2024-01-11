import { kakaoApiKey } from "./kakao_api_key";

type ShareDataWithImageUrl = ShareData & { imageUrl?: string };

const importKakaoSdk = () => {
    if (document.querySelector("script#kakao-sdk") !== null) return;

    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js";
    script.integrity =
        "sha384-6MFdIr0zOira1CHQkedUqJVql0YtcZA1P0nbPrQYJXVJZUkTk/oX4U9GhUIs3/z8";
    script.crossOrigin = "anonymous";
    script.addEventListener("load", (_evt) => {
        (window as any).Kakao.init(kakaoApiKey);
    });

    document.head.appendChild(script);
};

export default function initShareButton(
    shareCompleteHandler?: () => void
): (content: ShareDataWithImageUrl) => void {
    importKakaoSdk();

    let content: ShareDataWithImageUrl = {};
    let webShareButton = document.querySelector(".share-web-share"),
        twitterButton = document.querySelector(".share-twitter"),
        kakaoButton = document.querySelector(".share-kakao");

    webShareButton?.classList.add("display-none");
    twitterButton?.classList.add("display-none");
    kakaoButton?.classList.add("display-none");

    webShareButton?.addEventListener("click", () => {
        navigator.share(content).then(() => {
            if (shareCompleteHandler) shareCompleteHandler();
        });
    });
    twitterButton?.addEventListener("click", (_evt) => {
        if (shareCompleteHandler) shareCompleteHandler();
    });
    kakaoButton?.addEventListener("click", (_evt) => {
        if (shareCompleteHandler) shareCompleteHandler();
    });

    return (newContent: ShareDataWithImageUrl) => {
        content = newContent;
        if ("canShare" in navigator && navigator.canShare(content)) {
            webShareButton?.classList.remove("display-none");
            twitterButton?.classList.add("display-none");
            kakaoButton?.classList.add("display-none");
        } else {
            webShareButton?.classList.add("display-none");
            twitterButton?.classList.remove("display-none");
            kakaoButton?.classList.remove("display-none");
        }
    };
}
