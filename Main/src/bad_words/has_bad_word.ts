import badWordData from "./data";

export default function hasBadWord(str: string) {
    for (const i of badWordData) {
        if (new RegExp(i.trim(), "g").test(str)) {
            return true;
        }
    }
    return false;
}
