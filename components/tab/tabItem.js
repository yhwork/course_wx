Component({
    relations: {
        './tab': {
            type: 'parent',
            linked: function (parent) {
                const { title } = this.data;
                const index = parent.addChild({ title, active: this.active.bind(this) });
                this.setData({ index, parent });
            }
        }
    },
    properties: {
        title: {
            type: String,
            observer(title) {
                const { index, parent } = this.data;
                if (parent) {
                    parent.setChildTitle(index, title);
                }
            }
        }
    },
    data: {
        index: -1,
        parent: null,
        actived: false
    },
    methods: {
        active(actived) {
            this.setData({ actived });
        }
    }
})
