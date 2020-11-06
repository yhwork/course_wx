const __defaults = {
    schema: 'https',
    host: '',
    port: 80
};

class Path {
    constructor(options) {
        this._options = Object.assign({}, __defaults, options);
    }

    absolute(path) {
        const { schema, host, port } = this._options;
        const strPort = port === 80 ? '' : `:${port}`;
        console.log('请求参数',`${schema}://${host}${strPort}/iforbao/${path.replace(/^\/+/, '')}`)

        // 正式环境
        return `${schema}://${host}${strPort}/iforbao/${path.replace(/^\/+/, '')}`;
        // 测试环境
        //    return `${schema}://${host}${strPort}/${path.replace(/^\/+/, '')}`;

    }
}

export default Path