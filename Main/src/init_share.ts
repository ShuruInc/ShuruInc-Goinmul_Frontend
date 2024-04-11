import "../styles/common/_share-buttons.scss";
import { encode } from "html-entities";
import shareIcon from '../assets/share.svg';
import twitterIcon from '../assets/X.png';

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
    imageBlob: Blob;
};

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
    let content: ShareDatas | null = null;
    let webShareButton = document.querySelector<HTMLElement>(".share-web-share");
    let twitterShareButton = document.querySelector<HTMLElement>(".share-twitter");
    webShareButton!.style.display = 'none';

    webShareButton!.innerHTML = `<img src="${encode(
        shareIcon,
    )}" style="margin-right: 6px; vertical-align: middle;"><span style="vertical-align: middle;">${webShareButton?.innerText}</span>`;

    twitterShareButton!.innerHTML = `<img src="${encode(
        twitterIcon,
    )}" style="margin-right: 6px; vertical-align: middle;"><span style="vertical-align: middle;">${twitterShareButton?.innerText}</span>`;

    console.log(options);

    webShareButton?.addEventListener('click', async (event) => {
        event.preventDefault();

        // await options.beforeShare?.();
        if (content === null) return;
        try {
            if (navigator.clipboard) {
                try {
                    navigator.clipboard.write([
                        new ClipboardItem({
                            // 'text/html': new Blob([`<p>${content.webShare.text || ''}</p><img src="${await blobToBase64(content.imageBlob)}" alt="성적표">`], { type: 'text/html' }),
                            // 'text/plain': new Blob([content.webShare.url || ''], { type: 'text/plain' }),
                            [content.imageBlob.type]: content.imageBlob,
                        })
                    ]);

                    alert('클립보드에 이미지가 복사되었어요!');
                } catch {
                    prompt('다음 주소를 복사해주세요!', content!.webShare.url!);
                }
            } else if (navigator.share && navigator.canShare(content.webShare)) {
                try {
                    content.webShare.title = content.webShare.title || content.webShare.text;
                    await navigator.share(content.webShare);
                } catch(e) {
                    // alert(e);
                }
            } else {
                // try {
                //     if(navigator.clipboard) {
                //         await navigator.clipboard.writeText(content!.webShare.url!);
                        
                //         alert('클립보드에 주소가 복사되었어요!');
    
                //         return;
                //     } else {
                //         throw new Error();
                //     }
                // } catch {
                //     prompt('다음 주소를 복사해주세요!', content!.webShare.url!);
                // }
            }

            // options.onShared?.();
        } catch {} finally {
            // options.onComplete?.();
        }
    });

    twitterShareButton?.addEventListener('click', async (event) => {
        event.preventDefault();

        // await options.beforeShare?.();
        if (content === null) return;
        try {
            window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `\n\n🔗 ${content.webShare.url ?? ''}\n#고인물테스트 #슈르네`,
                )}`,
                "_blank",
            );

            // options.onShared?.();
        } catch {} finally {
            // options.onComplete?.();
        }
    });

    return (newContent: ShareDatas) => {
        content = newContent;
    };
}
