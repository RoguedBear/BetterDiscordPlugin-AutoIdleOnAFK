/**
 * @name AutoIdleOnAFK
 * @author RoguedBear
 * @version 0.5.1
 * @description Automatically updates your discord status to 'idle' when you haven't opened your discord client for more than 5 minutes.
Plugin only works when your status is 'online' and you are not in a voice channel. 

For Bugs or Feature Requests open an issue on my Github
 * @github https://github.com/RoguedBear/BetterDiscordPlugin-AutoIdleOnAFK
 * @github_raw https://raw.githubusercontent.com/RoguedBear/BetterDiscordPlugin-AutoIdleOnAFK/main/release/AutoIdleOnAFK.plugin.js
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/AutoIdleOnAFK/settings.js":
/*!***************************************!*\
  !*** ./src/AutoIdleOnAFK/settings.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Settings)
/* harmony export */ });
const defaults = {
    changelog: [
        {
            type: "fixed",
            title: "(v0.5.1) Updated Deprecated Methods",
            items: [
                "just a small update which updates the functions that have been deprecated in BD Api to newer ones",
                "Credits to **MsNecromancer** (GitHub & Discord) for her time and efforts spent on this `:)`",
            ],
        },
        {
            type: "fixed",
            title: "(v0.5.0) Fixed Settings Page & Plugin Refactor!",
            items: [
                "It's been a _longgg_ while since this plugin has received any update\nI've been busy with life. :)",
                "This update fixes the settings panel, which broke a month or so back",
                "In doing so, plugin was refactored to remove the  dependency on `ZeresPluginLibrary` keeping up with the new way to write BD plugins.",
                "**A \\*HUGE\\*** credit goes to **opdude** (GitHub & Discord) for their time and effort in this refactor and the fixes!",
            ],
        },
    ],
    settings: [
        {
            type: "radio",
            name: "Change Status To:",
            note: "the status selected will be switched to when AFK. default: Idle",
            id: "afkStatus",
            value: "idle",
            options: [
                {
                    name: "Idle",
                    value: "idle",
                },
                {
                    name: "Invisible",
                    value: "invisible",
                },
                {
                    name: "Do Not Disturb",
                    value: "dnd",
                },
            ],
        },
        {
            type: "slider",
            name: "AFK Timeout (minutes)",
            note: "minutes to wait before changing your status to Idle/Invisible",
            id: "afkTimeout",
            defaultValue: 5,
            min: 5,
            max: 30,
            units: "min",
            markers: [5, 10, 15, 20, 25, 30],
        },
        {
            type: "slider",
            name: "Back To Online Delay (Grace/Cooldown Period)",
            note: "seconds to wait before changing your status back to Online. if you close or unfocus discord window, status will not be changed",
            id: "backToOnlineDelay",
            defaultValue: 10,
            value: 10,
            min: 5,
            max: 120,
            units: "s",
            markers: [5, 10, 30, 60, 90, 120],
        },
        {
            type: "switch",
            name: "Ignore VC state when going AFK",
            note: "Allows going to Idle mode even when you are in a VC. default: off",
            id: "ignoreVCState",
            value: false,
            defaultValue: false,
        },
        {
            type: "switch",
            name: "Always Revert To Online",
            note: "Come back online even if this plugin didn't change your status. Useful for multiple devices.",
            id: "alwaysOnline",
            value: false,
            defaultValue: false,
        },
        {
            type: "switch",
            name: "Show toast messages?",
            note: 'toggles the visibility of "Changing status back to online" toast message',
            id: "showToasts",
            defaultValue: true,
            value: true,
        },
        {
            type: "switch",
            name: "Enable debug mode?",
            note: "toggles the visibility of debug messages and decreases AFK timeout for testing purposes",
            id: "showDebug",
            defaultValue: false,
            value: false,
        },
    ],
};

class Settings {
    constructor() {
        const settings = defaults;
        const storedData = BdApi.Data.load("AutoIdleOnAFK", "settings") || {};
        settings.settings.forEach((setting) => {
            const storedSetting = (storedData.settings || []).find(
                (s) => s.id === setting.id,
            );
            if (storedSetting && storedSetting.value !== undefined) {
                setting.value = storedSetting.value;
            }
        });

        this.settings = settings;
    }

    getValue(id) {
        const setting = this.settings.settings.find((s) => s.id === id);
        if (setting) {
            return setting.value;
        }
        return null;
    }

    getSettingsPanel() {
        return BdApi.UI.buildSettingsPanel({
            settings: this.settings.settings,
            onChange: (_, id, value) => {
                const setting = this.settings.settings.find((s) => s.id === id);
                if (setting) {
                    setting.value = value;
                    BdApi.Data.save("AutoIdleOnAFK", "settings", {
                        settings: this.settings.settings,
                    });
                }
            },
        });
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************************!*\
  !*** ./src/AutoIdleOnAFK/index.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AutoIdleOnAFK)
/* harmony export */ });
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings */ "./src/AutoIdleOnAFK/settings.js");
/*
MIT License

Copyright (c) 2022-2025 RoguedBear

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


class AutoIdleOnAFK {
    UserSettingsProtoStore = BdApi.Webpack.getModule(
        (m) =>
            m &&
            typeof m.getName == "function" &&
            m.getName() == "UserSettingsProtoStore" &&
            m,
        {
            first: true,
            searchExports: true,
        },
    );

    UserSettingsProtoUtils = BdApi.Webpack.getModule(
        (m) =>
            m.ProtoClass &&
            m.ProtoClass.typeName.endsWith(".PreloadedUserSettings"),
        {
            first: true,
            searchExports: true,
        },
    );

    SelectedChannelStore = BdApi.Webpack.getByKeys("getLastSelectedChannelId");

    constructor(meta) {
        this._config = {
            info: {
                name: "AutoIdleOnAFK",
            },
        };
        this.meta = meta;

        this.settings = new _settings__WEBPACK_IMPORTED_MODULE_0__["default"]();

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
                "onlineStatusAndNotInVC: " + this.onlineStatusAndNotInVC(),
            );
        }

        window.addEventListener("blur", this.OnBlurBounded);
        window.addEventListener("focus", this.boundOnFocusBounded);
        this.showChangelog();
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
            this.backFromAFKTimeoutID,
        );

        var __afkSetByPlugin = BdApi.Data.load(
            this._config.info.name,
            this.keyIdleSetByPlugin,
        );
        var inVoiceChannelAndIdleSetByPlugin =
            this.inVoiceChannel() && __afkSetByPlugin;

        var inVoiceChannelAndAlwaysOnlineEnabled =
            this.inVoiceChannel() && this.settings.getValue("alwaysOnline");

        if (this.onlineStatusAndNotInVC()) {
            var _timeout_ms =
                this.settings.getValue("afkTimeout") *
                (this.settings.getValue("showDebug") ? 2 : 60) *
                1000;
            this.log_debug("setting timeout of " + _timeout_ms + "ms");
            this.afkTimeoutID = setTimeout(() => {
                if (this.onlineStatusAndNotInVC()) {
                    this.updateStatus(this.settings.getValue("afkStatus"));
                    BdApi.Data.save(
                        this._config.info.name,
                        this.keyIdleSetByPlugin,
                        true,
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
            BdApi.Data.save(
                this._config.info.name,
                this.keyIdleSetByPlugin,
                false,
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
                " ms",
        );
        this.backFromAFKTimeoutID = setTimeout(() => {
            // TODO: Refactor/comment out/test more this part
            var __afkSetByPlugin = BdApi.Data.load(
                this._config.info.name,
                this.keyIdleSetByPlugin,
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
                BdApi.Data.save(
                    this._config.info.name,
                    this.keyIdleSetByPlugin,
                    false,
                );
            } else if (statusIsAFKAndAlwaysOnlineIsTrue) {
                /**
                     * Note: Using BdApi.UI.showToast() directly instead of
                     * this.showToast()
                     *
                     * The showToast() method only displays messages if the user has
                     * enabled the "Show toast messages" setting. However, when the
                     * plugin changes the user's status from idle back to online, I
                     * believe we should notify the user regardless of their toast
                     * preference

                    */
                BdApi.UI.showToast("Changing status back to online");
                this.updateStatus("online");
                BdApi.Data.save(
                    this._config.info.name,
                    this.keyIdleSetByPlugin,
                    false,
                );
            } else if (__afkSetByPlugin == undefined) {
                return;
            } else {
                BdApi.Data.delete(
                    this._config.info.name,
                    this.keyIdleSetByPlugin,
                );
                this.log_debug(
                    "User overrode the status. leaving status unchanged...",
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
            this.SelectedChannelStore.getVoiceChannelId() !== null
        );
    }

    /**
     * Returns if the current status is 'online' and the user is not in a
     * voice channel
     * @returns
     */
    onlineStatusAndNotInVC() {
        return (
            this.currentStatus() === "online" && this.inVoiceChannel() === false
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
            this.log_debug(
                "Changing (but not changing) status to: " + toStatus,
            );
            return;
        }
        this.log_debug("Actually changing status to: " + toStatus);
        this.UserSettingsProtoUtils.updateAsync(
            "status",
            (statusSetting) => {
                this.log_debug(statusSetting);
                statusSetting.status.value = toStatus;
            },
            0,
        );
    }

    /**
     * shows toast message based on showToast settings
     * @param {string} msg
     */
    showToast(msg) {
        if (this.settings.getValue("showToasts")) {
            BdApi.UI.showToast(msg);
        }
    }

    log_debug(module, ...message) {
        if (this.settings.getValue("showDebug") !== true) {
            return;
        } else {
            console.log(module, ...message);
        }
    }

    showChangelog() {
        const currentVersionInfo = BdApi.Data.load(
            this._config.info.name,
            "currentVersionInfo",
        );
        if (
            currentVersionInfo &&
            currentVersionInfo.version &&
            currentVersionInfo.version === this.meta.version
        ) {
            return;
        }
        BdApi.UI.showChangelogModal({
            title: this.meta.name,
            subtitle: "version " + this.meta.version,
            changes: this.settings.settings.changelog,
        });
        BdApi.Data.save(this._config.info.name, "currentVersionInfo", {
            version: this.meta.version,
        });
    }
}

})();

module.exports = __webpack_exports__["default"];
/******/ })()
;