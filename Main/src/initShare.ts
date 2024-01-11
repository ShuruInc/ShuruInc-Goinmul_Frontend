type ShareDataWithImageUrl = ShareData & { imageUrl?: string };

export default function initShareButton(
    shareCompleteHandler?: () => void
): (content: ShareDataWithImageUrl) => void {
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
