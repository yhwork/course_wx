Component({
    relations: {
        './tabItem': {
            type: 'child',
            linked: function (target) {
            }
        }
    },
    properties: {
        activeIndex: {
            type: Number,
            value: 0
        }
    },
    data: {
        children: [],
        sliderOffset: 0
    },
    methods: {
        addChild: function (child) {
            const { children, activeIndex } = this.data;
            children.push(child);
            this.setData({ children });

            const index = children.length - 1;
            if (index === activeIndex) {
                this.setActive(index, true);
            }
            this.updateSlider();
            return index;
        },
        changeActive: function (e) {
            const index = parseInt(e.currentTarget.id);
            this.setActive(index, true);
            this.updateSlider();
            this.triggerEvent('change', { index });
        },
        setActive(index, actived) {
            this.data.children.forEach((child, i) => {
                child.active(i === index);
            });
            this.setData({ activeIndex: index });
        },
        updateSlider() {
            const { activeIndex } = this.data;
            const screenWidth = wx.getSystemInfoSync().windowWidth;
            const unit = parseInt(screenWidth / this.data.children.length);
            this.setData({ sliderOffset: activeIndex * unit });
        },
        setChildTitle(index, title) {
            const { children } = this.data;
            children[index].title = title;
            this.setData({ children });
        }
    }
})
