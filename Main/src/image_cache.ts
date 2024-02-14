const IMAGE_CACHE_COUNT = 5;

/**
 * 캐시 기능을 갖춘 이미지 다운로더입니다.
 */
export default class ImageCache {
    private blobUrls: { [key: string]: string | null } = {};
    private urls = [] as string[];
    private hits: { [key: string]: boolean } = {};

    /**
     * 이미지 주소를 추가합니다.
     * @param url 이미지 주소
     */
    pushUrl(url: string) {
        if (this.urls.includes(url)) return;

        this.urls.push(url);
        this.hits[url] = false;
    }

    /**
     * 주어진 이미지 주소 포함 5개의 이미지를 캐싱합니다.
     * @param url 이미지 주소
     */
    private fetchAndCacheForward(url: string) {
        let index = this.urls.indexOf(url);
        if (index === -1) {
            this.pushUrl(url);
            index = this.urls.indexOf(url);
        }

        for (
            let i = 0;
            i < IMAGE_CACHE_COUNT && index + i < this.urls.length;
            i++
        ) {
            const urlNow = this.urls[index + i];
            if (urlNow in this.blobUrls) continue;

            this.blobUrls[urlNow] = null;
            // Do not wait for fetch
            fetch(urlNow)
                .then((response) => response.blob())
                .then((blob) => {
                    this.blobUrls[urlNow] = URL.createObjectURL(blob);
                });
        }
    }

    /**
     * 주어진 이미지 주소를 다운로드하거나 캐시에서 가져옵니다.
     * @param url 이미지 주소
     * @returns {string} Blob Object Url
     */
    async get(url: string): Promise<string> {
        this.fetchAndCacheForward(url);

        // 캐시가 완료될 때까지 기다렸다가 캐시가 완료되면 캐시값을 반환하는 Promise
        return new Promise<string>((resolve, _reject) => {
            const retry = () => {
                const value = this.blobUrls[url];
                if (value === null) setTimeout(retry, 1);
                else resolve(value);
            };
            setTimeout(retry, 1);
        });
    }
}
