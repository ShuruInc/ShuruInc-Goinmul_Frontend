const IMAGE_CACHE_COUNT = 5;

export default class ImageCache {
    private blobUrls: { [key: string]: string | null } = {};
    private urls = [] as string[];
    private hits: { [key: string]: boolean } = {};

    pushUrl(url: string) {
        if (this.urls.includes(url)) return;

        this.urls.push(url);
        this.hits[url] = false;
    }

    fetchAndCacheForward(url: string) {
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
    async get(url: string): Promise<string> {
        this.fetchAndCacheForward(url);

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
