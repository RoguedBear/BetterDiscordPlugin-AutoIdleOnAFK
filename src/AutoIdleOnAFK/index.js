/**
 * @typedef {import("../../BDPluginLibrary/src/ui/ui").ContextMenu} ContextMenu
 * @typedef {import("../../BDPluginLibrary/src/ui/ui").DiscordContextMenu} DiscordContextMenu
 * @typedef {import("../../BDPluginLibrary/src/ui/ui").Modals} Modals
 * @typedef {import("../../BDPluginLibrary/src/ui/ui").Popouts} Popouts
 * @typedef {import("../../BDPluginLibrary/src/ui/ui").ErrorBoundary} ErrorBoundary
 * @typedef {import("../../BDPluginLibrary/src/ui/ui").Tooltip} Tooltip
 * @typedef {import("../../BDPluginLibrary/src/ui/ui").Toasts} Toasts
 * @typedef {import("../../BDPluginLibrary/src/ui/settings/index")} Settings
 * @typedef {import("../../BDPluginLibrary/src/modules/modules")} Modules
 * @typedef {import("../../BDPluginLibrary/src/structs/plugin.js")} Plugin
 */
/**
 * @typedef {Modules & {
 * DiscordContextMenu: DiscordContextMenu
 * DiscordContextMenu: DCM
 * ContextMenu: ContextMenu
 * Tooltip: Tooltip
 * Toasts: Toasts
 * Settings: Settings
 * Popouts: Popouts
 * Modals: Modals
 * }} Library
 */
/**
 * Creates the plugin class
 * @param {typeof Plugin} Plugin
 * @param {Library} Library
 * @returns {typeof globalThis.Plugin}
 */
module.exports = (Plugin, Library) => {
    const { Patcher } = Library;

    return class AutoIdleOnAFK extends Plugin {
        constructor() {
            super();

            this.getSettingsPanel = () => {
                return this.buildSettingsPanel().getElement();
            };
        }
        onStart() {
            console.log(this);
        }

        onStop() {
            Patcher.unpatchAll();
        }
    };
};
