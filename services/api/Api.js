import regeneratorRuntime from '../../lib/runtime'
import Extparam from './Extparam'
import Auth from './Auth'
import Path from './Path'
import {
  ChildApi,
  CourseApi,
  ScheduleApi,
  LessonApi,
  UploadApi,
  AreaApi,
  UserApi,
  CircleApi,
  MessageApi,
  MyPageApi,
  CategoryApi,
  ClassApi
} from './api/index'

class Api {
  get extparam() {
    return this._extparam;
  }
  get path() {
    return this._path;
  }
  get auth() {
    return this._auth;
  }

  get child() {
    return this._child;
  }
  get course() {
    return this._course;
  }
  get schedule() {
    return this._schedule;
  }
  get lesson() {
    return this._lesson;
  }
  get upload() {
    return this._upload;
  }
  get area() {
    return this._area;
  }
  get user() {
    return this._user;
  }
  get circle() {
    return this._circle;
  }
  get message() {
    return this._message;
  }

  get mypage() {
    return this._mypage;
  }
  get category() {
    return this._category;
  }
  get class() {
    return this._class;
  }

  constructor(options, options1) {
    this._extparam = new Extparam(options1);
    this._path = new Path(options);
    this._auth = new Auth(this._path, this._extparam);

    const resOptions = {
      api: this,
      auth: this._auth,
      path: this._path,
      extparam: this._extparam
    };
    this._child = new ChildApi(resOptions);
    this._course = new CourseApi(resOptions);
    this._schedule = new ScheduleApi(resOptions);
    this._lesson = new LessonApi(resOptions);
    this._upload = new UploadApi(resOptions);
    this._area = new AreaApi(resOptions);
    this._user = new UserApi(resOptions);
    this._circle = new CircleApi(resOptions);
    this._message = new MessageApi(resOptions);
    this._mypage = new MyPageApi(resOptions);
    this._category = new CategoryApi(resOptions);
    this._class = new ClassApi(resOptions);
  }

  async test() {
    // await this.testUser();
    // await this.testArea();
    // await this.testChild();
    // await this.testCalendar();
  }

  async testUser() {
    console.log('get user info: ', await this.user.info());

    const city = 'city ' + +new Date().getTime();
    console.log('update user city: ', await this.user.updateCity(city));

    console.log('get user info: ', await this.user.info());
  }

  async testArea() {
    const models = await this.area.query();
    console.log('query cities: ', models);

    for (var i = 0; i < 10; ++i) {
      const model = models[i];
      console.log('get city: ', await this.area.get(model.cityName));
    }

    console.log('query popular cities: ', await this.area.popular());

    console.log('area regeocoding: ', await this.area.regeocoding());
  }

  async testChild() {
    console.group('test child api:');

    console.log('create: ', await this.child.create({
      "birthday": '2017-10-11',
      "gender": 1,
      "name": 'name ' + new Date().getTime(),
      "avatarUrl": 'avatar url'
    }));

    const models = await this.child.query();
    console.log('query: ', models);

    for (let i = 0; i < models.length; ++i) {
      const model = models[i];
      console.log('get: ', await this.child.get(model.id));
    }

    for (let i = 0; i < models.length; ++i) {
      let model = models[i];
      model.name = 'changed ' + model.name;
      console.log('update: ', await this.child.update(model));
    }

    for (let i = 0; i < models.length; ++i) {
      const model = models[i];
      console.log('delete: ', await this.child.delete(model.id));
    }

    console.groupEnd();
  }

  async testCalendar() {
    console.group('test calendar:');
    const child = await this.child.create({
      "birthday": '2017-10-11',
      "gender": 1,
      "name": 'course child ' + new Date().getTime(),
      // "avatarUrl": 'avatar url'
    });
    console.log('create child: ', child);

    await this.testCourse(child);

    console.log('delete child: ', await this.child.delete(child.id));
    console.groupEnd();
  }

  async testCourse(child) {
    console.log('create course: ', await this.course.create(child.id, {
      name: 'course name',
      external: true,
      institution: 'institution',
      building: 'building',
      address: {
        address: 'address',
        latitude: 100,
        longitude: 110,
      },
      contact: {
        name: 'contact name',
        mobile: 'mobile'
      }
    }));

    const models = await this.course.query(child.id);
    console.log('query course: ', models);

    for (let i = 0; i < models.length; ++i) {
      const model = models[i];
      console.log('get course: ', await this.course.get(child.id, model.id));
    }

    for (let i = 0; i < models.length; ++i) {
      let model = models[i];
      model.name = 'changed ' + model.name;
      console.log('update course: ', await this.course.update(child.id, model));
    }

    for (let i = 0; i < models.length; ++i) {
      const model = models[i];
      await this.testSchedule(child, model);
    }

    console.log('query course with schedule', await this.course.queryWithSchedule(child.id));

    for (let i = 0; i < models.length; ++i) {
      const model = models[i];
      await this.testLesson(child, model);
    }

    for (let i = 0; i < models.length; ++i) {
      const model = models[i];
      console.log('delete course: ', await this.course.delete(child.id, model.id));
    }
  }

  async testSchedule(child, course) {
    console.log('create schedule: ', await this.schedule.create(child.id, course.id, {
      beginDate: '2018-01-27',
      endDate: '2018-02-10',
      beginTime: '09:00',
      endTime: '11:00',
      reminder: 15,
      reptition: 0, //! 0: 每天, 1: 每周, 2: 每两周, 3: 自定义
      weekDays: [], //! MO,TU,WE,TH,FR,SA,SU
    }));

    console.log('create schedule: ', await this.schedule.create(child.id, course.id, {
      beginDate: '2018-01-27',
      endDate: '2018-02-10',
      beginTime: '09:00',
      endTime: '11:00',
      reminder: 15,
      reptition: 1, //! 0: 每天, 1: 每周, 2: 每两周, 3: 自定义
      weekDays: [], //! MO,TU,WE,TH,FR,SA,SU
    }));

    console.log('create schedule: ', await this.schedule.create(child.id, course.id, {
      beginDate: '2018-01-27',
      endDate: '2018-02-10',
      beginTime: '09:00',
      endTime: '11:00',
      reminder: 15,
      reptition: 2, //! 0: 每天, 1: 每周, 2: 每两周, 3: 自定义
      weekDays: [], //! MO,TU,WE,TH,FR,SA,SU
    }));

    console.log('create schedule: ', await this.schedule.create(child.id, course.id, {
      beginDate: '2018-01-27',
      endDate: '2018-02-10',
      beginTime: '09:00',
      endTime: '11:00',
      reminder: 15,
      reptition: 3, //! 0: 每天, 1: 每周, 2: 每两周, 3: 自定义
      weekDays: ['MO, TH'], //! MO,TU,WE,TH,FR,SA,SU
    }));

    const models = await this.schedule.query(child.id, course.id);
    console.log('query schedule: ', models);
    for (let i = 0; i < models.length; ++i) {
      const model = models[i];
      console.log('get schedule: ', await this.schedule.getWithCourse(child.id, model.id));
    }
  }

  async testLesson(child, course) {
    console.log('query lesson by course: ', await this.lesson.queryByCourse(child.id, course.id));
    console.log('query lesson by date: ', await this.lesson.queryByDate(child.id, '2018-01-28', '2018-02-01'));

    const models = await this.lesson.query(child.id);
    console.log('query lesson: ', models);

    for (var i = 0; i < models.length; ++i) {
      const model = models[i];
      console.log('absent lesson: ', await this.lesson.absent(child.id, model.id, true));
      console.log('adjust lesson: ', await this.lesson.adjust(child.id, {
        id: model.id,
        date: '2018-01-01',
        beginTime: '12:00',
        endTime: '14:00',
      }));
      console.log('makeup lesson: ', await this.lesson.makeup(child.id, {
        id: model.id,
        date: '2018-01-01',
        beginTime: '12:00',
        endTime: '14:00',
      }));
      console.log('get lesson: ', await this.lesson.getWithCourse(child.id, model.id));
    }
  }
}

export default {
  install(app, options) {
    app.plugin('api', new Api(options));
  }
}