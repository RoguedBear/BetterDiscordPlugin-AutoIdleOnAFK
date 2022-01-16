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
            this.afkTimeoutID = undefined; // timeout set by onBlur
            this.backFromAFKTimeoutID = undefined; // timeout set by onFocus
            // key used as a flag to detect if afk was set by the plugin or manually by user
            this.keyIdleSetByPlugin = "IdleSetByPlugin";

            this.OnBlurBounded = this.onBlurFunction.bind(this);
            this.boundOnFocusBounded = this.onFocusFunction.bind(this);
        }

        onStart() {
            if (this._config.DEBUG === true) {
                DEBUG = true;
                log_debug(this);
                log_debug("Current status: " + this.currentStatus());
                log_debug("In Voice Channel: " + this.inVoiceChannel());
                log_debug(
                    "onlineStatusAndNotInVC: " + this.onlineStatusAndNotInVC()
                );
            }
            window.addEventListener("blur", this.OnBlurBounded);
            window.addEventListener("focus", this.boundOnFocusBounded);
        }

        onStop() {
            clearTimeout(this.afkTimeoutID);
            clearTimeout(this.backFromAFKTimeoutID);
            window.removeEventListener("blur", this.OnBlurBounded);
            window.removeEventListener("focus", this.boundOnFocusBounded);
        }

        onBlurFunction() {
            // TODO: remove this
            log_debug("Focus lost from discord window");

            // if user closes discord before the backToOnlineTimeout, clear the
            // pending timeout (if it even exists)
            this.backFromAFKTimeoutID = this.cancelTimeout(
                this.backFromAFKTimeoutID
            );

            if (this.onlineStatusAndNotInVC()) {
                var _timeout_ms =
                    this.settings.afkTimeout * (DEBUG ? 2 : 60) * 1000;
                log_debug("setting timeout of " + _timeout_ms + "ms");
                this.afkTimeoutID = setTimeout(() => {
                    if (this.onlineStatusAndNotInVC()) {
                        this.updateStatus(this.settings.afkStatus);
                        BdApi.saveData(
                            this._config.info.name,
                            this.keyIdleSetByPlugin,
                            true
                        );
                    }
                    // If DEBUG is enabled then keep a shorter duration than 60s
                }, _timeout_ms); // converting min to ms
            }
        }

        onFocusFunction() {
            // TODO: remove this
            log_debug("Discord window in focus now");

            // if user opens discord before the afkTimeout, clear the pending
            // timeout (if it even exists)
            this.afkTimeoutID = this.cancelTimeout(this.afkTimeoutID);

            this.backFromAFKTimeoutID = setTimeout(() => {
                // TODO: Refactor/comment out/test more this part
                var __afkSetByPlugin = BdApi.loadData(
                    this._config.info.name,
                    this.keyIdleSetByPlugin
                );
                var statusIsAFKAndWasSetByPlugin =
                    this.currentStatus() === this.settings.afkStatus &&
                    __afkSetByPlugin === true;

                if (statusIsAFKAndWasSetByPlugin) {
                    BdApi.showToast("Changing status back to online");
                    this.updateStatus("online");
                    BdApi.saveData(
                        this._config.info.name,
                        this.keyIdleSetByPlugin,
                        false
                    );
                } else if (__afkSetByPlugin == undefined) {
                    return;
                } else {
                    BdApi.deleteData(
                        this._config.info.name,
                        this.keyIdleSetByPlugin
                    );
                    Logger.info(
                        "User overrode the status. leaving status unchanged..."
                    );
                }
            }, this.settings.backToOnlineDelay * 1000);
        }

        /**
         * Cancles the given timeout id
         * @param {number} timeoutId
         * @returns {undefined}
         */
        cancelTimeout(timeoutId) {
            if (timeoutId != undefined) {
                log_debug("Cancelling " + timeoutId); // TODO: remove this
                clearTimeout(timeoutId);
                return undefined;
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
            if (
                this._config.DEBUG === true &&
                this._config.DEBUG_ActuallyChangeStatus === false
            ) {
                log_debug("Changing (but not changing) status to: " + toStatus);
                return;
            }
            log_debug("Actually changing status to: " + toStatus);
            BdApi.findModuleByProps(
                "updateRemoteSettings"
            ).updateRemoteSettings({ status: toStatus });
        }
    };
};
