const { createHash } = require("crypto");
const { readdirSync } = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const md5 = (text) => createHash("md5").update(text).digest("hex");

let htmlFiles = readdirSync("Main/html", {
    encoding: "utf8",
    recursive: true,
}).filter((i) => i.toLowerCase().endsWith(".html"));
let hashes = htmlFiles.map(md5);

const dev = process.env.NODE_ENV === "development";
module.exports = {
    mode: dev ? "development" : "production",
    entry: Object.fromEntries(
        htmlFiles.map((i, idx) => [
            hashes[idx],
            "./" + path.join("Main/src/page", i.replace(/\.html$/, ".ts")),
        ])
    ),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "Main/dist/assets/js"),
        filename: "[name].js",
    },
    plugins: [
        ...htmlFiles.map(
            (i, idx) =>
                new HtmlWebpackPlugin({
                    filename: path.resolve(__dirname, "Main/dist", i),
                    chunks: [hashes[idx]],
                    template: path.join("Main/html", i),
                })
        ),
    ],
};
