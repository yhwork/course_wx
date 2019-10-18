const __flatten = function (obj) {
    return Object.keys(obj).map(key => ({ key, value: obj[key] }));
}

import { EPool } from './EPool'
import { EComponentContext } from './EComponentContext'
import { COMP_LIFE } from './const/COMP_LIFE'

const __comp_life = __flatten(COMP_LIFE);

export class EComponent {
    get id() { return this._id; }
    get events() { return this._events; }
    get data() { return {}; }
    get properties() { return {}; }
    get relations() { return {}; }
    get methods() { return {}; }
    get context() { return this._context; }
    get wxComponent() { return this._wxComponent; }

    constructor() {
        this._id = this.constructor.name;
        this._events = new EPool();
    }

    _init(app) {
        const component = this;
        const context = this._context = new EComponentContext(app, this);
        const boundContext = context.bind();
        const wxComponentConfig = {
            data: this.data,
            properties: this.properties,
            relations: this.relations,
            methods: this.methods,
        };

        //! initlize plugins
        app.plugins.forEach(item => {
            this[`$${item.name}`] = item.plugin;
        });

        //! bind component events.
        __flatten(component.mapComponentEvent(boundContext))
            .filter(x => __comp_life.find(l => l.value === x.key))
            .forEach(item => {
                component.events.on(item.key, item.value, component);
                wxComponentConfig[item.key] = function () {
                    const results = component.events.emit(item.key, ...arguments);
                    return results.find(x => x);
                };
            });

        //! bind ui events.
        __flatten(component.mapUIEvent(boundContext))
            .forEach(item => {
                component.events.on(item.key, item.value, component);
                wxComponentConfig.methods[item.key] = function () {
                    component.events.emit(item.key, ...arguments)
                };
            });

        //! bind global events.
        __flatten(component.mapEvent(boundContext))
            .forEach(item => {
                app.events.on(item.key, item.value, component);
            });

        //! bind global effects.
        __flatten(component.mapEffect(boundContext))
            .forEach(item => {
                app.effects.on(item.key, item.value, component);
            });

        //! bind global actions.
        __flatten(component.mapAction(boundContext))
            .forEach(item => {
                app.actions.on(item.key, item.value, component);
            });

        wxComponentConfig.created = function () {
            Object.defineProperty(component, 'data', {
                get: () => { return this.data; },
                configurable: true
            });
            component._wxComponent = this;
            component.events.emit(COMP_LIFE.ON_CREATED, ...arguments);
        }

        Component(wxComponentConfig);
    }

    mapEvent() { return {}; }
    mapPageEvent() { return {}; }
    mapUIEvent() { return {}; }

    mapEffect() { return {}; }
    mapAction() { return {}; }

    setData(format, data) {
        this._wxComponent.setData(format, data);
        return this;
    }

    triggerEvent(name, detail, options) {
        this._wxComponent.triggerEvent(name, detail, options);
        return this;
    }
}