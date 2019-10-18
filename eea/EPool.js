export class EPool {
    constructor() {
        this._items = [];
    }

    on(name, func, instance) {
        this._items.push({ name, func, instance });
    }

    emit(name) {
        Array.prototype.shift.apply(arguments);
        const results = [];
        this._items.filter(item => item.name === name).forEach(item => {
            if (typeof item.instance === 'undefined') {
                results.push(item.func(...arguments));
            } else {
                results.push(item.func.apply(item.instance, arguments));
            }
        });
        return results;
    }
}