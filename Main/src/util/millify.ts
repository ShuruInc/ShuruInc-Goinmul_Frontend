export default function millify(number: number) {
    let units: [string, number][] = [
        ["k", Math.pow(10, 3)] as [string, number],
        ["M", Math.pow(10, 6)] as [string, number],
        ["G", Math.pow(10, 9)] as [string, number],
        ["T", Math.pow(10, 12)] as [string, number],
        ["P", Math.pow(10, 15)] as [string, number],
        ["E", Math.pow(10, 18)] as [string, number],
        ["Z", Math.pow(10, 21)] as [string, number],
        ["Y", Math.pow(10, 24)] as [string, number],
        ["R", Math.pow(10, 27)] as [string, number],
        ["Q", Math.pow(10, 30)] as [string, number],
    ].reverse();

    for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        if (number >= unit[1]) {
            let quotientString = Math.floor(number / unit[1]).toString();
            let remainder = number % unit[1];

            let precision = Math.max(3 - quotientString.length, 0);
            let remainderString = remainder.toString().substring(0, precision);

            return (
                quotientString +
                (remainderString !== "" ? "." + remainderString : "") +
                unit[0]
            );
        }
    }
    return number.toString();
}
