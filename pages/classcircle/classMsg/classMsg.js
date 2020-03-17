import regeneratorRuntime from '../../../lib/runtime'
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './classMsg.eea'
const audioPlay = require("../../../lib/audioPlay");
const base64 = require('../../../lib/base64')
class classmsgPage extends EPage {
  get data() {
    return {
      datas:{
        isdata: true,
        name: '你还没有发布',
        btn: '开始发布'
      },
      shareShow: false,
      userinfo: {},
      isagree: false,
      idx: 1,
      tabList: [{
          value: '班级通知',
          idx: 0,
          select: false
        }, {
          value: '班级作业',
          idx: 1,
          select: true
        },
        // {
        //   value: '学习资料',
        //   idx: 2,
        //   select: false
        // },
        {
          value: '班级相册',
          idx: 2,
          select: false
        },
        //  {
        //   value: '课     表',
        //   idx: 4, 
        //   select: false
        // }, 
        {
          value: '成     员',
          idx: 5,
          select: false
        },
      ],
      isChild: true,
      childId: '',
      allList: [],
      playvideo: true,
      joinmsg: true,
      childNumber: [],
      teacherNumber: [],
      classStatus: "",
      reviseinfo: true, // 控制  
      shareCavansOptions: {
        id: 'share_canvas',
        width: 0,
        height: 0
      },
      showtearch: true,
      showFollowModel: false,
      formId: '',
      peportType: [{
          id: '0',
          value: '班级通知',
          src: 'notify'
        },
        {
          id: '1',
          value: '班级作业',
          src: 'pen'
        },
        {
          id: '2',
          value: '班级相册',
          src: 'people'
        }
      ],
      isSubmit: true,
      count: 0,
      slider: '-118px',
      isfrom: '',
      rolemsg: '(老师)'

    };
  }
  // 页面的生命周期
  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值', option)
        if (option.idx) {
          this.setData({
            idx: option.idx
          })
          this.data.tabList.forEach(item => {
            if (item.idx == this.data.idx) {
              item.select = true
            } else {
              item.select = false
            }
          })
          this.setData({
            tabList: this.data.tabList
          })
          if (this.data.idx == 0){
            this.setData({
              slider: '28px'
            })
          } else if (this.data.idx ==1){
            this.setData({
              slider: '118px'
            })
          } else if (this.data.idx == 2) {
            this.setData({
              slider: '207px'
            })
          } else if (this.data.idx == 3) {
            this.setData({
              slider: '546rpx'
            })
          }
          console.log(this.data.tabList)
        }
        if (option.comefrom) {
          this.setData({
            comefrom: option.comefrom
          })
        }
        if (option.code) {
          this.setData({
            code: option.code
          })
        }
        if (option.isfrom) {
          this.setData({
            isfrom: option.isfrom
          })
        }
        this.setData({
          classId: parseInt(option.classId),
          img: this.$api.extparam.getPageImgUrl('boyb'),
          role: option.role,
          'shareclass': this.$api.extparam.getPageImgUrl('shareclass'),
          'createclass': this.$api.extparam.getPageImgUrl('createclass'),
        })

        if (option.role == 0 && !option.comefrom) {
          this.setData({
            childId: parseInt(option.childId),
          })
        }
        this.setData({
          width: wx.getSystemInfoSync().windowWidth,
          height: wx.getSystemInfoSync().windowHeight
        })
        put(effects.USERINFO)
        const {
          shareCavansOptions
        } = this.data;
        shareCavansOptions.width = wx.getSystemInfoSync().screenWidth;
        shareCavansOptions.height = shareCavansOptions.width * 5 / 4;
        this.setData({
          shareCavansOptions,
        });
        wx.removeStorageSync('inviteimg')
        put(effects.showFollowModel)
      },
      [PAGE_LIFE.ON_SHOW](option) {
        let that = this
        if (wx.getStorageSync('idx')) {
          this.setData({
            idx: wx.getStorageSync('idx')
          })
          wx.removeStorageSync('idx')
          this.data.tabList.forEach(item => {
            if (item.idx == this.data.idx) {
              item.select = true
            } else {
              item.select = false
            }
          })
          this.setData({
            tabList: this.data.tabList
          })
        }
        if (this.data.idx == 0) {
          put(effects.GET_NOTIFY)
        } else if (this.data.idx == 1) {
          put(effects.GETHOMEWORK)
        } else if (this.data.idx == 2) {
          put(effects.GET_DYNAMICLIST)
        }
        wx.getStorage({
          key: 'joinImg',
          success: function(res) {
            // console.log(res)
            if (res) {
              if (!that.data.reviseinfo) {
                that.setData({
                  'reviseMsg.childLogo': res.data
                })
                that.$api.upload.upload(res.data).then(data => {
                  that.setData({
                    'reviseMsg.childLogo': that.$api.extparam.getFileUrl(data.key)
                  })
                })
              } else {
                that.setData({
                  'saveJoinMsg.logo': res.data,
                })
                that.$api.upload.upload(res.data).then(data => {
                  that.setData({
                    'joinlogo': that.$api.extparam.getFileUrl(data.key)
                  })
                })
              }
              wx.removeStorage({
                key: 'joinImg'
              })
            }
          },
        })
      },
      [PAGE_LIFE.ON_PULL_DOWN_REFRESH](option) {
        if (this.data.idx == 0) {
          put(effects.GET_NOTIFY)
        } else if (this.data.idx == 1) {
          put(effects.GETHOMEWORK)
        }
        put(effects.GETCLASSINFO)

        setTimeout(function() {
          wx.stopPullDownRefresh();
          wx: wx.hideLoading();
        }, 2000)
      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](e) {
        // console.log(this.data)
        const {
          from
        } = e;
        const {
          userinfo,
          xing,
          classinfo,
          classId,
          shortCode,
          imageUrl
        } = this.data
        let buttype = e.target.dataset.buttype
        if (classinfo.classInfo.isOwner == 'true') {
          var text = `【${classinfo.listTeacher[0].teacherName}老师@您】邀请您加入Ta建立的班级`
        } else {
          if (userinfo.role == 0) {
            var text = `【${userinfo.nickName}家长@您】邀请您加入${classinfo.listTeacher[0].teacherName}老师建立的班级`
          } else {
            var text = `【${userinfo.name}老师@您】邀请您加入${classinfo.listTeacher[0].teacherName}老师建立的班级`
          }
        }
        this.setData({
          shareShow: false
        })

        if (from === 'button') {
          put(effects.SHARE_IMG, 1)
          // console.log(this.data.shortCode)
          return {
            title: `${text}`,
            path: `/pages/course/course?action=share&code=${this.data.shortCode}`,
            imageUrl: `${imageUrl}`,
            success: (res) => {
              this.$common.showToast('分享成功', 'success')
            }
          }
        }
      }
    }
  }
  // 页面事件
  mapUIEvent({
    put
  }) {
    return {
      // 切换tab
      [events.ui.goAdd](e) {
        let type = this.data.idx
        if (type==5){
          console.log("邀请")
        }else{
          wx.navigateTo({
            url: '../addPeport/addPeport?classId=' + this.data.classId + '&userId=' + this.data.userinfo.id + '&role=' + this.data.userinfo.role + '&type=' + type,
          })
        }
       
      },
      [events.ui.CHOOSETYPE](e) {
        this.setData({
          formId: e.detail.formId
        })
        //  console.log('位置',e)
        this.setData({
          idx: e.currentTarget.dataset.idx
        })
        let idx = e.currentTarget.dataset.idx;
        let tab_index = e.currentTarget.dataset.tab;
        let slider = this.data.slider;
        put(effects.ADDFOEMID)
        this.setData({
          slider: e.currentTarget.offsetLeft + 12 + 'px'
        })
        // if (tab_index == 0){
        //   this.setData({
        //     slider: e.currentTarget.offsetLeft
        //   })
        // }else if(tab_index ==1){
        //   this.setData({
        //     slider: 'slider2'
        //   })
        // } else if (tab_index == 2) {
        //   this.setData({
        //     slider: 'slider3'
        //   })
        // } else if (tab_index == 3) {
        //   this.setData({
        //     slider: 'slider4'
        //   })
        // }

        this.data.tabList.forEach(item => {
          if (item.idx == idx) {
            item.select = true
          } else {
            item.select = false
          }
        })
        this.setData({
          tabList: this.data.tabList
        })
        // console.log(idx)
        if (idx == 0) {
          // 通知
          this.setData({
            childNumber: [],
            teacherNumber: [],
            allList: [],
            'datas.name': '您还没有发布',
            'datas.btn': '开始发布',
            shareShow: false
          })
          put(effects.GET_NOTIFY)
        } else if (idx == 1) {
          // 作业
          this.setData({
            childNumber: [],
            teacherNumber: [],
            allList: [],
            'datas.name': '您还没有发布',
            'datas.btn': '开始发布',
            shareShow: false
          })
          put(effects.GETHOMEWORK)
        } else if (idx == 2) {
          // 相册
          this.setData({
            childNumber: [],
            teacherNumber: [],
            allList: [],
            'datas.name': '您还没有发布',
            'datas.btn': '开始发布'
          })
          put(effects.GET_DYNAMICLIST)
        }else if (idx == 5) {

          // 成员           
          this.setData({
            childNumber: this.data.classinfo.listChild,
            teacherNumber: this.data.classinfo.listTeacher,
            allList: [],
            'datas.name':'你还没有成员',
            'datas.btn': '快去邀请吧',
          })
        }else{
          this.setData({
            'datas.name': '您还没有发布',
            'datas.btn': '开始发布'
          })
        }
      },
      // 切换角色
      [events.ui.changeRole]() {
        wx.redirectTo({
          url: '../../register/register?ope=changeRole&comfrom=share&classId=' + this.data.classId,
        })
      },
      //取消关注
      [events.ui.CANCEL_FOLLOW](e) {
        this.setData({
          showFollowModel: false
        })
      },
      // 预览图片
      [events.ui.PREVIEWIMAGE](e) {
        let src = e.currentTarget.dataset.src;
        wx.previewImage({
          current: src,
          urls: [src],
        })
      },
      [events.ui.AUDIO_PLAY](e) {
        // console.log(e.currentTarget.dataset.indexs)
        var indexs = e.currentTarget.dataset.indexs
        var aindex = e.currentTarget.dataset.aindex
        // console.log(indexs, aindex)
        this.setData({
          indexs: indexs,
          aindex: aindex
        })
        this.data.allList[indexs].contentList[aindex].play = true;
        this.setData({
          allList: this.data.allList
        })
        // console.log(this.data.allList[indexs].contentList[aindex])
        let audioSrc = 'subjectAudio' + indexs

        this.innerAudioContext = wx.createAudioContext(audioSrc); // 创建音频实例 TODO实例化应该在赋值src之后才能保证当前实例下能取到总时长
        // console.log(this.innerAudioContext)
        this.innerAudioContext.play();
      },
      [events.ui.AUDIO_PLAY_END]() {
        var indexs = this.data.indexs
        var aindex = this.data.aindex
        this.data.allList[indexs].contentList[aindex].play = false;
        this.setData({
          allList: this.data.allList
        })
      },
      [events.ui.AUDIO_UPDATA_PROGRESS](e) {
        var indexs = this.data.indexs
        var aindex = this.data.aindex
        let duration = e.detail.duration
        // console.log(duration)
        let currentTime = e.detail.currentTime
        // console.log(e.detail)
        var lastTime = Math.abs(parseInt(duration - currentTime));
        var sec = lastTime % 60;
        var min = "0" + parseInt(lastTime / 60);
        if (sec < 10) {
          sec = "0" + sec;
        };
        this.data.allList[indexs].contentList[aindex].audio_duration = min + ':' + sec
        this.setData({
          allList: this.data.allList
        })
      },
      [events.ui.AUDIO_STOP]() {
        var indexs = this.data.indexs
        var aindex = this.data.aindex
        this.data.allList[indexs].contentList[aindex].play = false;
        this.setData({
          allList: this.data.allList
        })
        this.innerAudioContext.pause();
      },

      // 作业详情
      [events.ui.GOWORKINFO](e) {
        // console.log(e)
        // var allList = this.data.allList;
        // console.log(allList)
        let id = e.currentTarget.dataset.id
        // console.log(id)
        // return;
        wx.navigateTo({
          url: '../workMsg/workMsg?id=' + id + '&type=' + this.data.idx + '&classId=' + this.data.classId + '&role=' + this.data.userinfo.role + '&state_id=' + id,
        })
      },

      [events.ui.classManage]() {
        wx: wx.navigateTo({
          url: '../classManage/classManage?classId=' + this.data.classId,
        })

      },
      [events.ui.close_video]() {
        this.setData({
          playvideo: true,
          videoSrc: ''
        })
      },
      // 发表
      [events.ui.reportMsg](e) {
        // console.log(e)
        this.setData({
          'top': e.currentTarget.offsetTop,
          'left': e.currentTarget.offsetLeft,
          isSubmit: false
        })
        // console.log(this.data.top, this.data.left)
        this.setData({
          formId: e.detail.formId
        })
        put(effects.ADDFOEMID)
        // wx.navigateTo({
        //   url: '../addPeport/addPeport?classId=' + this.data.classId + '&userId=' + this.data.userinfo.id + '&role=' + this.data.userinfo.role,
        // })
      },
      // 选择发布类型
      [events.ui.CHOOSUBMITSETYPE](e) {
        // console.log(e.currentTarget.dataset.type)
        this.setData({
          isSubmit: true
        })
        wx.navigateTo({
          url: '../addPeport/addPeport?classId=' + this.data.classId + '&userId=' + this.data.userinfo.id + '&role=' + this.data.userinfo.role + '&type=' + e.currentTarget.dataset.type,
        })
      },
      // 更改信息
      [events.ui.reviseInfo](e) {
        // console.log(e.currentTarget.dataset)
        // 限制次数
        if (this.data.userinfo.role == 1) {

        } else {
          // console.log(this.data)
          this.data.childNumber.forEach(item => {
            if (item.childId == this.data.childId) {
              this.setData({
                'reviseMsg': item
              })
            }
          })
        }

        this.setData({
          reviseinfo: false,
        })
        // console.log(this.data.reviseMsg)
      },
      // 选择打卡者
      [events.ui.showClocker](e) {
        this.setData({
          formId: e.detail.formId
        })
        put(effects.ADDFOEMID)
        if (this.data.userinfo.role == 0) {
          this.setData({
            isChild: false,
          })
        } else {
          this.setData({
            joinmsg: false,
            'saveJoinMsg': this.data.userinfo
          })
          // console.log(this.data.saveJoinMsg)
        }
      },
      [events.ui.JIOND](e) {
        // console.log(e.currentTarget.dataset.childid)
        this.setData({
          isChild: true,
          joinmsg: false,
          childId: e.currentTarget.dataset.childid,
        })
        this.$api.child.getChildInfor({
          childId: e.currentTarget.dataset.childid
        }).then(res => {
          this.setData({
            'saveJoinMsg': res.data.result.childInfo
          })
        })

      },
      // 修改头像
      [events.ui.SETLOGO]() {
        wx.showActionSheet({
          itemList: ['拍照', '从手机相册选择'],
          success: (res) => {
            if (res.cancel) {
              return;
            }
            var sourceType = [];
            if (res.tapIndex === 0) {
              sourceType.push('camera');
            }
            if (res.tapIndex === 1) {
              sourceType.push('album');
            }
            wx.chooseImage({
              sourceType: sourceType,
              count: 1,
              success: (resp) => {
                // console.log(resp.tempFilePaths[0])
                wx.navigateTo({
                  url: '../../../upload/upload?src=' + resp.tempFilePaths[0] + '&type=joinclass' + '&classId=' + this.data.classId
                })
              }
            })
          }
        })
      },
      // 输入学号 失去焦点触发
      [events.ui.inputStudentId](e) {
        var val = e.detail.value;
        var re = /^\d{1,5}$/;
        if (val.trim() == '') {
          // return this.$common.showMessage(this, '请输入学号');
        }
        // if (val.length > 10) {
        //     this.$common.showMessage(this, '学号最多十位')
        //     return
        //   } else {
        //     if (re.test(val)) {
        //       this.$common.showMessage(this, '请输入学号')
        //       return
        //     } else {
        //       console.log('不满足')
        //     }
        //   }
        // var re = /^\d{1,5}$/;
        // var val = Math.floor(e.detail.value);
        // if (isNaN(val)) {
        //   this.$common.showMessage(this, '请输入学号')
        // } else {
        //   if (val.length > 10) {
        //     this.$common.showMessage(this, '学号最多十位')
        //     return
        //   } else {
        //     if (re.test(val)) {
        //       this.$common.showMessage(this, '请输入学号')
        //       return
        //     } else {
        //       console.log('不满足')
        //     }
        //   }
        // }

        /**
         * 是否全日制的
         * reviseinfo    true   学号 childNo   （全日制的）
         *               false  学号 studentId （非全日制的）
         */
        if (!this.data.reviseinfo) {
          console.log('childNo')
          this.setData({
            'reviseMsg.childNo': e.detail.value
          })
        } else {

          console.log('studentId')
          this.setData({
            'saveJoinMsg.studentId': e.detail.value // 非全日制
          })
        }
      },
      // 填写名字
      [events.ui.inputName](e) {
        var name = e.detail.value;
        if (name.length == '') {
          return this.$common.showMessage(this, '请输入姓名')
        } else if (name.length >= 10) {
          return this.$common.showMessage(this, '输入的姓名过长')
        }
        /**
         * 全日制（非）
         * reviseinfo    false   name (非)
         *               true    childname
         */
        if (!this.data.reviseinfo) {
          console.log('childName', name)
          this.setData({
            'reviseMsg.childName': name
          })
        } else {
          console.log('name', name)
          this.setData({
            'saveJoinMsg.name': e.detail.value
          })
        }
      },
      // 填写教学科目
      [events.ui.inputsubject](e) {
        console.log('科目选填')
        this.setData({
          'saveJoinMsg.subjectName': e.detail.value
        })
      },
      // 确认添加入班级  
      [events.ui.SAVEJOIN]() {
        /**
         * role  0   代表
         */
        if (this.data.userinfo.role == 0) {
          // 用户输入的内容
          console.log('这是啥    role==0')
          var inputMap = {
            classId: this.data.classId, // 班级id
            childId: this.data.childId, // 家长还子的ID
            childNo: this.data.saveJoinMsg.studentId, // 学号
            childName: this.data.saveJoinMsg.name, // 学生姓名
            childLogo: this.data.saveJoinMsg.logo, // 头型
          }
          if (this.data.joinlogo) {
            inputMap.childLogo = this.data.joinlogo
          }
        } else {
          console.log('什么状态是', this.data.userinfo.role);
          var inputMap = {
            classId: this.data.classId,
            teacherLogo: this.data.saveJoinMsg.logo,
            teacherName: this.data.saveJoinMsg.name,
            teachSubjects: this.data.saveJoinMsg.subjectName,
            schoolName: this.data.saveJoinMsg.workOrganizationName,
          }
          if (this.data.joinlogo) {
            inputMap.teacherLogo = this.data.joinlogo
          }
        }
        // console.log(this.data.saveJoinMsg.studentId)
        if (this.data.userinfo.role == 0 && this.data.classinfo.classInfo.classType == 1) {
          /**
           * classtype 1 全日制
           *           2 非全日制
           */
          if (this.$common.isBlank(inputMap.childNo)) {
            // this.$common.showMessage(this, '请输入学号');
            // return;
          }
        }
        if (this.data.code) {
          inputMap.shareCode = this.data.code
        }
        console.log('加入班级信息', inputMap)
        put(effects.JOINCLASS, {
          inputMap
        })

      },

      // 保存修改信息
      [events.ui.SAVE_REVISE_INFO]() {
        console.log('保存', this.data.reviseMsg);
        var msgs = this.data.reviseMsg
        // this.$api.upload.upload(this.data.reviseMsg.childLogo).then(res => {
        let map = {
          classId: this.data.classId,
          childId: this.data.childId,
          childName: msgs.childName, // 姓名
          childLogo: msgs.childLogo,
          childNo: msgs.childNo // 学号
        }
        console.log('教师端加入班级', map);
        this.$api.class.updateClassChildInfo(map).then(res => {
          console.log(res.data.result)
          if (res.data.errorCode == 0) {
            put(effects.GETCLASSINFO)
            this.setData({
              reviseinfo: true
            })
          }
        })
        // });

      },
      [events.ui.CANCELJOIN]() {
        this.setData({
          joinmsg: true,
          reviseinfo: true,
        })
      },
      // 同意加入班级
      [events.ui.agreejoin](e) {
        // console.log(e.currentTarget.dataset)
        let type = e.currentTarget.dataset.type
        let id = e.currentTarget.dataset.id
        let inputMap = null
        if (type == 'tearcher') {
          inputMap = {
            teacherId: id,
            status: 2,
            classId: this.data.classId,
          }
        } else {
          inputMap = {
            classId: this.data.classId,
            childId: id,
            status: 2
          }
        }
        put(effects.updataStstus, {
          inputMap
        })
      },
      // 拒绝加入班级
      [events.ui.rejectjoin](e) {
        // console.log(e.currentTarget.dataset.id)
        let type = e.currentTarget.dataset.type
        let id = e.currentTarget.dataset.id
        let inputMap = {}
        if (type == 'tearcher') {
          inputMap = {
            classId: this.data.classId,
            teacherId: id,
            status: 3
          }
        } else {
          inputMap = {
            classId: this.data.classId,
            childId: id,
            status: 3
          }
        }
        put(effects.updataStstus, {
          inputMap
        })
      },
      // 退出班级
      [events.ui.outclass](e) {
        let type = e.currentTarget.dataset.type
        let id = e.currentTarget.dataset.id
        let inputMap = {}
        if (type == 'tearcher') {
          inputMap = {
            classId: this.data.classId,
            teacherId: id,
            status: 5
          }
        } else {
          inputMap = {
            classId: this.data.classId,
            childId: id,
            status: 5
          }
        }
        wx.showModal({
          title: '提示',
          content: '确定退出班级？',
          confirmColor: '#E7C60E',
          success: res => {
            if (res.confirm) {
              put(effects.updataStstus, {
                inputMap
              })
            }
          }
        })

      },
      mytouchstart: function(e) {
        let that = this;
        that.setData({
          'touch_start': e.timeStamp
        })
        // console.log(this.data.touch_start)
      },

      mytouchend: function(e) {
        let that = this;
        that.setData({
          'touch_end': e.timeStamp
        })
      },
      [events.ui.ESTOP](e) {
        this.setData({
          showtearch: true,
          joinmsg: true,
          reviseinfo: true,
          isSubmit: true,
        })
        // console.log('------------')
      },
      [events.ui.SHOW_TEARCHMSG](e) {
        let type = e.currentTarget.dataset.type
        let id = e.currentTarget.dataset.id
        var touchTime = this.data.touch_end - this.data.touch_start;
        // console.log(touchTime);
        //如果按下时间大于350为长按  
        if (touchTime > 350) {
          if (this.data.classinfo.classInfo.isOwner == 'true' && this.data.userinfo.id != id) {
            let inputMap = {
              classId: this.data.classId,
              teacherId: id,
              status: 4
            }
            wx.showModal({
              title: '提示',
              content: '确定删除该成员？',
              confirmColor: '#f29219',
              success: res => {
                if (res.confirm) {
                  put(effects.updataStstus, {
                    inputMap
                  })
                }
              }
            })
          } else if (this.data.userinfo.id == id && this.data.classinfo.classInfo.isOwner == 'false') {
            let inputMap = {
              classId: this.data.classId,
              teacherId: id,
              status: 5
            }
            wx.showModal({
              title: '提示',
              content: '确定退出班级吗？',
              confirmColor: '#f29219',
              success: res => {
                if (res.confirm) {
                  put(effects.updataStstus, {
                    inputMap
                  })
                }
              }
            })
          }
        } else {
          this.data.classinfo.listTeacher.forEach(item => {
            if (item.teacherUserId == id) {
              this.setData({
                'showtearchmsg': item,
                'showtearch': false
              })
            }
          })
          // console.log(this.data.showtearchmsg)
        }
      },
      // 查看老师信息
      [events.ui.TEARCHERMAG](e) {
        let id = e.currentTarget.dataset.teacherid
        this.data.classinfo.listTeacher.forEach(item => {
          if (item.teacherUserId == id) {
            this.setData({
              'showtearchmsg': item,
              'showtearch': false
            })
          }
        })
      },
      // 管理员踢出班级
      [events.ui.delclass](e) {
        let type = e.currentTarget.dataset.type
        let id = e.currentTarget.dataset.id
        let inputMap = {}
        if (type == 'tearcher') {
          inputMap = {
            classId: this.data.classId,
            teacherId: id,
            status: 4
          }
        } else {
          inputMap = {
            classId: this.data.classId,
            childId: id,
            status: 4
          }
        }
        wx.showModal({
          title: '提示',
          content: '确定删除该成员？',
          confirmColor: '#f29219',
          success: res => {
            if (res.confirm) {
              put(effects.updataStstus, {
                inputMap
              })
            }
          }
        })
      },
      // 播放视频
      [events.ui.PLAYVIDEO](e) {
        // console.log(e)
        let src = e.currentTarget.dataset.src
        this.setData({
          playvideo: false,
          'videoSrc': src
        })
      },
      [events.ui.overVIDEO](e) {
        // console.log(e)
        this.setData({
          playvideo: true,
          'videoSrc': ''
        })
      },
      // 老师删除作业
      [events.ui.TEARCHER_DEL](e) {
        // console.log(e.currentTarget.dataset.tworkid)
        let inputMap = {
          id: e.currentTarget.dataset.tworkid
        }
        let that = this
        let msg = ''
        if (this.data.idx == 0) {
          msg = '通知'
        } else if (this.data.idx == 1) {
          msg = '作业'
        } else if (this.data.idx == 2) {
          msg = '相册'
        }
        wx.showModal({
          title: '提示',
          content: '确定删除班级' + msg + '吗？',
          confirmColor: '#f29219',
          success: res => {
            if (res.confirm) {
              if (that.data.idx == 0) {
                put(effects.DEL_NOTIFY, {
                  inputMap
                })
              } else if (that.data.idx == 1) {
                put(effects.TEARCHER_DEL_WORK, {
                  inputMap
                })
              } else if (that.data.idx == 2) {
                put(effects.DEL_DYNAMIC, {
                  inputMap
                })
              }

            }
          }
        })
      },
      // 取消分享
      [events.ui.modalCandel]() {
        this.setData({
          shareShow: false
        })
      },
      [events.ui.formSubmit](e) {
        put(effects.SHARE_IMG)
        let buttype = e.currentTarget.dataset.buttype
        if (buttype == 'share') {
          this.setData({
            formId: e.detail.formId
          })
          put(effects.ADDFOEMID)
        }
      }
    }
  }
  // 请求事件
  mapEffect({
    put
  }) {
    return {
      // 获取用户成员信息
      [effects.USERINFO]() {
        this.$api.user.gerUserInfo({}).then(res => {
          this.setData({
            userinfo: res.data.result,
          })
          // console.log(this.data.userinfo)
          if (this.data.userinfo.role == 0) {
            this.setData({
              rolemsg: "(学生)"
            })
            this.$api.child.get().then(res => {
              // console.log(res.data.result)
              this.setData({
                childList: res.data.result.childList
              })
            })
          }
          put(effects.GETCLASSINFO)
        })
      },
      // 班级成员状态的修改
      [effects.updataStstus](inputMap) {
        // console.log(inputMap)
        this.$api.class.updateClassMemberStatus(inputMap).then(res => {
          // console.log(res.data)
          if (res.data.errorCode == 0) {
            if (inputMap.inputMap.status == 5) {
              wx.switchTab({
                url: '../../class/class',
              })
            } else {
              put(effects.GETCLASSINFO)
            }

          }
        })
      },
      // 获取班级详情
      [effects.GETCLASSINFO]() {
        /**
         * role  判断 教师端和家长端
         */
        if (this.data.role == 0) {
          console.log('这是家长端')
          var inputdata = {
            classId: this.data.classId, // 班级 id
            childId: this.data.childId // 孩子 id
          }
        } else {
          console.log('这是教师端')
          var inputdata = {
            classId: this.data.classId // 班级ID
          }
        }
        this.$api.class.getClassDetailsByClassId(inputdata).then(res => {
          console.log(res.data);
          var result = res.data.result;
          /**
           * status  1 审核中
           *         2 参与中
           */
          if (!res.data.result) {
            // 没有数据
            return wx.showModal({
              title: '提示',
              content: '该班级已被创建者解散',
              confirmColor: '#f29219',
              success: res => {
                wx.switchTab({
                  url: '../../class/class',
                })
              }
            })

          }
          if (result.classInfo.status == 1) {
            this.setData({
              isagree: true
            })
          } else if (result.classInfo.status == 2) {
            this.setData({
              isagree: false
            })
          }
          this.setData({
            'classinfo': res.data.result,
            // childNumber: res.data.result.listChild,
            teacherNumber: res.data.result.listTeacher,
          })
          this.data.teacherNumber.forEach(item => {
            if (item.status == 1) {
              this.setData({
                'havereq': true
              })
              return
            }
          })
          this.setData({
            classStatus: res.data.result.classInfo.status
          })
          if (this.data.classinfo.classInfo.status != 2) {
            let listTeacher = this.data.classinfo.listTeacher
            listTeacher.forEach(item => {
              var teacherName = item.teacherName
              let re1 = new RegExp("^[\u4e00-\u9fa5]");
              let re2 = new RegExp("^[a-zA-Z]+$");
              if (re1.test(teacherName)) {
                if (teacherName.length == 3) {
                  let a = teacherName.substring(0, 1)
                  let b = teacherName.substring(2)
                  teacherName = a + ' * ' + b
                } else if (teacherName.length == 2) {
                  let a = teacherName.substring(0, 1)
                  teacherName = a + ' *'
                }
                item.teacherName = teacherName
              }
            })
            let info = 'classinfo.listTeacher'
            this.setData({
              [info]: listTeacher,
            })

            let listChild = this.data.classinfo.listChild
            listChild.forEach(item => {
              var childName = item.childName
              let re1 = new RegExp("^[\u4e00-\u9fa5]");
              if (re1.test(childName)) {
                if (childName.length == 3) {
                  let a = childName.substring(0, 1)
                  let b = childName.substring(2)
                  childName = a + ' * ' + b
                } else if (childName.length == 2) {
                  let a = childName.substring(0, 1)
                  childName = a + ' *'
                }
                item.childName = childName
              }
            })
            let info1 = 'classinfo.listChild'
            this.setData({
              [info1]: listChild,
            })
          }
          let countnum = 0
          this.data.classinfo.listChild.forEach(item => {
            if (item.status == 1) {
              countnum++
            }
            item.addTime = item.addTime.split(' ')[0]
          })
          let info3 = 'classinfo.listChild'
          let index = this.data.tabList.length - 1
          let tab = 'tabList[' + index + '].value'
          this.setData({
            [info3]: this.data.classinfo.listChild,
            childNumber: this.data.classinfo.listChild,
            [tab]: '成员(' + this.data.classinfo.listChild.length + ')',
            count: countnum
          })
          // console.log(this.data.classinfo)
          wx.setNavigationBarTitle({
            title: this.data.classinfo.classInfo.className
          })
          if (this.data.classinfo.classInfo.status == 2) {
            put(effects.SHARE_IMG)
            // put(effects.CHECK_FOLLOW)
          }
        })
      },
      // 申请加入班级
      [effects.JOINCLASS]({
        inputMap
      }) {
        console.log(inputMap)
        this.$api.class.joinClass(inputMap).then(res => {
          // console.log(res)
          if (res.data.errorCode == 0) {
            // 如果成功 调用
            put(effects.GETCLASSINFO)

            this.setData({
              joinmsg: true
            })

            wx.showModal({
              title: '提示',
              content: '申请成功，请耐心等待老师审核',
              confirmColor: '#f29219',
              success: res => {
                wx.switchTab({
                  url: '../../class/class',
                })
              }
            })
          }
        })
      },

      // 班级通知列表
      [effects.GET_NOTIFY]() {
        if (this.data.userinfo.role == 0) {
          var inputMap = {
            classId: this.data.classId,
            childId: this.data.childId
          }
        } else {
          var inputMap = {
            classId: this.data.classId
          }
        }
        wx.showLoading({
          title: '数据加载中...',
          mask: false,
          complete: (res)=> {
            this.$api.class.getNotifyList(inputMap).then(res => {
              if (res.data.errorCode == 0) {
                this.setData({
                  allList: res.data.result
                })
                // console.log(this.data.allList)
              } else if (res.data.errorCode == 100006) {
                this.setData({
                  allList: []
                })
              }
              wx.hideLoading()
            })
          },
        })
      
      },

      // 获取班级作业
      [effects.GETHOMEWORK]() {
        if (this.data.role == 0) {
          var inputMap = {
            classId: this.data.classId,
            childId: this.data.childId
          }
        } else {
          var inputMap = {
            classId: this.data.classId
          }
        }
        wx.showLoading({
          title: '数据加载中...',
          mask: false,
         
          complete: (res)=> {
            this.$api.class.getClassWorkList(inputMap).then(res => {
              console.log('班级作业', res.data)
              if (res.data.errorCode == 0) {
                this.setData({
                  allList: res.data.result
                })
              }else{
                allList:[]
              }
              wx.hideLoading()
            })
          },
        })
     
      },
      // 获取班级相册
      [effects.GET_DYNAMICLIST]() {
        var inputMap = {
          classId: this.data.classId,
        }
        wx.showLoading({
          title: '数据加载中..',
          mask: false,
        
          complete: (res)=> {
            this.$api.class.getClassDynamicList(inputMap).then(res => {
              if (res.data.errorCode == 0) {
              this.setData({
                allList: res.data.result
              })
             
              }else{
                allList:[]
              }
              console.log('相册获取', this.data.allList)
              wx.hideLoading()
            })
          },
        })
    
      },
      // 删除通知
      [effects.DEL_NOTIFY](data) {
        this.$api.class.deleteClassNotify(data).then(res => {
          // console.log(res.data)
          if (res.data.errorCode == 0) {
            put(effects.GET_NOTIFY)
          }
        })
      },
      // 删除作业
      [effects.TEARCHER_DEL_WORK](data) {
        this.$api.class.deleteClassMaterialWork(data).then(res => {
          // console.log(res.data)
          if (res.data.errorCode == 0) {
            put(effects.GETHOMEWORK)
          }
        })
      },
      // 删除相册
      [effects.DEL_DYNAMIC](data) {
        this.$api.class.deleteClassDynamic(data).then(res => {
          // console.log(res.data)
          if (res.data.errorCode == 0) {
            put(effects.GET_DYNAMICLIST)
          }
        })
      },
      // 分享
      [effects.SHARE_IMG](isdata) {
        // console.log(this.data)
        const param = {};
        param.dataType = 7;
        param.data = {
          'classId': this.data.classId
        };
        if (isdata) {
          param.isClassReward = 1;
        }
        this.$api.user.shareInfoRecord(param).then(res => {
          // console.log(res.data)
          const param1 = {};
          param1.dataType = 7;
          param1.data = {
            'classId': this.data.classId,
            'target': 'class',
            'shortCode': res.data.result.shortCode
          };
          if (!isdata) {
            this.$api.user.shareInfoRecord(param1).then(res => {
              this.setData({
                'shortCode': res.data.result.shortCode
              })
              // console.log(this.data.shortCode)

              let shareInfo = this.data.classinfo.classInfo
              shareInfo.teacherName = this.data.classinfo.listTeacher[0].teacherName
              let _this = this
              wx.downloadFile({
                url: this.data.shareclass,
                success: function(res) {
                  shareInfo.shareimg = res.tempFilePath
                  _this.$image.generateShareCourse(_this.data.shareCavansOptions, shareInfo, 'class').then(imageUrl => {
                    // console.log(imageUrl)
                    _this.setData({
                      imageUrl: imageUrl
                    });
                    if (_this.data.comefrom == 'create') {
                      _this.setData({
                        shareShow: true
                      })
                    }
                  });
                }
              })

            })
          }
        })
      },
      //判断用户是否关注过公众号
      [effects.CHECK_FOLLOW]() {
        this.$api.user.checkFollow().then(
          (res) => {
            // console.log(res.data)
            if (res.data.errorCode == 0) {
              if (res.data.result.isFollow == false) {
                this.setData({
                  showFollowModel: true
                })
              }
            } else {
              common.showMessage(this, res.data.errorMessage);
              return;
            }
          }
        );

      },
      // 添加formId
      [effects.ADDFOEMID]() {
        let map = {
          ids: this.data.formId
        }
        this.$api.user.addUserForm(map).then(res => {
          // console.log('保存formId')
        })
      }


    }
  }
}
// 注册
EApp.instance.register({
  type: classmsgPage,
  id: 'classmsgPage',
  config: {
    events,
    effects,
    actions
  }
});