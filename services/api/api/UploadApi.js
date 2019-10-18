import regeneratorRuntime from '../../../lib/runtime';
const moment = require('../../../lib/moment.min.js');
const Base64 = require('../../../lib/base64.js');

function getExtFileName(o){
    var pos=o.lastIndexOf(".");
    return o.substring(pos+1);
}

function random_string(len) {
　　len = len || 32;
　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
　　var maxPos = chars.length;
　　var random = '';
　　for (var i = 0; i < len; i++) {
        random += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return random;
}

const __wx_upload = function (url, path, ossvalid, key ) {
  console.log('图片地址', url, '文件路径', path,'签名','token',key)
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url,
            filePath: path,
            name: 'file',
            formData: {
                'name':path,
                'key': key,
                'policy': ossvalid.policy,
                'OSSAccessKeyId': ossvalid.accessKeyId,
                'x-oss-security-token':ossvalid.securityToken,
                'signature': ossvalid.signature,
                'success_action_status': '200'
            },
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


class UploadApi {
    constructor(options) {
        const { auth, path, extparam } = options;
        this._path = path;
        this._auth = auth;
        this._extparam = extparam;
    }

    async upload(path) {
        const url = this._extparam.getParamsOther().uploadUrl;
      
        const token = await this._auth.token();

        const ossvalid = await __wx_request({
            url: this._path.absolute('/aliyun/getTempOSSToken'),
            method: 'POST',
            data: this._extparam.getParams({parameter:JSON.stringify({}),token:token}),
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        })

        const ossvalidv = ossvalid.data.result;
        const valid = JSON.parse(Base64.base64_decode(ossvalidv));
        
        const filename = moment().format('YYYYMMDDHH24MISS')+random_string(6);
        const extFileName = getExtFileName(path);
        const key = valid.rootPath+'/'+filename+'.'+extFileName;
        
        return await __wx_upload( url, path, valid, key ).then(resp => {
            return {
                key:key
            };
        });
    }
}

export default UploadApi;