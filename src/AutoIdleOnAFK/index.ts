import { Plugin } from "betterdiscord";
import Imports from "./discordImports";

export default class MyPlugin implements Plugin {
  constructor(meta: any) {
    console.log(meta);
  }

  start() {
    console.log("hello there");

    console.log("this is session store: ", Imports.SessionStore);
    console.log("some more, ", Imports.Modules);
    console.log("another one", Imports.StatusSetting);
    console.log("voice channel, ");
  }

  stop() {
    console.log("bye there");
  }
}
