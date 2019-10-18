import regeneratorRuntime from '../../../../lib/runtime'
//obj 要遍历的对象
//arr  要遍历的数组

import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './exam.eea'
let contents = [{
  option: '',
  code: '201906040800',
  num: 1
}, {
    option: '',
    code: '201906040800',
    num: 2
  }, {
    option: '',
    code: '201906040800',
    num: 3
  }, {
    option: '',
    code: '201906040800',
    num: 4
  },];
class exam extends EPage {
  get data() {
    return {
      shortCode:"",
      itemsA: [{
          title: "1.您的孩子学琴的年限",
          number:0,
          arrs:"",
          valuesArray: [{
              type: "A",
              text: "",
              value: ["3-4年"],
              show: false,
              clicktime: 0,
              id: 1

            }, {
              type: "B",
              // value: "5-6年"
              text: "",
              value: ["5-6年"],
              show: false,
              clicktime: 0,
              id: 1
            }, {
              type: "C",
              text: "",
              // value: "7年以上"
              value: ["7年以上"],
              show: false,
              clicktime: 0,
              id: 1
            }

          ]
        },
        {
          number: 0,
          title: "2.您的孩子现在所处的年级",
          valuesArray: [{
              type: "A",
              text: "",
              value: ["小学1-3年级"],
              show: false,
              clicktime: 0,
              id: 2

            }, {
              type: "B",
              text: "",
              value: ["小学4-5年级"],
              show: false,
              clicktime: 0,
              id: 2


            }, {
              type: "C",
              text: "",
              value: ["中学6~9年级及以上"],
              show: false,
              clicktime: 0,
              id: 2
            }

          ]
        },
        {
          number: 0,
          title: "3.对于本次乐理网络课程培训，您有什么感觉？",
          valuesArray: [{
              type: "A",
              value: ["非常方便"],
              show: false,
              clicktime: 0,
              id: 3

            }, {
              type: "B",
              text: "",
              value: ["一般"],
              show: false,
              clicktime: 0,
              id: 3
            }, {
              type: "C",
              text: "",
              value: ["非常不便"],
              show: false,
              clicktime: 0,
              id: 3
            }

          ]
        },
        {
          number: 0,
          title: "4.选择你希望参加乐理考试的模式",
          valuesArray: [{
              type: "A",
              text: "2019年乐理考试在线答题模式",
            value: ["  1.乐理考试采取在线和演奏现场口答抽查相结合模式", "  2.在线考试，考试时间为45分钟", "  3.演奏现场每考生现场抽题2题，选择以一题现场口答", "  4.线上与口答成绩均合格，乐理成绩合格"],
              show: true,
              clicktime: 0,
              id: 4

            }, {
              type: "B",
              text: "2019年乐理考试线下答题模式",
              value: ["  1.乐理考试采取线下传统书面书写模式", "  2.考试时间为60分钟"],
              show: true,
              clicktime: 0,
              id: 4
            }

          ]
        }
      ],
      arr: [],
      count:0,
      everyCount:"",
      contents: contents

    };
  }

  mapPageEvent({ //生命周期方法  
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](options) { //获取参数
        put(effects.shareInfoRecord)
      },
      [PAGE_LIFE.ON_READY](option) {

      },
      [PAGE_LIFE.ON_UNLOAD](option) {
       
      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](option){
    
        if (option.from === 'button') {
          
        }
        return {
          title:"2019年上海音协电子琴考级乐理在线考试调研问卷",
          desc: '2019年上海音协电子琴考级乐理在线考试调研问卷',
          imageUrl:"/assets/icons/examimg.jpg",
          //## 此为转发给微信好友或微信群后，对方点击后进入的页面链接，可以根据自己的需求添加参数
          path: `/pages/course/courseList/courseList?action=share&code=${this.data.shortCode}`,
          //## 转发操作成功后的回调函数，用于对发起者的提示语句或其他逻辑处理
          success: function (res) {
              console.log("转发成功")
            
          },
          //## 转发操作失败/取消 后的回调处理，一般是个提示语句即可
          fail: function () {
            console.log("转发失败")
            
          }
        }
      }
    }
  }

  mapUIEvent({ //页面事件方法  
    put
  }) {
    return {
      [events.ui.radioChange](e) {
        let index = e.currentTarget.dataset.index
        let num = e.currentTarget.dataset.id
        num=num-1
        this.data.itemsA[num].valuesArray[index].clicktime = ++this.data.itemsA[num].valuesArray[index].clicktime
        this.setData({
          count:++this.data.count,
          everyCount: this.data.itemsA[num].valuesArray[index].clicktime
        })
        let obj = {
          code:"201906040800",
          option: e.currentTarget.dataset.type,
          num: e.currentTarget.dataset.id
        }
        console.log(obj)
        this.data.contents.forEach(ele=>{
          if(ele.num == obj.num){
            ele.option = obj.option
          } 
        })
        console.log("打印点击的数据   ========  =====")
        console.log(this.data.contents);
      },
      [events.ui.sumit](e){
        console.log("提交 =====")
        var flag=false //
         this.data.contents.forEach((item,index)=>{
          if(item.option==""){ //每一题选项为空
            flag=false //没值
            wx.showToast({
              title: '问卷还未答完哦!~',
              icon: 'success',
              duration: 2000
            })
          } else if (item.option!= ""){ //答卷里有值 每一项不为空
             console.log("不是空=====")
             flag=true //有值
            
          }
        })
        if(flag){//如果有值 发送请求
          put(effects.questionnaire)
        }
       
      },
      [events.ui.back](e){//返回主页面
       wx.switchTab({
         url: '../../../circle/circle'
       })

      }
    }

  }

  mapEffect() { //调接口 方法   存储方法方便调用
    return {
      [effects.questionnaire]() { //问卷调查
        this.$api.circle.questionnaire({contents:this.data.contents}).then((res) => {
          if (res.data.errorCode == 0){
            wx.showToast({
              title: '感谢您提交问卷',
              icon: 'success',
              duration: 1000,
              success:function(){}
            })

            setTimeout(function(){
              wx.switchTab({
                url: '../../../course/course'
              })
            },1000)
            
          }else{
            wx.showToast({
              title: '提交失败',
              icon: 'success',
              duration: 1000
            })
          } 
        })

      },
      [effects.shareInfoRecord](){
        this.$api.circle.shareInfoRecord({dataType:8,data:{}}).then((res)=>{ //分享
          let shortCode = res.data.result.shortCode
          this.setData({
            shortCode: shortCode
          })

        })
      }

    }
  }
}

EApp.instance.register({
  type: exam,
  id: 'exam',
  config: {
    events,
    effects,
    actions
  }
});