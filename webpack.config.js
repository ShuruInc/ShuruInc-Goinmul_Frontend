const { createHash } = require("crypto");
const { readdirSync } = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
            {
                test: /\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            publicPath: "/dist/assets/",
                        },
                    },
                ],
            },
        ],
    },
    watchOptions: {
        ignored: /node_modules/,
    },
    resolve: {
        extensions: [
            ".ts",
            ".js",
            ".sass",
            ".scss",
            ".png",
            ".jpeg",
            ".jpg",
            ".gif",
            ".svg",
            ".webp",
        ],
    },
    output: {
        path: path.resolve(__dirname, "Main/dist/assets"),
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
        new MiniCssExtractPlugin(),
    ],
};
