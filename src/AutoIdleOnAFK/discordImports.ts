import { AllModules, StatusSetting } from "./types/settings";
import { SelectedChannelStore, SessionsStore } from "./types/stores";

const Webpack = BdApi.Webpack;

/**
 * Centralised imports related to Discord to keep track of external code from
 * where in case something breaks
 */
export default class Imports {
  static readonly SelectedChannelStore = this._import<SelectedChannelStore>(
    () => Webpack.getStore("SelectedChannelStore"),
  );
  static readonly SessionStore = this._import<SessionsStore>(() =>
    Webpack.getStore("SessionsStore"),
  );

  static readonly Modules = this._import<AllModules>(
    () => Webpack.getAllByKeys("StatusSetting")[0],
  );

  static readonly StatusSetting = this._import<StatusSetting>(
    () => Imports.Modules?.StatusSetting,
  );

  private static _import<T>(callback: () => T | undefined): undefined | T {
    try {
      const r = callback();
      if (r == undefined) {
        console.warn(`Empty return: ${callback.toString()}`);
      }
      return r;
    } catch (error) {
      console.error(`Error during import: ${error}`);
      return undefined;
    }
  }
}
