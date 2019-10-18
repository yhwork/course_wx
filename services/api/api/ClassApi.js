import Resource from '../Resource'
import regeneratorRuntime from '../../../lib/runtime'


class ClassApi {
    constructor(options) {
        const config = [
          { name: 'getList', url: '/class/getTeacherClassList', method: 'post' },
          { name: 'validClass', url: '/class/validateClassNameReeat', method: 'post' },
          { name: 'create', url: '/class/addClassInfo', method: 'post' },
          { name: 'getOne', url: '/class/getClassInfoById', method: 'post' }, 
          { name: 'getClassDetails', url: '/class/getClassDetails', method: 'post' },
          { name: 'getClassDetailsByClassId', url: '/class/getClassDetailsByClassId', method: 'post' },
          { name: 'getClassList', url: '/class/getClassList', method: 'post' },
          { name: 'deleteClassInfo', url: '/class/deleteClassInfo', method: 'post' },
          { name: 'searchClass', url: '/class/searchClass', method: 'post' },
          { name: 'joinClass', url: '/class/joinClass', method: 'post' },
          { name: 'addClassWork', url: '/class/addClassWork', method: 'post' },
          { name: 'getClassWorkList', url: '/class/getClassWorkList', method: 'post' },
          { name: 'getClassMemberList', url: '/class/getClassMemberList', method: 'post' },
          { name: 'updateClassMemberStatus', url: '/class/updateClassMemberStatus', method: 'post' },
          { name: 'getClassWorkDetails', url: '/class/getClassWorkDetails', method: 'post' },
          { name: 'addChildClassWork', url: '/class/addChildClassWork', method: 'post' },
          { name: 'addChildWorkComment', url: '/class/addChildWorkComment', method: 'post' },
          { name: 'addChildWorkCommentReply', url: '/class/addChildWorkCommentReply', method: 'post' },
          { name: 'deleteClassMaterialWork', url: '/class/deleteClassMaterialWork', method: 'post' },
          { name: 'deleteChildClassWork', url: '/class/deleteChildClassWork', method: 'post' }, 
          { name: 'deleteChildWorkCommentOrReply', url: '/class/deleteChildWorkCommentOrReply', method: 'post' }, 
          { name: 'addChildWorkLike', url: '/class/addChildWorkLike', method: 'post' },
          { name: 'addClassDynamic', url: '/class/addClassDynamic', method: 'post' }, 
          { name: 'getClassDynamicList', url: '/class/getClassDynamicList', method: 'post' }, 
          { name: 'addClassDynamicLike', url: '/class/addClassDynamicLike', method: 'post' }, 
          { name: 'deleteDynamicCommentOrReply', url: '/class/deleteDynamicCommentOrReply', method: 'post' }, 
          { name: 'deleteClassDynamic', url: '/class/deleteClassDynamic', method: 'post' }, 
          { name: 'getClassDynamicDetails', url: '/class/getClassDynamicDetails', method: 'post' }, 
          { name: 'addClassDynamicComment', url: '/class/addClassDynamicComment', method: 'post' }, 
          { name: 'addClassDynamicCommentLike', url: '/class/addClassDynamicCommentLike', method: 'post' }, 
          { name: 'addClassDynamicCommentReply', url: '/class/addClassDynamicCommentReply', method: 'post' }, 
          { name: 'addClassNotify', url: '/class/addClassNotify', method: 'post' }, 
          { name: 'getNotifyList', url: '/class/getNotifyList', method: 'post' }, 
          { name: 'deleteClassNotify', url: '/class/deleteClassNotify', method: 'post' }, 
          { name: 'getNotifyDetails', url: '/class/getNotifyDetails', method: 'post' }, 
          { name: 'addClassNotifyReply', url: '/class/addClassNotifyReply', method: 'post' }, 
          { name: 'updateClassChildInfo', url: '/class/updateClassChildInfo', method: 'post' }, 
          { name: 'addClassNotifyLookLog', url: '/class/addClassNotifyLookLog', method: 'post' }, 
          { name: 'addClassWorkLookLog', url: '/class/addClassWorkLookLog', method: 'post' }, 
          { name: 'updateClassInfo', url: '/class/updateClassInfo', method: 'post' }, 
          { name: 'getClassUnreadMessageInfo', url: '/message/getClassUnreadMessageInfo', method: 'post' }, 
          { name: 'getClassUnreadMessageList', url: '/message/getClassUnreadMessageList', method: 'post' }, 
          { name: 'updateClassUnreadMessageInfo', url: '/message/updateClassUnreadMessageInfo', method: 'post' }, 
        ]
        this._resource = new Resource(options, config);
    }
  // 获取未读消息数量
  getClassUnreadMessageInfo(model) {
    return this._resource.getClassUnreadMessageInfo({ model: model });
  }
  // 获取未读消息列表
  getClassUnreadMessageList(model) {
    return this._resource.getClassUnreadMessageList({ model: model });
  }
  // 更新班级圈未读消息状态
  updateClassUnreadMessageInfo(model) {
    return this._resource.updateClassUnreadMessageInfo({ model: model });
  }
  // 删除相册评论
  deleteDynamicCommentOrReply(model) {
    return this._resource.deleteDynamicCommentOrReply({ model: model.inputMap });
  }
  // 添加班级相册点赞
  addClassDynamicLike(model) {
    return this._resource.addClassDynamicLike({ model: model });
  }
  // 获取班级相册详情
  getClassDynamicDetails(model) {
    return this._resource.getClassDynamicDetails({ model: model });
  }
  // 删除班级相册
  deleteClassDynamic(model) {
    return this._resource.deleteClassDynamic({ model: model.inputMap });
  }
  // 获取班级相册
  getClassDynamicList(model) {
    return this._resource.getClassDynamicList({ model: model });
  }
  // 添加班级相册
  addClassDynamic(model) {
    return this._resource.addClassDynamic({ model: model });
  }
  // 修改班级信息
  updateClassInfo(model) {
    return this._resource.updateClassInfo({ model: model.inputMap });
  }
  // 添加作业等浏览记录
  addClassWorkLookLog(model) {
    return this._resource.addClassWorkLookLog({ model: model });
  }
  // 添加通知浏览记录
  addClassNotifyLookLog(model) {
    return this._resource.addClassNotifyLookLog({ model: model });
  }
    // 家长修改小孩在班级的信息
    updateClassChildInfo(model) {
      return this._resource.updateClassChildInfo({ model: model });
    }
    // 家长添加班级通知回执
    addClassNotifyReply(model) {
      return this._resource.addClassNotifyReply({ model: model });
    }
    // 获取班级详情
    getNotifyDetails(model) {
      return this._resource.getNotifyDetails({ model: model });
    }
    // 删除班级通知
    deleteClassNotify(model) {
      return this._resource.deleteClassNotify({ model: model.inputMap });
    }
    // 获取班级通知
    getNotifyList(model) {
      return this._resource.getNotifyList({ model: model });
    }
    // 添加班级通知
    addClassNotify(model) {
      return this._resource.addClassNotify({ model: model });
    }
    // 添加班级相册点赞
    addClassDynamicCommentLike(model) {
      return this._resource.addClassDynamicCommentLike({ model: model });
    }
    // 添加班级相册评论
    addClassDynamicComment(model) {
      return this._resource.addClassDynamicComment({ model: model });
    }
    // 添加班级相册回复
    addClassDynamicCommentReply(model) {
      return this._resource.addClassDynamicCommentReply({ model: model });
    }
    // 添加班级作业点赞
    addChildWorkLike(model) {
      console.log(model)
      return this._resource.addChildWorkLike({ model: model });
    }    
    //删除作业下的评论
    deleteChildWorkCommentOrReply(model) {
      return this._resource.deleteChildWorkCommentOrReply({ model: model.inputMap });
    }
      //家长删除作业
    deleteChildClassWork(model) {
      return this._resource.deleteChildClassWork({ model: model.inputMap });
    }
    //老师删除作业、动态
    deleteClassMaterialWork(model) {
      return this._resource.deleteClassMaterialWork({ model: model.inputMap });
    }
    //评论
    addChildWorkComment(model) {
      return this._resource.addChildWorkComment({ model: model });
    }
    //回复
    addChildWorkCommentReply(model) {
      return this._resource.addChildWorkCommentReply({ model: model });
    }
    //加入班级
    joinClass(model) {
      return this._resource.joinClass({ model: model });
    }
    //家长发布作业
    addChildClassWork(model) {
      return this._resource.addChildClassWork({ model: model });
    }
    //查看班级作业详情
    getClassWorkDetails(model) {
      return this._resource.getClassWorkDetails({ model: model });
    }
    //同意拒绝加入班级
    updateClassMemberStatus(model) {
      return this._resource.updateClassMemberStatus({ model: model.inputMap });
    }
    //搜索班级
    searchClass(model) {
      return this._resource.searchClass({ model: model });
    }
    getClassDetailsByClassId(model) {
      return this._resource.getClassDetailsByClassId({ model: model });
    }
    //删除班级
    deleteClassInfo(model) {
      return this._resource.deleteClassInfo({ model: model });
    }
    //我的班级列表
    getList(model) {
      const data = {}
      return this._resource.getList({ model: data});
    }
    //添加班级作业
    addClassWork(model) {
      return this._resource.addClassWork({ model: model });
    }
    //获取班级作业列表
    getClassWorkList(model) {
      return this._resource.getClassWorkList({ model: model });
    }
    //获取班级成员列表
    getClassMemberList(model) {
      return this._resource.getClassMemberList({ model: model });
    }
    //老师、孩子的班级列表
    getClassList(model) {
      return this._resource.getClassList({ model: model });
    }

    //判断班级名称是否重复
    validClass(model) {
        const data = {}
        data.className = model.className
        return this._resource.validClass({ model: data});
    }

    // 获取班级详情 
    getClassDetails(model) {
      return this._resource.getClassDetails({
        model: model
      });
    }

    //创建班级
    create(model) {
        // const data = {}
        // data.className = model.className
        // if(model.courseType==1){//校内
        //     data.classType = '1'
        // }else{//校外
        //     data.classType = '2'
        //     data.outschoolName = model.workOrganizationName
        // }
        // data.teacherName = model.name
        // if(typeof model.logo != 'undefined'){
        //     data.teacherLogo = model.logo
        // }
        return this._resource.create({ model: model});
    }

    getOne(model){
        const data = {}
        data.classId = model.classId
        return this._resource.getOne({ model: data});
    }
}

export default ClassApi