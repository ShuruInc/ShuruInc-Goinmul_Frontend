const webpack = require("webpack");
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

if (typeof process.env.KAKAO_API_KEY === "undefined")
    throw new Error("KAKAO_API_KEY NOT PROVIDED");
else if (typeof process.env.BACKEND_URL === "undefined")
    throw new Error("BACKEND_URL not provided");

const dev = process.env.NODE_ENV === "development";
module.exports = {
    mode: dev ? "development" : "production",
    entry: Object.fromEntries(
        htmlFiles.map((i, idx) => [
            hashes[idx],
            "./" + path.join("Main/src/page", i.replace(/\.html$/, ".ts")),
        ]),
    ),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.html?$/,
                use: "html-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            publicPath: "/assets/",
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
            ".css",
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
                }),
        ),
        new webpack.EnvironmentPlugin(["KAKAO_API_KEY", "BACKEND_URL"]),
        new MiniCssExtractPlugin(),
    ],
};
