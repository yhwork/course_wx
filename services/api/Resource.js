import regeneratorRuntime from '../../lib/runtime'


const __default_token = async function (auth) {
    const token = await auth.token();
    return token;
}

const __default_params = function () {
    return {};
}

const __replace_url = function (url, params) {
    const flatParams = Object.keys(params).map(key => ({ key, value: params[key] }));
    return url.replace(/\{(.*?)\}/ig, (name) => {
        const found = flatParams.find(x => `{${x.key}}` === name);
        if (!found)
            throw new Error(`cannot find param ${name}`);
        return found.value;
    });
}

const __map_data = function (data, map) {
    map = map || (item => item);
    if (Array.isArray(data))
        return data.map(map);

    return map(data);
}

const __config_method = function (auth, path, extparam, options) {
    const { name, method, url, map } = options;
    return async (args) => {
        args = args || {};
        const token = await __default_token(auth);
        const params = Object.assign({}, __default_params(), args.params);
        const data = extparam.getParams({parameter:JSON.stringify(args.model),token:token});
        const absolute = path.absolute(__replace_url(url,params));


        return new Promise((resolve, reject) => {
            console.log('请求参数')
            wx.request({
                url: absolute,
                method:"POST",
                data:data,
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: resp => {
                  // console.log(resp)
                    if (resp.statusCode !== 200) {
                        reject(resp);
                    } else {
                        const { errorCode, errorMessage, result } = resp.data;
                        if(errorCode=='300000'){
                            auth.login().then(
                                __config_method(auth, path, extparam, options)  
                            );
                            
                        }else if(errorCode=='100001' || errorCode=='100003' || errorCode=='100005' || errorCode=='100065'){
                            wx.showModal({
                              title: '警告',
                              content: errorMessage,
                              //confirmText: '确定',
                              confirmColor: '#f29219',
                              showCancel:false,
                              cancelText: '确定',
                              success(resp) {
                                if (resp.cancel) {
                                  
                                }
                              }
                            });
                        }else{
                            resolve(resp);
                        }
                        
                        /*if (errorCode !== '0') {
                            if(errorCode=='100006'){
                                resolve(resp);return false;
                            }else if(errorCode=='100001' || errorCode=='100003' || errorCode=='100005'){
                                wx.showModal({
                                  title: '警告',
                                  content: errorMessage,
                                  //confirmText: '确定',
                                  confirmColor: '#f29219',
                                  showCancel:false,
                                  cancelText: '确定',
                                  success(resp) {
                                    if (resp.cancel) {
                                      
                                    }
                                  }
                                });
                            }
                            //console.error(`[name: ${name}][code: ${errorCode}][message: ${errorMessage}][url: ${absolute}][method: ${method}][data: ${JSON.stringify(data)}]`);
                            reject(resp);
                        } else {
                            //console.debug(`[name: ${name}][code: ${errorCode}][message: ${errorMessage}][url: ${absolute}][method: ${method}]`);
                            //console.debug('response: ', resp);
                            //resolve(__map_data(data, map));
                            resolve(resp);
                        }*/
                    }
                },
                fail: resp => {
                    console.error(`[name: ${name}][url: ${absolute}][method: ${method}][data: ${JSON.stringify(data)}]`);
                    reject(resp);
                }
            });
        });
    };
}

class Resource {
    constructor(options, configs) {
        const { auth, path, extparam } = options;
        configs.forEach(options => {
            this[options.name] = __config_method(auth, path, extparam, options);
        });
    }
}

export default Resource