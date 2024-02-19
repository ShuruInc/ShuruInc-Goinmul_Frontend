import { kakaoApiKey } from "./env";
import kakaoTalkIcon from "../assets/kakaotalk_bubble.svg";
import { encode } from "html-entities";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import tweetDialog from "./tweet_dialog";

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
    script.id = "kakao-sdk";
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

type InitShareButtonOptions = {
    /**
     * 곻유 데이터를 변형하는 함수
     */
    shareDataTransformer?: (content: ShareDatas) => Promise<ShareDatas>;
    /**
     * 공유할 컨텐츠
     */
    content: ShareDatas;
};

export default function initShare(options: InitShareButtonOptions) {
    importKakaoSdk();

    let content = options.content;
    let webShareButton = document.querySelector(".share-web-share"),
        twitterButton = document.querySelector(
            ".share-twitter",
        ) as HTMLAnchorElement,
        kakaoButton = document.querySelector(".share-kakao");

    webShareButton?.classList.add("display-none");
    twitterButton?.classList.add("display-none");
    kakaoButton?.classList.add("display-none");

    kakaoButton!.innerHTML = `<img src="${encode(
        kakaoTalkIcon,
    )}"> ${kakaoButton?.innerHTML}`;
    twitterButton!.innerHTML = `${
        icon(faXTwitter).html[0]
    } ${twitterButton?.innerHTML}`;

    const doWebShare = async () => {
        if (options.shareDataTransformer)
            content = await options.shareDataTransformer(content);

        if (content === null) return;
        try {
            await navigator.share(content.webShare);
        } catch {
            return false;
        }

        return true;
    };

    const doTwitterShare = async () => {
        if (options.shareDataTransformer)
            content = await options.shareDataTransformer(content);

        if (content === null) return;

        return await tweetDialog(content.twitter.text, content.image);
    };
    const doKakaoShare = async () => {
        if (options.shareDataTransformer)
            content = await options.shareDataTransformer(content);

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
        return true;
    };

    return {
        webShareAvailable:
            "canShare" in navigator && navigator.canShare(content.webShare),
        doWebShare,
        doKakaoShare,
        doTwitterShare,
    };
}
