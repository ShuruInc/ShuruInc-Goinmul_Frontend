export default class ImageCache {
    private data: { [key: string]: string | null } = {};

    async fetch(url: string) {
        if (url in this.data) return;

        this.data[url] = null;
        const response = await fetch(url);
        const blob = await response.blob();
        this.data[url] = URL.createObjectURL(blob);
    }
    async get(url: string): Promise<string> {
        if (url in this.data) {
            return new Promise<string>((resolve, _reject) => {
                const retry = () => {
                    const value = this.data[url];
                    if (value === null) setTimeout(retry, 1);
                    else resolve(value);
                };
                setTimeout(retry, 1);
            });
        } else {
            await this.fetch(url);
            return this.data[url] as string;
        }
    }
}
