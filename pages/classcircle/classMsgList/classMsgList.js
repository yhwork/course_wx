import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './classMsgList.eea'

class classmsglist extends EPage {
  get data() {
    return {
      classMsgList: [],
      msgid:'',
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        if (option.childId) {
          this.setData({
            childId: option.childId
          })
        }
        this.setData({
          'img': this.$api.extparam.getPageImgUrl('girlb'),
           option:option 
        })
        put(effects.GETUSRINFO)
      },
      [PAGE_LIFE.ON_SHOW](option) {
        let dataoption = this.data.option
        put(effects.getclass_msglist, dataoption)
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {   
      // 
      [events.ui.GOSKIP](e) {    
        // 消息id
        console.log(e.currentTarget.dataset)
        let data = e.currentTarget.dataset
        let classId = data.classid
        let id = data.workid       
        let role = this.data.userinfo.role
        console.log('那个端',role,'班级id',classId)
        let state_id=e.currentTarget.dataset.id;
        this.setData({
          msgid: state_id,
          id:id
        })
        var type='';
        // 判断消息类型
        if (data.type == "CLASS") {  //班级详情 
            type=5;
          // pages / classcircle / classMsg / classMsg
          wx.navigateTo({
            url: '../classMsg/classMsg?classId=' + classId + '&role=' + role + '&idx=' + type,
          })
        }
        if (data.type == 'NOTIFY') {           // 
           type = 0
        } else if (data.type == 'WORK') {      // 作业
           type = 1
        } else if (data.type == "DYNAMIC") {   // 项目
           type = 2
        } else if (data.type == 'WORK_LIKE' || data.type == 'DYNAMIC_LIKE'){
          // id: "224", type: "1", classId: "100064", role: "0"
           type = 1
           return wx.navigateTo({
             url: `/pages/classcircle/workMsg/workMsg?id=${id}&type=${type}&classId=${classId}&role=${role}&state_id=${state_id}`,
           })
        }

        // item.messageType == "WORK_LIKE" || item.messageType == "DYNAMIC_LIKE"
        // data.type = data.type.split('_')[0]
        // console.log(data.type)
        // 判断家长端
          if(role == 0){
            this.$storage.set('childId', this.data.childId);
            console.log('家长端');
            wx: wx.navigateTo({
              url: '../workMsg/workMsg?id=' + id + '&type=' + type + '&classId=' + classId + '&role=' + role + '&state_id=' + state_id,
            })   
          }else{
            wx: wx.navigateTo({
              url: '../workMsg/workMsg?id=' + id + '&type=' + type + '&classId=' + classId + '&role=' + role + '&state_id=' + state_id,
            })    
          }
        put(effects.updateUnreadMessageInfo)
      }   
    }
  }

  mapEffect() {
    return {
      // 已读消息
      [effects.updateUnreadMessageInfo](){
        this.$api.circle.updateUnreadMessageInfo({
          id:this.data.msgid
        }).then((res)=>{
          console.log('已读消息',res.data)
        })
      },
      // 获取用户信息
      [effects.GETUSRINFO]() {
        this.$api.user.gerUserInfo({}).then(res => {
          this.setData({
            userinfo: res.data.result
          })
        })
      },
      [effects.getclass_msglist](dataoption) {
        let inputMap = {}
        if (dataoption.childId) {
          this.setData({
            childId: dataoption.childId
          })
          inputMap = {
            childId: this.data.childId
          }
        }
        this.$api.class.getClassUnreadMessageList(inputMap).then(res => {
          // console.log(res.data.result)
          //存入班级

          res.data.result.forEach(item => {
            item.createDate = item.createDate.split(' ')[0]
          })

          this.setData({
            classMsgList: res.data.result    
          })
          
          this.data.classMsgList.forEach((itemlist, index) => {
            let contentList = itemlist.contentList
            if (contentList) {
              contentList.forEach(item => {
                if (item.contentType == 1) {
                  itemlist.text = item.content
                }
                return
              })
              contentList.forEach(item => {
                if (item.contentType == 2) {
                  itemlist.img = item.content
                }
                return
              })
              
              let list = 'classMsgList[' + index + ']';
              this.setData({
                [list]:itemlist,

              })
            }
          })
          console.log('消息列表',this.data.classMsgList);
        })
      }
    }
  }
}

EApp.instance.register({
  type: classmsglist,
  id: 'classmsglist',
  config: {
    events,
    effects,
    actions
  }
});