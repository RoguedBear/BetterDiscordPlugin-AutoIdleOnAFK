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
    const { DiscordModules } = Library;
    const {
        SelectedChannelStore: { getVoiceChannelId },
    } = DiscordModules;
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
        /**
         * @returns {string} the current user status
         */
        currentStatus() {
            return BdApi.findAllModules((m) => m.default && m.default.status)[0]
                .default.status;
        }
        /**
         * @returns {boolean} if user is in a VC
         */
        inVoiceChannel() {
            return getVoiceChannelId() !== null;
        }

        /**
         * Returns if the current status is 'online' and the user is not in a
         * voice channel
         * @returns
         */
        onlineStatusAndNotInVC() {
            return (
                this.currentStatus() === "online" &&
                this.inVoiceChannel() === false
            );
        }
    };
};
