const __flatten = function (obj) {
    return Object.keys(obj).map(key => ({ key, value: obj[key] }));
}

import { EPool } from './EPool'
import { EPageContext } from './EPageContext'
import { PAGE_LIFE } from './const/PAGE_LIFE'

const __page_life = __flatten(PAGE_LIFE);

export class EPage {
    get id() { return this._id; }
    get events() { return this._events; }
    get data() { return {}; }
    get context() { return this._context; }
    get wxPage() { return this._wxPage; }

    get route() { return this.wxPage.route; }

    constructor() {
        this._id = this.constructor.name;
        this._events = new EPool();
    }

    _init(app) {
        const page = this;
        const context = this._context = new EPageContext(app, this);
        const boundContext = context.bind();
        const wxPageConfig = {
            data: this.data
        };

        //! initlize plugins
        app.plugins.forEach(item => {
            this[`$${item.name}`] = item.plugin;
        });

        //! bind page events.
        __flatten(page.mapPageEvent(boundContext))
            .filter(x => __page_life.find(l => l.value === x.key))
            .forEach(item => {
                page.events.on(item.key, item.value, page);
                wxPageConfig[item.key] = function () {
                    const results = page.events.emit(item.key, ...arguments);
                    return results.find(x => x);
                };
            });

        //! bind ui events.
        __flatten(page.mapUIEvent(boundContext))
            .forEach(item => {
                page.events.on(item.key, item.value, page);
                wxPageConfig[item.key] = function () {
                    page.events.emit(item.key, ...arguments)
                };
            });

        //! bind global events.
        __flatten(page.mapEvent(boundContext))
            .forEach(item => {
                app.events.on(item.key, item.value, page);
            });

        //! bind global effects.
        __flatten(page.mapEffect(boundContext))
            .forEach(item => {
                app.effects.on(item.key, item.value, page);
            });

        //! bind global actions.
        __flatten(page.mapAction(boundContext))
            .forEach(item => {
                app.actions.on(item.key, item.value, page);
            });

        wxPageConfig.onLoad = function () {
            Object.defineProperty(page, 'data', {
                get: () => { return this.data; },
                configurable: true
            });
            page._wxPage = this;
            page.events.emit(PAGE_LIFE.ON_LOAD, ...arguments);
        }

        Page(wxPageConfig);
    }

    mapEvent() { return {}; }
    mapPageEvent() { return {}; }
    mapUIEvent() { return {}; }

    mapEffect() { return {}; }
    mapAction() { return {}; }

    setData(format, data) {
        this._wxPage.setData(format, data);
        return this;
    }
}