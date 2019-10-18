export class EPageContext {
    get app() { return this._app; }
    get page() { return this._page; }

    constructor(app, page) {
        this._app = app;
        this._page = page;
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