import regeneratorRuntime from '../../lib/runtime'

const __wx_login = function () {
    return new Promise((resolve, reject) => {
        wx.login({
            success: resp => resolve(resp),
            fail: resp => reject(resp)
        });
    });
}

const __wx_request = function (options) {
    return new Promise((resolve, reject) => {
        wx.request(Object.assign({}, {
            success: resp => resolve(resp),
            fail: resp => reject(resp)
        }, options));
    });
}

class Auth {
    constructor(path,extparam) {
        this._path = path;
        this._extparam = extparam;
        this._token = null;
    } 

    async login() {
        const { code } = await __wx_login();
        const data = { code };
        data['js_code'] = `${code}`;
        delete data['code'];
        const retToken = await __wx_request({
            url: this._path.absolute('/login/wxAuthLogin'),
            method: 'POST',
            data: this._extparam.getParams({parameter:JSON.stringify(data)}),
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        });

        const token  = this._token = retToken.data.result.token;

        return token;
    }

    async token() {
        if (this._token !== null) return this._token;
        const token  = await this.login();
        return token;
    }

    async clearToken(){
        if (this._token !== null){
            this._token = null;
        }
    }

}

export default Auth