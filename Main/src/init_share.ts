import { kakaoApiKey } from "./env";

export type ShareDatas = {
    webShare: ShareData;
    kakao: {
        title: string;
        content: string;
        buttonText: string;
        url: string;
    };
    twitter: {
        text: string;
    };
    image: File;
};

/**
 * Kakao SDK를 로드합니다.
 */
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

/**
 * 카카오에 이미지를 업로드합니다.
 * @param image 업로드할 이미지
 * @returns 이미지 url
 */
const uploadKakaoImage = async (image: File) =>
    (await (window as any).Kakao.Share.uploadImage({ file: [image] })).infos
        .original.url as string;

type InitShareButtonOptions = Partial<{
    /**
     * 사용자가 공유를 취소하지 않았을 시의 동작 (단 사용자가 실제로 공유를 했는 지는 알 수 없다.)
     */
    onComplete: () => void;
    /**
     * 공유 직전에 할 동작 (단 트위터는 해당되지 않음)
     */
    beforeShare: () => Promise<void>;
}>;

export default function initShareButton(
    options: InitShareButtonOptions = {},
): (content: ShareDatas) => void {
    importKakaoSdk();

    let content: ShareDatas | null = null;
    let webShareButton = document.querySelector(".share-web-share"),
        twitterButton = document.querySelector(
            ".share-twitter",
        ) as HTMLAnchorElement,
        kakaoButton = document.querySelector(".share-kakao");

    webShareButton?.classList.add("display-none");
    twitterButton?.classList.add("display-none");
    kakaoButton?.classList.add("display-none");

    webShareButton?.addEventListener("click", () => {
        (options.beforeShare ? options.beforeShare : async () => {})()
            .then(() => {
                if (content === null) return;
                navigator.share(content.webShare).then(() => {
                    if (options.onComplete) options.onComplete();
                });
            })
            .catch((err) => alert("오류가 발생했습니다: " + err));
    });
    twitterButton.addEventListener("click", () => {
        if (options.onComplete) options.onComplete();
    });
    kakaoButton?.addEventListener("click", async (_evt) => {
        _evt.preventDefault();
        await (options.beforeShare
            ? options.beforeShare()
            : new Promise<void>((resolve, _reject) => {
                  resolve();
              }));

        if (content === null) return;
        (window as any).Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
                title: content.kakao.title,
                description: content.kakao.content,
                imageUrl: await uploadKakaoImage(content.image),
                link: {
                    mobileWebUrl: content.kakao.url,
                    webUrl: content.kakao.url,
                },
            },
            buttons: [
                {
                    title: content.kakao.buttonText,
                    link: {
                        mobileWebUrl: content.kakao.url,
                        webUrl: content.kakao.url,
                    },
                },
            ],
        });
        if (options.onComplete) options.onComplete();
    });

    return (newContent: ShareDatas) => {
        content = newContent;
        if ("canShare" in navigator && navigator.canShare(content.webShare)) {
            webShareButton?.classList.remove("display-none");
            twitterButton?.classList.add("display-none");
            kakaoButton?.classList.add("display-none");
        } else {
            webShareButton?.classList.add("display-none");
            twitterButton?.classList.remove("display-none");
            kakaoButton?.classList.remove("display-none");
        }
        twitterButton.href =
            "https://twitter.com/intent/tweet?text=" +
            encodeURIComponent(content!.twitter.text);
    };
}
