const events = {
  ui: {
    TAB_CLICK: null,
    TAB_CLICK_SUB: null,
    CHANGE_LOGO: null,
    CHOOSE_CHILD: null,
    OPE_DETAIL: null,
    OPE_COPY: null,
    OPE_EDIT: null,
    OPE_DEL: null,
    ADD_COURSE: null,
    VIEW_CHECK_WORK: null,
    SHOW_SHARE: null,
    HIDE_SHARE: null,
    OPEN_LOCATION: null,
    GET_WX_CODE: null,
    nopower: null,
    uploadclassPhoto:null,
    PREVIEW:null,
    previmg:null,  // 图片预览
    updataimg:null,
    deleteimg:null,
    backchange:null,
    GETSHOW_SHAR:null
  }
}

const effects = {
  GET_USER_INFO: null,
  GET_CHILD: null,
  LOAD_CHILDALL: null,
  LOAD_COURSE: null,
  LOAD_COURSE_NUM: null,
  DEL_COURSE: null,
  GET_WX_CODE: null,
  DEL_INTERNALCOURSE:null,
  delInternalCourseImg:null,    // 删除
  updateInternalCourseImg:null,  // 修改
  GETSHARE_INFO:null
}

const actions = {}

export {
  events,
  effects,
  actions
}