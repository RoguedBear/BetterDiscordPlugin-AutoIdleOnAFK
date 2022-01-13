module.exports = (Plugin, Library) => {
    const { Patcher } = Library;
    return class AutoIdleOnAFK extends Plugin {
        onStart() {
            console.log(this);
        }

        onStop() {
            Patcher.unpatchAll();
        }
    };
};
