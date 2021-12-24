
export class UtilColor {
    static getRandomThumbnailBg = () => {
        const colors = [
            "40407a",
            "2c2c54",
            "ff5252",
            "b33939",
            "ff793f",
            "cd6133",
            "cc8e35",
            "227093",
            "218c74",
            "33d9b2",
            "ccae62",
            "B33771",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}