class Storage {
    set(key, data) {
        return new Promise((resolve, reject) => {
            wx.setStorage({
                key, data,
                success: resp => resolve(resp),
                fail: resp => reject(resp)
            });
        });
    }

    setSync(key, data) {
        wx.setStorageSync(key, data);
    }

    get(key) {
        return new Promise((resolve, reject) => {
            wx.getStorage({
                key,
                success: resp => resolve(resp),
                fail: resp => reject(resp)
            });
        });
    }

    getSync(key) {
        return wx.getStorageSync(key);
    }

    remove(key) {
        return new Promise((resolve, reject) => {
            wx.removeStorage({
                key,
                success: resp => resolve(resp),
                fail: resp => reject(resp)
            });
        });
    }

    removeSync(key) {
        return wx.removeStorageSync(key);
    }

    info() {
        return new Promise((resolve, reject) => {
            wx.getStorageInfo({
                success: resp => resolve(resp),
                fail: resp => reject(resp)
            });
        });
    }

    infoSync() {
        return wx.getStorageInfoSync();
    }

    clear() {
        wx.clearStorage();
    }

    clearSync() {
        wx.clearStorageSync();
    }
}

export default {
    install(app, options) {
        app.plugin('storage', new Storage(options));
    }
}