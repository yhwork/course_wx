const __defaults = {
    key: 'CHILD'
};

class Child {
    constructor(options) {
        this._options = Object.assign({}, __defaults, options);
    }

    set(child) {
        wx.setStorageSync(this._options.key, child);
    }

    get() {
        return wx.getStorageSync(this._options.key);
    }
}

export default {
    install(app, options) {
        app.plugin('child', new Child(options));
    }
}