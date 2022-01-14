module.exports = (Plugin, Library) => {
    const { Patcher } = Library;
    return class AutoIdleOnAFK extends Plugin {
        constructor() {
            super();

            // FIXME: display default values in the slider/radiogroup
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
