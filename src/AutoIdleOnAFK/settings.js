const defaults = {
    changelog: [
        {
            type: "fixed",
            title: "Fixed Settings Page & Plugin Refactor!",
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

export default class Settings {
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
