import { kakaoApiKey } from "./kakao_api_key";

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
    image: File | Blob;
};

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

const uploadImage = (_image: Blob | File) => `https://picsum.photos/128/128`;

type InitShareButtonOptions = Partial<{
    onComplete: () => void;
    beforeShare: () => Promise<void>;
}>;

export default function initShareButton(
    options: InitShareButtonOptions = {}
): (content: ShareDatas) => void {
    importKakaoSdk();

    let content: ShareDatas | null = null;
    let webShareButton = document.querySelector(".share-web-share"),
        twitterButton = document.querySelector(".share-twitter"),
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
    twitterButton?.addEventListener("click", (_evt) => {
        (options.beforeShare ? options.beforeShare : async () => {})()
            .then(() => {
                if (content === null) return;
                if (options.onComplete) options.onComplete();
            })
            .catch((err) => alert("오류가 발생했습니다: " + err));
    });
    kakaoButton?.addEventListener("click", (_evt) => {
        (options.beforeShare ? options.beforeShare : async () => {})()
            .then(async () => {
                if (content === null) return;
                (window as any).Kakao.Share.sendDefault({
                    objectType: "feed",
                    content: {
                        title: content.kakao.title,
                        description: content.kakao.content,
                        imageUrl: await uploadImage(content.image),
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
            })
            .catch((err) => alert("오류가 발생했습니다: " + err));
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
    };
}
