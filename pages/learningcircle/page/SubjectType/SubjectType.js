import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './SubjectType.eea'
class SubjectTypePage extends EPage {
  get data() {
    return {
      hasDisplaySignTime: true, // 是否显示打卡时间
      hasMark: 1, // 1：没有点击效果
      hasSecondMark: 1, // 1:没有二级标签
      clockerHihe: true, //打卡者显示或隐藏
      labelHide: true, //标签显示或隐藏
      types: [{
          name: '常规类型',
          value: '1',
          checked: 'true',
        },
        {
          name: '闯关类型',
          value: '2',

        },
      ],
      // 创建主题model
      model: {
        communityType: '',
        // 主题类型  0：常规类型   1：闯关类型
        picture: '', //主题头图
        signinStartDate: '请选择', //主题开始时间
        signinEndDate: '请选择', // 主题结束时间
        title: '', // 主题标题
        communityId: '' // 圈子id
      },
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        this.setData({
          // model: {
          //   picture: option.picture,
          //   communityId: option.communityId,
          //   signinEndDate: option.signinEndDate,
          //   signinStartDate: option.signinStartDate,
          //   picture: option.picture,
          //   title: option.title,
          // }
          model: option,
        })
        console.log(this.data.model)
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {

      // 圈子类型
      [events.ui.radioChange](e) {
        console.log(e.detail.value)
        this.setData({
          'model.communityType': e.detail.value,
        })
      },
      [events.ui.SAVE_INFO](E) {
        console.log(this.data.model)
        // this.setData({
        //   errorMessage: ""
        // })
        // put(effects.SAVE_NEW_SUBJECT_INFO)
        if (this.data.model.communityType !== undefined) {
          console.log(4)
          wx.redirectTo({
            url: '../changeTheme/changeTheme?type=' + this.data.model.communityType + '&id=' + this.data.model.id + '&subjectId=' + this.data.model.subjectId + '&level=' + this.data.model.level
          })
        }else{

          console.log(5)
          wx.redirectTo({
            url: '../changeTheme/changeTheme?type=' + 1 + '&id=' + this.data.model.id + '&subjectId=' + this.data.model.subjectId + '&level=' + this.data.model.level
          })
        }
      },

      [events.ui.switchEntryFee](e) {
        wx.showModal({
          title: '提示',
          content: '不符合条件',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
    }
  }

  mapEffect() {
    return {
      [effects.SAVE_NEW_SUBJECT_INFO]() {
        console.log("调用接口时")
        let _this = this;
        //调用接口时
        console.log(this.data.model)
        this.$api.circle.createSubject(this.data.model).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == 0) {
            wx: wx.navigateBack({
              delta: 2,
            })
          }
          else {
            //保存主题失败
            let errorMessage = res.data.errorMessage;
            _this.setData({
              toast3Hidden: false,
              errorMessage: errorMessage
            })
            setTimeout(function() {
              _this.setData({
                toast3Hidden: true
              });
            }, 2000);
            return
          }
        });
      },
      [effects.GET_SUBJECT_INFO]() {
        this.$api.circle.getSubjectInfo(this.data.model).then((res) => {
          console.log(res)
          let errorCode = res.data.errorCode;
          if (errorCode == 0) {
            this.setData({
              communityHeadImg: res.data.result.picture,
              communityName: res.data.result.title,
              startDate: res.data.result.signinStartDate,
              endDate: res.data.result.signinEndDate,
              SdateSelect: true,
              EdateSelect: true,
              title: res.data.result.title,
              level: res.data.result.level
            });
            if (res.data.result.contentList != null) {
              this.setData({
                communitySubjectForPage: res.data.result.contentList,
                subjectSlidlst: res.data.result.audio,
              })
              for (let item of res.data.result.contentList) {
                if (item.contentType == 1) {
                  this.setData({
                    introduceTextNm: parseInt(this.data.introduceTextNm) + 1
                  })
                }
                if (item.contentType == 2) {
                  this.setData({
                    introducecontentImgNm: parseInt(this.data.introducecontentImgNm) + 1
                  })
                }
                if (item.contentType == 3) {
                  this.setData({
                    introducecontentAudioNm: parseInt(this.data.introducecontentAudioNm) + 1
                  })
                }
                if (item.contentType == 4) {
                  introducecontentVideoNm: parseInt(this.data.introducecontentVideoNm) + 1
                }
              }
            }
          }
        });
      }


    }
  }
}

EApp.instance.register({
  type: SubjectTypePage,
  id: 'SubjectTypePage',
  config: {
    events,
    effects,
    actions
  }
});