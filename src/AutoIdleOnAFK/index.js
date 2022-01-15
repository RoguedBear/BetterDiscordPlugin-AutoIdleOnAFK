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
    const { Logger, DiscordModules } = Library;
    const {
        SelectedChannelStore: { getVoiceChannelId },
    } = DiscordModules;

    var DEBUG = false;
    function log_debug(module, ...message) {
        if (DEBUG !== true) {
            return;
        } else {
            Logger.debug(module, ...message);
        }
    }

    return class AutoIdleOnAFK extends Plugin {
        constructor() {
            super();

            this.getSettingsPanel = () => {
                return this.buildSettingsPanel().getElement();
            };

            // Some instance variables
            this.afkTimeoutID = undefined;
            this.keyIdleSetByPlugin = "IdleSetByPlugin";
            this.OnBlurBounded = this.onBlurFunction.bind(this);
            this.boundOnFocusBounded = this.onFocusFunction.bind(this);
        }

        onStart() {
            if (this._config.DEBUG === true) {
                DEBUG = true;
                log_debug(this);
                // TODO: remove these debug statemetns
                log_debug(this.currentStatus());
                log_debug(getVoiceChannelId());
                log_debug(this.inVoiceChannel());
                log_debug(
                    "onlineStatusAndNotInVC: " + this.onlineStatusAndNotInVC()
                );
            }
            window.addEventListener("blur", this.OnBlurBounded);
            window.addEventListener("focus", this.boundOnFocusBounded);
        }

        onStop() {
            clearTimeout(this.afkTimeoutID);
            window.removeEventListener("blur", this.OnBlurBounded);
            window.removeEventListener("focus", this.boundOnFocusBounded);
        }

        onBlurFunction() {
            // TODO: remove this
            log_debug("Focus lost from discord window");

            if (this.onlineStatusAndNotInVC()) {
                log_debug("setting timeout of " + this.settings.afkTimeout);
                this.afkTimeoutID = setTimeout(() => {
                    log_debug(
                        "Change status to: '" +
                            this.settings.afkStatus +
                            "' boop."
                    );
                    if (this.onlineStatusAndNotInVC()) {
                        this.updateStatus(this.settings.afkStatus);
                        BdApi.saveData(
                            this._config.info.name,
                            this.keyIdleSetByPlugin,
                            true
                        );
                    }
                }, this.settings.afkTimeout * 60 * 1000); // converting min to ms
            }
        }

        onFocusFunction() {
            // TODO: remove this
            log_debug("Discord window in focus now");

            // if user opens discord before the afkTimeout, clear the pending
            // timeout (if it even exists)
            if (this.afkTimeoutID != undefined) {
                Logger.debug("Cancelling " + this.afkTimeoutID); // TODO: remove this
                clearTimeout(this.afkTimeoutID);
                this.afkTimeoutID = undefined;
            }
        }

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

        /**
         * Updates the remote status to the param `toStatus`
         * @param {('online'|'idle'|'invisible')} toStatus
         */
        updateStatus(toStatus) {
            /* TODO: uncomment this later. dont wanna spam status change and
                    \*possibly* have my account banned
            */
            // BdApi.findModuleByProps(
            //     "updateRemoteSettings"
            // ).updateRemoteSettings({ status: toStatus });
        }
    };
};
