const __defaults = {
    schema: 'http',
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

        return `${schema}://${host}${strPort}/iforbao/${path.replace(/^\/+/, '')}`;
      // return `${schema}://${host}${strPort}/${path.replace(/^\/+/, '')}`;

    }
}

export default Path