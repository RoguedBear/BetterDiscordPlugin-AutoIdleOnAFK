import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json" assert { type: "json" };
import sucrase from "@rollup/plugin-sucrase";
import prettier from "rollup-plugin-prettier";

const meta = `/**
 * @name AutoIdleOnAFK-v1
 * @description Automatically updates your discord status to 'idle' when you haven't opened your discord client for more than 5 minutes.
Plugin only works when your status is 'online' and you are not in a voice channel.

For Bugs or Feature Requests open an issue on my Github
 * @version ${pkg.version}
 * @author ${pkg.author}
 * @authorLink https://github.com/RoguedBear
 * @website https://github.com/RoguedBear/BetterDiscordPlugin-AutoIdleOnAFK
 * @source https://raw.githubusercontent.com/RoguedBear/BetterDiscordPlugin-AutoIdleOnAFK/main/release/AutoIdleOnAFK.plugin.js
 */

// This code is bundled via rollup. visit repository to understand this in a
// more comprehensible way
`;
export default {
  input: "src/AutoIdleOnAFK/index.ts",
  output: {
    file: "./release/AutoIdleOnAFK.plugin.js",
    format: "cjs",
    interop: "esModule",
    banner: meta,
  },
  plugins: [
    sucrase({ transforms: ["typescript"], disableESTransforms: true }),
    prettier({ parser: "typescript" }),
  ],
};
