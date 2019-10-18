import Resource from '../Resource'

class UserApi {
  constructor(options) {
    const config = [{
        name: 'checkFollow',
        url: '/user/isFollowMp',
        method: 'post'
      },
      {
        name: 'updateUserInfoByWX',
        url: '/login/updateUserInfoByWX',
        method: 'post'
      },
      {
        name: 'createTeacher',
        url: '/user/completeTeacherUserInfo',
        method: 'post'
      },
      {
        name: 'changeRole',
        url: '/user/changeRole',
        method: 'post'
      },
      {
        name: 'gerUserInfo',
        url: '/user/getCurrentUserInfo',
        method: 'post'
      },
      {
        name: 'shareInfoRecord',
        url: '/share/shareInfoRecord',
        method: 'post'
      },
      {
        name: 'getWxCode',
        url: '/share/share4Code',
        method: 'post'
      },
      {
        name: 'getShareInfo',
        url: '/share/getShareInfoByCode',
        method: 'post'
      },
      {
        name: 'generateCode',
        url: '/share/generateCode',
        method: 'post'
      },
      {
        name: 'updateUserPhoneByWX',
        url: '/login/updateUserPhoneByWX',
        method: 'post'
      },
      {
        name: 'getVisitUser',
        url: '/user/getVisitUser',
        method: 'post'
      },
      {
        name: 'getVisitUserNum',
        url: '/user/getVisitUserNum',
        method: 'post'
      },
      // /share/addUserShareInfo
      {
        name: 'addUserShareInfo',
        url: '/share/addUserShareInfo',
        method: 'post'
      },
      {
        name: 'getUserShareInfo',
        url: '/share/getUserShareInfo',
        method: 'post'
      },
      {
        name: 'addVisitUser',
        url: '/user/addVisitUser',
        method: 'post'
      },
      {
        name: 'verifyTeacherInfo',
        url: '/user/verifyTeacherInfo',
        method: 'post'
      }, 
      {
        name: 'verifyUserChildInfo',
        url: '/user/verifyUserChildInfo',
        method: 'post'
      },
      {
        name: 'addUserForm',
        url: '/user/addUserForm',
        method: 'post'
      },
    ]
    this._resource = new Resource(options, config);
  }
  // 添加用户FormId
  addUserForm(model) {
    return this._resource.addUserForm({
      model: model
    });
  }
  // 验证家长是否完善信息
  verifyUserChildInfo(model) {
    return this._resource.verifyUserChildInfo({
      model: model
    });
  }
  // 验证老师是否完善信息
  verifyTeacherInfo(model) {
    return this._resource.verifyTeacherInfo({
      model: model
    });
  }
  //添加用户分享信息
  addUserShareInfo(model) {
    return this._resource.addUserShareInfo({
      model: model
    });
  }
  //添加来访者
  addVisitUser(model) {
    return this._resource.addVisitUser({
      model: model
    });
  }
  //查询用户分享信息
  getUserShareInfo() {
    return this._resource.getUserShareInfo({
      model: {}
    });
  }
  //更新用户信息
  checkFollow() {
    return this._resource.checkFollow({
      model: {}
    });
  }
  //更新用户信息
  updateUserInfoByWX(model) {
    //const data = { data: encryptedData, iv };
    return this._resource.updateUserInfoByWX({
      model: model
    });
  }

  //看过我的人数
  getVisitUserNum() {
    return this._resource.getVisitUserNum({
      model: {}
    });
  }

  //创建老师
  createTeacher(model) { //console.log(model);return false;
    const data = {};
    data.workOrganizationName = model.schoolname;
    if (model.type == 1 && typeof model.schoolid != 'undefined') {
      data.schoolId = model.schoolid;
    }
    data.name = model.name;
    data.teachSubjects = model.subjectid;
    data.teacherProp = model.type;
    if (typeof model.className != 'undefined') {
      data.className = model.className
    }
    return this._resource.createTeacher({
      model: data
    });
  }

  //切换角色
  changeRole(model) {
    const data = {};
    data.role = model.role;
    if(model.type){
      data.type = model.type
    }  
    return this._resource.changeRole({
      model: data
    });
  }

  //获取当前用户信息
  gerUserInfo(model) {
    const data = {};
    return this._resource.gerUserInfo({
      model: data
    });
  }

  //分享信息记录公共接口,将分享数据存入数据库，返回一个分享码
  shareInfoRecord(model) {
    return this._resource.shareInfoRecord({
      model: model
    });
  }
  getVisitUser(model) {
    return this._resource.getVisitUser({
      model: model
    });
  }
  //获取当前用户信息
  getWxCode(model) {
    const data = {};
    data.codeType = 'WX_CODE_ACODE_B';
    data.scene = `?action=share&code=${model.shortCode}`;
    data.page = 'pages/course/course';
    data.width = '430';
    data.autoColor = true;
    data.lineColor = {
      "r": "0",
      "g": "0",
      "b": "0"
    };
    data.is_hyaline = false;
    return this._resource.getWxCode({
      model: data
    });
  }
  //获取分享信息
  getShareInfo(model) {
    const data = {};
    data.code = model.code
    return this._resource.getShareInfo({
      model: data
    });
  }

  //生成分享code
  generateCode(model) {
    const data = {};
    return this._resource.generateCode({
      model: data
    });
  }

  updateUserPhoneByWX(model) {
    const data = {};
    data.encryptedData = model.encryptedData;
    data.iv = model.iv;
    return this._resource.updateUserPhoneByWX({
      model: data
    });
  }



}

export default UserApi