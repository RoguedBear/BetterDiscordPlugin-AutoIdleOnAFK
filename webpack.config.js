const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const pkg = require("./package.json");
const pluginConfig = require("./src/AutoIdleOnAFK/config.json");
pluginConfig.version = pkg.version;

const meta = (() => {
    const lines = ["/**"];
    for (const key in pluginConfig) {
        lines.push(` * @${key} ${pluginConfig[key]}`);
    }
    lines.push(" */");
    return lines.join("\n");
})();

module.exports = {
    mode: "development",
    target: "node",
    devtool: false,
    entry: "./src/AutoIdleOnAFK/index.js",
    output: {
        filename: "AutoIdleOnAFK.plugin.js",
        path: path.join(__dirname, "release"),
        libraryTarget: "commonjs2",
        libraryExport: "default",
        compareBeforeEmit: false
    },
    resolve: {
        extensions: [".js"],
    },
    plugins: [
        new webpack.BannerPlugin({ raw: true, banner: meta }),
    ]
};