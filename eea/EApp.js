const __mirror = function (obj, cls, id) {
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
            __mirror(obj[key]);
        } else {
            obj[key] = `${cls ? cls + '/' : ''}${id ? id + '/' : ''}${key}`;
        }
    });
}

const __mirror_config = function (id, config) {
    const defaults = { events: {}, effects: {}, actions: {} };
    const { events, effects, actions } = Object.assign({}, defaults, config);
    __mirror(events, 'EVENTS', id);
    __mirror(effects, 'EFFECTS', id);
    __mirror(actions, 'ACTIONS', id);
}

const __flatten = function (obj) {
    return Object.keys(obj).map(key => ({ key, value: obj[key] }));
}

import { EPool } from './EPool'
import { APP_LIFE } from './const/APP_LIFE'

const __app_life = __flatten(APP_LIFE);

export class EApp {
    static get instance() { return EApp._instance; }
    get data() { return {}; }
    get wxApp() { return this._wxApp; }

    get plugins() { return this._plugins; }
    get events() { return this._events; }
    get effects() { return this._effects; }
    get actions() { return this._actions; }

    constructor() {
        if (typeof EApp._instance !== 'undefined')
            console.error('app has created!');

        EApp._instance = this;
        this._pages = [];
        this._components = [];
        this._plugins = [];
        this._events = new EPool();
        this._effects = new EPool();
        this._actions = new EPool();
    }

    init() {
        const app = this;

        this._appEvents = new EPool();
        const wxAppConfig = {
            globalData: app.data
        };

        //! bind app life events.
        __flatten(this.mapAppEvent())
            .filter(x => __app_life.find(l => l.value === x.key))
            .forEach(item => {
                app._appEvents.on(item.key, item.value, app);
                wxAppConfig[item.key] = function () {
                    app._appEvents.emit(item.key, ...arguments)
                };
            });

        wxAppConfig.onLaunch = function () {
            app._wxApp = this;
            app._appEvents.emit(APP_LIFE.ON_LAUNCH, ...arguments);
        }

        App(wxAppConfig);

        return this;
    }

    register(options) {
        const page_defaults = { id: undefined, type: undefined, config: undefined };
        const _options = Object.assign({}, page_defaults, options);

        const id = _options.id || _options.type.name;
        const index = this._pages.findIndex(item => item.id === id);
        if (index > -1) {
            throw new Error(`found with same page id ${id}`);
            return;
        }

        __mirror_config(id, _options.config);

        const page = new _options.type();
        page._init(this);
        this._pages.push({ id, page });

        return this;
    }

    registerComponent(options) {
        const defaults = { id: undefined, type: undefined, config: undefined };
        const _options = Object.assign({}, defaults, options);

        const id = _options.id || _options.type.name;
        const index = this._pages.findIndex(item => item.id === id);
        if (index > -1) {
            throw new Error(`found with same component id ${id}`);
            return;
        }

        __mirror_config(id, _options.config);

        const component = new _options.type();
        component._init(this);
        this._components.push({ id, component });

        return this;
    }

    mapAppEvent() { return {}; }

    use(plugin, options) {
        plugin.install(this, options);
        return this;
    }

    plugin(name, plugin) {
        if (this._plugins.find(x => x.name === name)) {
            console.error(`found plugin with same name ${name}`);
            return this;
        }

        this[`$${name}`] = plugin;
        this._plugins.push({ name, plugin });
        return this;
    }
}