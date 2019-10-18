const __defaults = {
    course_key: 'COURSE_KEY',
    schedule_key: 'SCHEDULE_KEY',
    clear_key: 'CLEAR_KEY'
};

class Course {
    constructor(options) {
        this._options = Object.assign({}, __defaults, options);
    }

    setCourse(course) {
        wx.setStorageSync(this._options.course_key, course);
    }

    setSchedule(schedule) {
        wx.setStorageSync(this._options.schedule_key, schedule);
    }

    setAll({ course, schedule }) {
        this.setCourse(course);
        this.setSchedule(schedule);
    }

    getCourse() {
        return wx.getStorageSync(this._options.course_key);
    }

    getSchedule() {
        return wx.getStorageSync(this._options.schedule_key);
    }

    getAll() {
        return {
            course: this.getCourse(),
            schedule: this.getSchedule()
        };
    }

    removeCourse() {
        return wx.removeStorageSync(this._options.course_key);
    }

    removeSchedule() {
        return wx.removeStorageSync(this._options.schedule_key);
    }

    removeAll() {
        this.removeCourse();
        this.removeSchedule();
    }

    pushClear() {
        wx.setStorageSync(this._options.clear_key, true);
    }

    popClear() {
        const clear = wx.getStorageSync(this._options.clear_key);
        if (typeof clear === 'boolean' && clear === true) {
            wx.removeStorageSync(this._options.clear_key);
            return true;
        }
        return false;
    }
}

export default {
    install(app, options) {
        app.plugin('course', new Course(options));
    }
} 