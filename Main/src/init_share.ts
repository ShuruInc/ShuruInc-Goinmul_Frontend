import { kakaoApiKey } from "./env";
import "../styles/common/_share-buttons.scss";
import kakaoTalkIcon from "../assets/kakaotalk_bubble.svg";
import { encode } from "html-entities";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import tweetDialog from "./tweet_dialog";
import linkIcon from '../assets/link-anchor.svg';

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
    onShared: () => void;
    /**
     * 공유 창을 닫은 이후의 동작
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
    let webShareButton = document.querySelector<HTMLElement>(".share-web-share"),
        twitterButton = document.querySelector<HTMLElement>(
            ".share-twitter",
        ) as HTMLAnchorElement,
        kakaoButton = document.querySelector<HTMLElement>(".share-kakao");

    kakaoButton?.classList.add("display-none");

    kakaoButton!.innerHTML = `<img src="${encode(
        kakaoTalkIcon,
    )}"> ${kakaoButton?.innerText}`;
    twitterButton!.innerHTML = `${
        icon(faXTwitter).html[0]
    } ${twitterButton?.innerText}`;
    webShareButton!.innerHTML = `<img src="${encode(
        linkIcon,
    )}"> ${webShareButton?.innerText}`;

    webShareButton?.addEventListener("click", () => {
        (options.beforeShare ? options.beforeShare : async () => {})()
            .then(() => {
                if (content === null) return;
                navigator
                    .share(content.webShare)
                    .then(() => {
                        if (options.onShared) options.onShared();
                    })
                    .finally(() => {
                        if (options.onComplete) options.onComplete();
                    });
            })
            .catch((err) => alert("오류가 발생했습니다: " + err));
    });
    twitterButton.addEventListener("click", (evt) => {
        evt.preventDefault();

        (options.beforeShare ? options.beforeShare : async () => {})()
            .then(async () => {
                if (content === null) return;

                const tweeted = await tweetDialog(
                    content.twitter.text,
                    content.image,
                );

                if (options.onShared && tweeted) options.onShared();
            })
            .catch((err) => {
                alert("오류가 발생했습니다!");
                console.error(err);
            })
            .finally(() => {
                if (options.onComplete) options.onComplete();
            });
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
        if (options.onShared) options.onShared();
        if (options.onComplete) options.onComplete();
    });

    return (newContent: ShareDatas) => {
        content = newContent;
        twitterButton.href =
            "https://twitter.com/intent/tweet?text=" +
            encodeURIComponent(content!.twitter.text);
    };
}
