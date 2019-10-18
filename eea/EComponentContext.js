export class EComponentContext {
    get app() { return this._app; }
    get component() { return this._component; }

    constructor(app, component) {
        this._app = app;
        this._component = component;
    }

    publish(name) {
        Array.prototype.shift.apply(arguments);
        this._app.events.emit(name, ...arguments);
    }

    put(name) {
        Array.prototype.shift.apply(arguments);
        this._app.effects.emit(name, ...arguments);
    }

    dispatch(name) {
        Array.prototype.shift.apply(arguments);
        this._app.actions.emit(name, ...arguments);
    }

    bind() {
        return {
            publish: this.publish.bind(this),
            put: this.put.bind(this),
            dispatch: this.dispatch.bind(this)
        }
    }
}