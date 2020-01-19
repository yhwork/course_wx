import {EApp,EPage,PAGE_LIFE} from '../../../eea/index'
import {events,effects,actions} from './schoolin_tag_add.eea'

class SchoolinTagAddPage extends EPage {
  get data() {
    return {
       model:{},
       InterNameList:[],
       cor:['yuwen','shuxue','yingyu','cor1','cor2','cor3','cor4','cor5','cor6','cor7','cor8','cor9',]
    };
  }

  mapPageEvent({put}) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
      	this.$storage.get('InterNameList').then(
      		(res)=>{
      			this.setData({InterNameList:res.data})
      		},
      		(rej)=>{}
      	)
      }
    }
  }

  mapUIEvent({put}) {
    return {
      [events.ui.CHANGE_TAGNAME](e) {
        let tagName = e.detail.value;
        this.setData({'model.tagName':tagName});
        
      },
      [events.ui.CHANGE_COR](e) {
        let i = e.currentTarget.dataset.id;
        let cor = this.data.cor;
        let data = this.data.InterNameList
        let color=''
        if(!i){
          color=cor[data.length]
        }else{
          color=cor[i]
        }
        this.setData({'model.color':color});
        
      },
      [events.ui.SAVE_TAG]() {
        put(effects.SAVE_TAG)
      }
    }
  }

  mapEffect({put}) {
    const api = this.$api;
    const common = this.$common;
    return {
      [effects.SAVE_TAG]() {
        const model = this.data.model;
        if (common.isBlank(model.tagName)) {
          return wx.showToast({
            title: '课程名称不能为空',
            duration: 1500,
            icon: 'none',
          });
        }
        model.tagNameSub = model.tagName.slice(0,1);
        console.log(this.data.InterNameList);
        this.data.InterNameList.push({
          courseName: model.tagName, 
          courseNameSub: model.tagNameSub,
          courseDel:false, 
          checked: 0,
          color:model.color,
          isbg:1,
        });
        this.$storage.set('InterNameList',this.data.InterNameList).then(
        	(res)=>{wx.navigateBack();},
        	(rej)=>{}
        )
      }
    }
  }
}


EApp.instance.register({
  type: SchoolinTagAddPage,
  id: 'SchoolinTagAddPage',
  config: {
    events,
    effects,
    actions
  }
});