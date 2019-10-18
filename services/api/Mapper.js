class Mapper {
    constructor(model) {
        this._items = Object.keys(model || {}).map(key => ({ key, value: model[key] }));
    }

    pop(key) {
        const index = this._items.findIndex(item => item.key === key);
        if (index <= -1) return null;
        const value = this._items[index].value;
        this._items.splice(index, 1);
        return value;
    }

    peek(key) {
        const found = this._items.find(item => item.key === key);
        if (found) return found.value;
        return null;
    }

    push(key, value) {
        if (this._items.find(item => item.key === key))
            throw new Error(`found with same key: ${key}`);

        this._items.push({ key, value });
        return this;
    }

    set(key, value) {
        const found = this._items.find(item => item.key === key);
        if (!found)
            throw new Error(`cannot find by key: ${key}`);

        found.value = value;
        return this;
    }

    replace(key, func) {
        const found = this._items.find(item => item.key === key);
        if (!found) return this;

        found.value = func(found.value, key);
        return this;
    }

    build() {
        let model = {};
        this._items.forEach(item => model[item.key] = item.value);
        return model;
    }
}

export default Mapper