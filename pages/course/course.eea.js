export const events = {
  ui: {
    TIMETABLE_DATE_CHANGED: null,
    LESSON_DATE_CHANGED: null,
    COURSE_MANAGE: null,
    EXPORT_PIC: null,
    SHOW_CALENDAR: null,
    CALENDAR_DAY_CHANGED: null,
    CALENDAR_MONTH_CHANGED: null,
    CHANGE_LOGO: null,
    CHOOSE_CHILD: null,
    ADD_COURSE: null,
    CANCEL_FOLLOW: null,
    CHOOSE_TYPE:null,
    CHOOSUBMITSETYPE:null,
    ESTOP:null,
    OPEN_LOCATION:null,
    gotoExam:null, //调查问卷
    chargeTab:null,
    goAdd:null,
    backhome:null,
    courdetails:null
  }
}

export const effects = {
  GET_CHILD: null,
  GET_WEEK_LESSON: null,
  GET_MONTH_LESSON_NUM: null,
  GET_MONTH_LESSON: null,
  GET_DAY_LESSON: null,
  LOAD_CHILDALL: null,
  GET_USER_INFO: null,
  CHECK_FOLLOW: null,
  SET_USERINFO: null,
  GET_inlet_LESSON:null,
  loadCourseTimelist:null,
  loadOutSchoolCourseListByWeek:null,    // 查询校外日历
  loadInternalCourseListByWeek:null,     // 查询校内日历
  loadCourseList:null               // 查询校内外日程
}

export const actions = {
  HANDLE_ACTION: null,
}