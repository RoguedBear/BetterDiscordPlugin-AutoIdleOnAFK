/**
 * @name AutoIdleOnAFK
 * @description Automatically updates your discord status to 'idle' when you haven't opened your discord client for more than 5 minutes.
Plugin only works when your status is 'online' and you are not in a voice channel. 

For Bugs or Feature Requests open an issue on my Github
 * @version 0.3.2
 * @author RoguedBear
 * @authorLink https://github.com/RoguedBear
 * @website https://github.com/RoguedBear/BetterDiscordPlugin-AutoIdleOnAFK
 * @source https://github.com/RoguedBear/BetterDiscordPlugin-AutoIdleOnAFK/releases/latest/download/AutoIdleOnAFK.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
const config = {
    "info":
    {
        "name": "AutoIdleOnAFK",
        "authors":
            [{
                "name": "RoguedBear",
                "github_username": "RoguedBear"
            }],
        "authorLink": "https://github.com/RoguedBear",
        "version": "0.3.2",
        "description": "Automatically updates your discord status to 'idle' when you haven't opened your discord client for more than 5 minutes.\nPlugin only works when your status is 'online' and you are not in a voice channel. \n\nFor Bugs or Feature Requests open an issue on my Github",
        "github": "https://github.com/RoguedBear/BetterDiscordPlugin-AutoIdleOnAFK",
        "github_raw": "https://github.com/RoguedBear/BetterDiscordPlugin-AutoIdleOnAFK/releases/latest/download/AutoIdleOnAFK.plugin.js"
    },
    "changelog":
        [{
            "type": "added",
            "title": "What's New?",
            "items":
                ["Now you can choose if the plugin will change your status only from \"Online\" or from all the status.\n*[default: only from \"Online\"]*",
                    "Updated time limits, now they are from ~~5 minutes~~ **1 minute** to ~~30 minutes~~ **12 hours**.\n*[default: 5 minutes]*",
                    "Now you can choose the status for when you come back to your pc.\n*[default: \"Online\"]*"]
        },
        {
            "title": "Fixed issues",
            "type": "progress",
            "items":
                ["Now the plugin will correctly save the settings.",
                    "Now your status will correctly set as \"Online\"."]
            }
            ,{
                "title": "Removed:",
                "type": "fixed",
                "items":
                    ["You can no longer set \"Invisible\" as status to set when you are back."]
            },{
                "type": "added",
                "title": "Credits:",
                "items":
                    ["All these features have been added by Haxurus."]
            }
        ],
    "main": "index.js",
    "DEBUG": false,
    "DEBUG_ActuallyChangeStatus": false,
    "defaultConfig":
        [{
            "type": "radio",
            "name": "Change Status To:",
            "note": "the status selected will be switched to when AFK. default: Idle",
            "id": "afkStatus",
            "value": "idle",
            "options":
                [{ "name": "Idle", "value": "idle" },
                { "name": "Invisible", "value": "invisible" },
                { "name": "Do Not Disturb", "value": "dnd" }]
        },
        {
            "type": "slider",
            "name": "AFK Timeout (minutes)", "note": "minutes to wait before changing your status to Idle/Invisible",
            "id": "afkTimeoutMin",
            "value": 1,
            "defaultValue": 5,
            "min": 1,
            "max": 30,
            "units": "min",
            "markers": [1, 5, 10, 15, 20, 25, 30]
        },
        {
            "type": "slider",
            "name": "AFK Timeout (minutes)", "note": "hours to wait before changing your status to Idle/Invisible",
            "id": "afkTimeoutH",
            "value": 0,
            "defaultValue": 0,
            "min": 0,
            "max": 12,
            "units": "h",
            "markers": [0, 1, 2, 6, 12]
        },
        {
            "type": "slider",
            "name": "Back To Online Delay (Grace/Cooldown Period)",
            "note": "seconds to wait before changing your status back to Online. if you close or unfocus discord window, status will not be changed",
            "id": "backToOnlineDelay",
            "defaultValue": 10,
            "value": 10,
            "min": 5,
            "max": 120,
            "units": "s",
            "markers": [5, 10, 30, 60, 90, 120]
        },
        {
            "type": "switch",
            "name": "Always Revert To Online",
            "note": "Come back online even if this plugin didn't change your status. Useful for multiple devices.",
            "id": "alwaysOnline",
            "value": false,
            "defaultValue": false
        },
        {
            "type": "switch",
            "name": "Show toast messages?",
            "note": "toggles the visibility of \"Changing status back to online\" toast message",
            "id": "showToasts",
            "defaultValue": true,
            "value": true
        },
        {
            "type": "switch",
            "name": "Change status only from \"Online\"?",
            "note": "change your status only if you are actually \"Online\"",
            "id": "onlyOnline",
            "defaultValue": true,
            "value": true
        },
        {
            "type": "radio",
            "name": "When you return, set status to:",
            "note": "the status selected will be switched to when you will be back. default: Online",
            "id": "goBackStatus",
            "value": "online",
            "options":
                [{ "name": "Online", "value": "online" },
                { "name": "Idle", "value": "idle" },
                { "name": "Do Not Disturb", "value": "dnd" }]
        }
        ]
};

class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
    const plugin = (Plugin, Library) => {
    const { Logger, DiscordModules } = Library;
    const {
        SelectedChannelStore: { getVoiceChannelId },
    } = DiscordModules;

    // Logger.info("VC: " + getVoiceChannelId());
    const StatusSetting =
        BdApi.findModuleByProps("StatusSetting").StatusSetting;

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
                log_debug("onlineStatusAndNotInVC: " + this.onlineStatusAndNotInVC());
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

            var __afkSetByPlugin = BdApi.loadData(
                this._config.info.name,
                this.keyIdleSetByPlugin
            );
            var inVoiceChannelAndIdleSetByPlugin =
                this.inVoiceChannel() && __afkSetByPlugin;

            var inVoiceChannelAndAlwaysOnlineEnabled =
                this.inVoiceChannel() && this.settings.alwaysOnline;

            if (this.onlineStatusAndNotInVC()) {
                var _timeout_ms =
                    this.settings.afkTimeoutMin * (DEBUG ? 2 : 60) * 1000 + this.settings.afkTimeoutH * (DEBUG ? 2 : 60) * 1000 * 60;
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
            } else if (
                // if the user is in a VC, idle was set by plugin &
                // their current status == afkStatus
                (inVoiceChannelAndIdleSetByPlugin ||
                    // OR, is user in VC and always online is enabled
                    inVoiceChannelAndAlwaysOnlineEnabled) &&
                this.currentStatus() == this.settings.afkStatus
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
            // TODO: remove this
            log_debug("Discord window in focus now");

            // if user opens discord before the afkTimeout, clear the pending
            // timeout (if it even exists)
            this.afkTimeoutID = this.cancelTimeout(this.afkTimeoutID);

            log_debug(
                "Setting timeout of " +
                    this.settings.backToOnlineDelay * 1000 +
                    " ms"
            );
            this.backFromAFKTimeoutID = setTimeout(() => {
                // TODO: Refactor/comment out/test more this part
                var __afkSetByPlugin = BdApi.loadData(
                    this._config.info.name,
                    this.keyIdleSetByPlugin
                );
                var statusIsAFKAndWasSetByPlugin =
                    this.currentStatus() === this.settings.afkStatus &&
                    __afkSetByPlugin === true;

                var statusIsAFKAndAlwaysOnlineIsTrue =
                    this.currentStatus() === this.settings.afkStatus &&
                    this.settings.alwaysOnline === true;

                if (statusIsAFKAndWasSetByPlugin) {
                    this.showToast("Changing status back to " + this.settings.goBackStatus);
                    this.updateStatus(this.settings.goBackStatus);
                    BdApi.saveData(
                        this._config.info.name,
                        this.keyIdleSetByPlugin,
                        false
                    );
                } else if (statusIsAFKAndAlwaysOnlineIsTrue) {
                    BdApi.showToast("Changing status back to " + this.settings.goBackStatus);
                    this.updateStatus(this.settings.goBackStatus);
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
                log_debug("Cancelling timeout " + timeoutId); // TODO: remove this
                clearTimeout(timeoutId);
                return undefined;
            }
        }

        /**
         * @returns {string} the current user status
         */
        currentStatus() {
            return StatusSetting.getSetting();
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
            if (this.settings.onlyOnline) {
                return (
                    this.currentStatus() === "online" &&
                    this.inVoiceChannel() === false
                );
            }
            return (
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
                log_debug("Changing (but not changing) status to: " + toStatus);
                return;
            }
            log_debug("Actually changing status to: " + toStatus);
            StatusSetting.updateSetting(toStatus);
        }

        /**
         * shows toast message based on showToast settings
         * @param {string} msg
         */
        showToast(msg) {
            if (this.settings.showToasts) {
                BdApi.showToast(msg);
            }
        }
    };
};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/
