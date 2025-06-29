/*
MIT License

Copyright (c) 2022 RoguedBear

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import Settings from "./settings";

export default class AutoIdleOnAFK {
    constructor() {
        this._config = {
            info: {
                name: "AutoIdleOnAFK",
            },
        };

        this.settings = new Settings();

        // Some instance variables
        this.afkTimeoutID = undefined; // timeout set by onBlur
        this.backFromAFKTimeoutID = undefined; // timeout set by onFocus
        // key used as a flag to detect if afk was set by the plugin or manually by user
        this.keyIdleSetByPlugin = "IdleSetByPlugin";

        this.OnBlurBounded = this.onBlurFunction.bind(this);
        this.boundOnFocusBounded = this.onFocusFunction.bind(this);
    }

    getSettingsPanel() {
        return this.settings.getSettingsPanel();
    }


    start() {
        if (this.settings.getValue("showDebug") === true) {
            this.log_debug(this);
            this.log_debug("Current status: " + this.currentStatus());
            this.log_debug("In Voice Channel: " + this.inVoiceChannel());
            this.log_debug(
                "onlineStatusAndNotInVC: " + this.onlineStatusAndNotInVC()
            );
        }

        window.addEventListener("blur", this.OnBlurBounded);
        window.addEventListener("focus", this.boundOnFocusBounded);
    }

    stop() {
        clearTimeout(this.afkTimeoutID);
        clearTimeout(this.backFromAFKTimeoutID);
        window.removeEventListener("blur", this.OnBlurBounded);
        window.removeEventListener("focus", this.boundOnFocusBounded);
    }

    onBlurFunction() {
        this.log_debug("Focus lost from discord window");

        // if user closes discord before the backToOnlineTimeout, clear the
        // pending timeout (if it even exists)
        this.backFromAFKTimeoutID = this.cancelTimeout(
            this.backFromAFKTimeoutID
        );

        var __afkSetByPlugin = BdApi.loadData(
            this._config.info.name,
            this.keyIdleSetByPlugin
        );
        var inVoiceChannelAndIdleSetByPlugin =
            this.inVoiceChannel() && __afkSetByPlugin;

        var inVoiceChannelAndAlwaysOnlineEnabled =
            this.inVoiceChannel() && this.settings.getValue("alwaysOnline");

        if (this.onlineStatusAndNotInVC()) {
            var _timeout_ms =
                this.settings.getValue("afkTimeout") * (this.settings.getValue("showDebug") ? 2 : 60) * 1000;
            this.log_debug("setting timeout of " + _timeout_ms + "ms");
            this.afkTimeoutID = setTimeout(() => {
                if (this.onlineStatusAndNotInVC()) {
                    this.updateStatus(this.settings.getValue("afkStatus"));
                    BdApi.saveData(
                        this._config.info.name,
                        this.keyIdleSetByPlugin,
                        true
                    );
                }
                // If DEBUG is enabled then keep a shorter duration than 60s
            }, _timeout_ms); // converting min to ms
        } else if (
            // if the user is in a VC, idle was set by plugin &
            // their current status == afkStatus
            (inVoiceChannelAndIdleSetByPlugin ||
                // OR, is user in VC and always online is enabled
                inVoiceChannelAndAlwaysOnlineEnabled) &&
            this.currentStatus() == this.settings.getValue("afkStatus")
        ) {
            this.updateStatus("online");
            this.showToast("Changing status back to online, You are in VC");
            BdApi.saveData(
                this._config.info.name,
                this.keyIdleSetByPlugin,
                false
            );
        }
    }

    onFocusFunction() {
        this.log_debug("Discord window in focus now");

        // if user opens discord before the afkTimeout, clear the pending
        // timeout (if it even exists)
        this.afkTimeoutID = this.cancelTimeout(this.afkTimeoutID);

        this.log_debug(
            "Setting timeout of " +
            this.settings.getValue("backToOnlineDelay") * 1000 +
            " ms"
        );
        this.backFromAFKTimeoutID = setTimeout(() => {
            // TODO: Refactor/comment out/test more this part
            var __afkSetByPlugin = BdApi.loadData(
                this._config.info.name,
                this.keyIdleSetByPlugin
            );
            var statusIsAFKAndWasSetByPlugin =
                this.currentStatus() === this.settings.getValue("afkStatus") &&
                __afkSetByPlugin === true;

            var statusIsAFKAndAlwaysOnlineIsTrue =
                this.currentStatus() === this.settings.getValue("afkStatus") &&
                this.settings.getValue("alwaysOnline") === true;

            if (statusIsAFKAndWasSetByPlugin) {
                this.showToast("Changing status back to online");
                this.updateStatus("online");
                BdApi.saveData(
                    this._config.info.name,
                    this.keyIdleSetByPlugin,
                    false
                );
            } else if (statusIsAFKAndAlwaysOnlineIsTrue) {
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
                this.log_debug(
                    "User overrode the status. leaving status unchanged..."
                );
            }
        }, this.settings.getValue("backToOnlineDelay") * 1000);
    }

    /**
     * Cancles the given timeout id
     * @param {number} timeoutId
     * @returns {undefined}
     */
    cancelTimeout(timeoutId) {
        if (timeoutId != undefined) {
            this.log_debug("Cancelling timeout " + timeoutId);
            clearTimeout(timeoutId);
            return undefined;
        }
    }

    /**
     * @returns {string} the current user status
     */
    currentStatus() {
        return this.UserSettingsProtoStore.settings.status.status.value;
    }
    /**
     * @returns {boolean} if user is in a VC
     */
    inVoiceChannel() {
        return (
            this.settings.getValue("ignoreVCState") === false &&
            this.getVoiceChannelId() !== null
        );
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
     * @param {('online'|'idle'|'invisible'|'dnd')} toStatus
     */
    updateStatus(toStatus) {
        if (
            this._config.DEBUG === true &&
            this._config.DEBUG_ActuallyChangeStatus === false
        ) {
            this.log_debug("Changing (but not changing) status to: " + toStatus);
            return;
        }
        this.log_debug("Actually changing status to: " + toStatus);
        this.UserSettingsProtoUtils.updateAsync(
            "status",
            (statusSetting) => {
                this.log_debug(statusSetting);
                statusSetting.status.value = toStatus;
            },
            0
        );
    }

    /**
     * shows toast message based on showToast settings
     * @param {string} msg
     */
    showToast(msg) {
        if (this.settings.getValue("showToasts")) {
            BdApi.showToast(msg);
        }
    }

    getVoiceChannelId() {
        return BdApi.Webpack.getByKeys("getLastSelectedChannelId").getVoiceChannelId() || null;
    }

    UserSettingsProtoStore = BdApi.Webpack.getModule(
        (m) =>
            m &&
            typeof m.getName == "function" &&
            m.getName() == "UserSettingsProtoStore" &&
            m,
        { first: true, searchExports: true }
    );

    UserSettingsProtoUtils = BdApi.Webpack.getModule(
        (m) =>
            m.ProtoClass &&
            m.ProtoClass.typeName.endsWith(".PreloadedUserSettings"),
        { first: true, searchExports: true }
    );


    log_debug(module, ...message) {
        if (this.settings.getValue("showDebug") !== true) {
            return;
        } else {
            console.log(module, ...message);
        }
    }
};
