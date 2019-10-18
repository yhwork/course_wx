import {
  CourseMapper,
  ScheduleMapper
} from '../mapper/index'
import Resource from '../Resource'
import moment from '../../../lib/moment.min.js'

class CourseApi {
  constructor(options) {
    const map = CourseMapper.mapModel;
    const config = [{
        name: 'getEndDate',
        url: 'course/countEndDateTime',
        method: 'post',
        map
      },
      {
        name: 'get',
        url: 'course/loadCourseListByCondition',
        method: 'post',
        map
      },
      {
        name: 'getCountNum',
        url: 'course/loadCourseCountNum',
        method: 'post',
        map
      },
      {
        name: 'loadCourseNum',
        url: '/course/loadCourseNum',
        method: 'post',
        map
      },
      {
        name: 'create',
        url: 'course/addCourse',
        method: 'post',
        map
      },
      {
        name: 'getone',
        url: 'course/loadCourseBaseInfoById',
        method: 'post',
        map
      },
      {
        name: 'deleteCourse',
        url: 'course/removeCourseById',
        method: 'post',
        map
      },
      {
        name: 'createLesson',
        url: 'course/increaseCourseTime',
        method: 'post',
        map
      },
      {
        name: 'getLesson',
        url: 'course/loadCourseTimeListByCourseId',
        method: 'post',
        map
      },
      {
        name: 'getLessonOne',
        url: 'course/loadCourseTimeDetailsById',
        method: 'post',
        map
      },
      {
        name: 'deleteLesson',
        url: 'course/removeCourseTime',
        method: 'post',
        map
      },
      {
        name: 'batchUpdateLesson',
        url: 'course/batchUpdateCourseTime',
        method: 'post',
        map
      },
      {
        name: 'updateLesson',
        url: 'course/updateCourseTime',
        method: 'post',
        map
      },
      {
        name: 'weekLesson',
        url: 'course/loadCourseTimeListByWeek',
        method: 'post',
        map
      },
      {
        name: 'dayLesson',
        url: 'course/loadCourseTimeListByDay',
        method: 'post',
        map
      },
      {
        name: 'getDayLesson',
        url: 'course/loadCourseTimeListByDay',
        method: 'post',
        map
      },
      {
        name: 'monthLessonNum',
        url: 'course/getMonthlyExCourse',
        method: 'post',
        map
      },
      {
        name: 'monthCheckWork',
        url: 'course/getCourseMonthlyAttendInfo',
        method: 'post',
        map
      },
      {
        name: 'imporCourse',
        url: 'course/importCourseByCourseId',
        method: 'post',
        map
      },
      {
        name: 'getShareInfo',
        url: 'course/loadCourseTimeShareInfo',
        method: 'post',
        map
      },
      {
        name: 'updateCourseInfo',
        url: 'course/updateCourseInfo',
        method: 'post',
        map
      },
      {
        name: 'addDefaultCourse',
        url: 'internalCourse/addDefaultCourse',
        method: 'post',
        map
      },
      {
        name: 'addInternalCourse',
        url: 'internalCourse/addInternalCourse',
        method: 'post',
        map
      },
      {
        name: 'deleteInternalCourse',
        url: 'internalCourse/deleteInternalCourse',
        method: 'post',
        map
      },
      {
        name: 'getInternalCourseDetails',
        url: 'internalCourse/getInternalCourseDetails',
        method: 'post',
        map
      },
      {
        name: 'getInternalCourseList',
        url: 'internalCourse/getInternalCourseList',
        method: 'post',
        map
      },
      {
        name: 'getTodayInternalCourseList',
        url: 'internalCourse/getTodayInternalCourseList',
        method: 'post',
        map
      },
      {
        name: 'saveChildClassInfo',
        url: 'internalCourse/saveChildClassInfo',
        method: 'post',
        map
      },
      {
        name: 'updateInternalCourseName',
        url: 'internalCourse/updateInternalCourseName',
        method: 'post',
        map
      },
      {
        name: 'getChildSchoolName',
        url: 'internalCourse/getChildSchoolName',
        method: 'post',
        map
      },
      {
        name: 'getCourseListByUserId',
        url: '/course/getCourseListByUserId',
        method: 'post',
        map
      },
      {
        name: 'getCourseTimeListByWeek',
        url: '/internalCourse/getCourseTimeListByWeek',
        method: 'post',
        map
      },
      {
        name: 'getAllInternalCourseName',
        url: '/internalCourse/getAllInternalCourseName',
        method: 'post',
        map
      },
      {
        name: 'getCourseCount',
        url: '/internalCourse/getCourseCount',
        method: 'post',
        map
      },
      {
        name: 'importInternalCourse',
        url: '/internalCourse/importInternalCourse',
        method: 'post',
        map
      },

      {
        name: 'updateInternalCourse',
        url: '/internalCourse/updateInternalCourse',
        method: 'post',
        map
      },
      {
        name: 'loadCourseTime',
        url: '/course/loadCourseTimeListByLately',
        method: 'post'
      },
      // 更多
      {
        name: 'loadCourseTimelist',
        url: '/course/loadAllCourseTimeList',
        method: 'post'
      },
      // 添加校内课程图片
      {
        name: 'addInternalCourseImg',
        url: '/internalCourse/addInternalCourseImg',
        method: 'post'
      },
      // 校外日历查询
      {
        name: 'loadOutSchoolCourseListByWeek',
        url: '/course/loadOutSchoolCourseListByWeek',
        method: 'post'
      },
      // 校内日历查询
      {
        name: 'loadInternalCourseListByWeek',
        url: '/course/loadInternalCourseListByWeek',
        method: 'post'
      },
      // 日程列表
      {
        name: 'loadCourseList',
        url: '/course/loadCourseTimeList',
        method: 'post'
      },
      // 修改课程图片
      {
        name: 'updateInternalCourseImg',
        url: '/internalCourse/updateInternalCourseImg',
        method: 'post'
      },
      // 修改课程图片
      {
        name: 'delInternalCourseImg',
        url: '/internalCourse/delInternalCourseImg',
        method: 'post'
      },
    ]
    this._resource = new Resource(options, config);
  }
  getCourseListByUserId(model) {
    return this._resource.getCourseListByUserId({
      model: model
    });
  }

  getEndDate(model) {
    const data = {};
    data.issueTime = model.beginDate;
    data.num = model.num;
    if (typeof model.repetitionIndex != 'undefined') {
      data.frequency = model.repetitionIndex;
    } else {
      data.frequency = model.frequency
    }
    if (data.frequency == 0) {
      data.frequency = 5;
    }
    data.userDefine = model.weekDays;
    return this._resource.getEndDate({
      model: data
    });
  }
  //课程管理列表
  get(model) {
    const data = {};
    data.childId = model.childId;
    if (typeof model.condition != 'undefined' && model.condition != 0) {
      data.condition = model.condition;
    }
    return this._resource.get({
      model: data
    });
  }
  //校内课程课程管理列表
  getAllInternalCourseName(model) {
    return this._resource.get({
      model: model
    });
  }
  //是否创建过校内课程表
  getCourseCount(model) {
    return this._resource.getCourseCount({
      model: model
    });
  }
  //课程数量
  getCountNum(model) {
    const data = {};
    data.childId = model.childId
    return this._resource.getCountNum({
      model: data
    });
  }

  queryWithSchedule(childId) {
    return this._resource.queryWithSchedule({
      params: {
        ownerId: childId
      }
    });
  }

  //创建课程
  create(model) {
    const data = {};
    data.childId = model.childId;
    data.name = model.name;
    data.orgName = model.orgName;
    data.issueTime = model.beginDate;
    data.num = model.num;
    data.finishTime = model.endDate;
    data.startTime = model.startClassTime;
    data.duration = model.duration;
    data.endTime = model.endClassTime;
    data.frequency = model.repetitionIndex;
    data.userDefine = model.weekDays;
    data.notify = model.remindValue;
    data.classAddress = model.classAddress;
    data.longitude = model.longitude;
    data.latitude = model.latitude;
    data.classRoom = model.classRoom;
    data.teacher = model.teacher;
    data.contactTel = model.contactTel;

    return this._resource.create({
      model: data
    });
  }
  //课程详细
  getone(model) {
    const data = {};
    data.id = model.courseId;
    return this._resource.getone({
      model: data
    });
  }
  // 导入校内课程
  importInternalCourse(model) {
    return this._resource.importInternalCourse({
      model: model
    });
  }
  //课程对应的课节列表
  getLesson(model) {
    const data = {};
    data.id = model.courseId;
    if (typeof model.condition != 'undefined' && model.condition != 0) {
      data.condition = model.condition;
    }
    return this._resource.getLesson({
      model: data
    });
  }
  //批量更新课节信息
  batchUpdateLesson(model) {
    const data = {};
    data.childId = model.childId;
    data.id = model.id;
    data.ids = model.ids;
    data.name = model.name;
    data.orgName = model.orgName;
    data.issueTime = model.beginDate;
    data.num = model.num;
    data.finishTime = model.endDate;
    data.startTime = model.startClassTime;
    data.duration = model.duration;
    data.endTime = model.endClassTime;
    data.frequency = model.repetitionIndex;
    data.userDefine = model.weekDays;
    data.notify = model.remindValue;
    data.classAddress = model.classAddress;
    data.classRoom = model.classRoom;
    data.teacher = model.teacher;
    data.contactTel = model.contactTel;
    return this._resource.batchUpdateLesson({
      model: data
    });
  }
  //课程信息修改
  updateCourseInfo(model) {
    const data = {};
    data.childId = model.childId;
    data.id = model.id;
    data.name = model.name;
    data.orgName = model.orgName;
    data.issueTime = model.beginDate;
    data.num = model.num;
    data.finishTime = model.endDate;
    data.startTime = model.startClassTime;
    data.duration = model.duration;
    data.endTime = model.endClassTime;
    data.frequency = model.repetitionIndex;
    data.userDefine = model.weekDays;
    data.notify = model.remindValue;
    data.classAddress = model.classAddress;
    data.classRoom = model.classRoom;
    data.teacher = model.teacher;
    data.contactTel = model.contactTel;
    return this._resource.updateCourseInfo({
      model: data
    });
  }
  //删除课节
  deleteLesson(model) {
    const data = {};
    data.childId = model.childId;
    data.courseId = model.id;
    data.ids = model.ids;
    return this._resource.deleteLesson({
      model: data
    });
  }
  //删除课程
  deleteCourse(model) {
    const data = {};
    data.id = model.courseId;
    data.childId = model.childId;
    return this._resource.deleteCourse({
      model: data
    });
  }
  //
  loadCourseNum(model) {
    return this._resource.loadCourseNum({
      model: model
    });
  }
  //课节详情
  getLessonOne(model) {
    const data = {};
    data.id = model.lessonId;
    return this._resource.getLessonOne({
      model: data
    });
  }
  //课节修改
  updateLesson(model) {
    const data = {};
    data.id = model.lessonId;
    data.type = model.type;
    data.childId = model.childId;
    if (data.type != 1) {
      data.startTime = model.startTime
      data.endTime = model.endTime
    }
    return this._resource.updateLesson({
      model: data
    });
  }

  //增加课节
  createLesson(model) {
    const data = {};
    data.id = model.id; //课程id
    data.childId = model.childId;
    data.name = model.name;
    data.orgName = model.orgName;
    data.issueTime = model.beginDate;
    data.num = model.num;
    data.finishTime = model.endDate;
    data.startTime = model.startClassTime;
    data.duration = model.duration;
    data.endTime = model.endClassTime;
    data.frequency = model.repetitionIndex;
    data.userDefine = model.weekDays;
    data.notify = model.remindValue;
    data.classAddress = model.classAddress;
    data.longitude = model.longitude;
    data.latitude = model.latitude;
    data.classRoom = model.classRoom;
    data.teacher = model.teacher;
    data.contactTel = model.contactTel;
    return this._resource.createLesson({
      model: data
    });
  }
  //显示某一周的校外课节
  weekLesson(model) {
    const data = {};
    data.childId = model.childId;
    data.diff = model.diff;
    return this._resource.weekLesson({
      model: data
    });
  }
  //显示某一周的校内课节
  getCourseTimeListByWeek(model) {
    const data = {};
    data.childId = model.childId;
    data.diff = model.diff;
    return this._resource.getCourseTimeListByWeek({
      model: data
    });
  }
  //显示某一天的课节
  dayLesson(model) {
    const data = {};
    data.childId = model.childId;
    data.queryDate = model.lessonDate;
    return this._resource.dayLesson({
      model: data
    });
  }
  //显示某一天的课节
  getDayLesson(model) {
    return this._resource.getDayLesson({
      model: model
    });
  }

  //显示某一个月每天的课节数量
  monthLessonNum(model) {
    const data = {};
    data.childId = model.childId;
    data.yearMonth = moment(model.currentMonth).format('YYYY-MM');
    return this._resource.monthLessonNum({
      model: data
    });
  }
  //显示某一个月课节状态及对应数量
  monthCheckWork(model) {
    const data = {};
    data.courseId = model.courseId;
    data.yearMonth = moment(model.currentMonth).format('YYYY-MM');
    data.courseStatus = model.courseStatus;
    return this._resource.monthCheckWork({
      model: data
    });
  }

  //导入课程
  imporCourse(model) {
    const data = {};
    data.code = model.code;
    data.childId = model.childId;
    return this._resource.imporCourse({
      model: data
    });
  }

  //导入课程
  getShareInfo(model) {
    const data = {};
    data.code = model.code;
    return this._resource.getShareInfo({
      model: data
    });
  }


  addDefaultCourse(model) {
    return this._resource.addDefaultCourse({
      model: model
    });
  }

  addInternalCourse(model) {
    return this._resource.addInternalCourse({
      model: model
    });
  }
  // 删除校内课程表
  deleteInternalCourse(model) {
    return this._resource.deleteInternalCourse({
      model: model
    });
  }

  getAllInternalCourseName(model) {
    return this._resource.getAllInternalCourseName({
      model: model
    });
  }

  getInternalCourseDetails(model) {
    return this._resource.getInternalCourseDetails({
      model: model
    });
  }

  getInternalCourseList(model) {
    return this._resource.getInternalCourseList({
      model: model
    });
  }

  getTodayInternalCourseList(model) {
    return this._resource.getTodayInternalCourseList({
      model: model
    });
  }

  saveChildClassInfo(model) {
    // let data = {};
    //console.log(model);return;
    // data.internalClassId = model.InterClassDetailsId;
    // data.startDate = model.beginDate;
    // data.endDate = model.endDate;
    // data.amStTime = model.firstClassTime;
    // data.pmStTime = model.fiveClassTime;
    // data.duration = model.duration;

    return this._resource.saveChildClassInfo({
      model: model
    });
  }
  //更新校内课程信息
  updateInternalCourse(model) {
    return this._resource.updateInternalCourse({
      model: model
    });
  }

  loadCourseTimelist(model) {
    return this._resource.loadCourseTimelist({
      model: model
    });
  }
  // 添加照片日程
  addInternalCourseImg(model) {
    return this._resource.addInternalCourseImg({
      model: model
    });
  }

  // 查询校外日历
  loadOutSchoolCourseListByWeek(model) {
    return this._resource.loadOutSchoolCourseListByWeek({
      model: model
    })
  }

  // 查询校内日历
  loadInternalCourseListByWeek(model) {
    return this._resource.loadInternalCourseListByWeek({
      model: model
    })
  }
  // 校内外列表
  loadCourseList(model) {
    return this._resource.loadCourseList({
      model: model
    })
  }

  // 获取最近课程
  loadCourseTime(model) {
    return this._resource.loadCourseTime({
      model: model
    });
  }
  // 修改课程图片
  updateInternalCourseImg(model) {

    return this._resource.updateInternalCourseImg({
      model: model
    });
  }
  // 删除课程图片
  delInternalCourseImg(model) {
    return this._resource.delInternalCourseImg({
      model: model
    });
  }
  getChildSchoolName(model) {
    const data = {};
    data.childId = model.childId;
    return this._resource.getChildSchoolName({
      model: data
    });
  }




}

export default CourseApi