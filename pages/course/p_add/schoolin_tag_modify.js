import {EApp,EPage,PAGE_LIFE} from '../../../eea/index'
import {events,effects,actions} from './schoolin_tag_modify.eea'

class SchoolinTagModifyPage extends EPage {
  get data() {
    return {
     	model:{}
    };
  }

  mapPageEvent({put}) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
		if(typeof option.index!='undefined'){
			let index = option.index;
			this.setData({index:index});
			this.$storage.get('InterNameList').then(
				(res)=>{
					this.setData({InterNameList:res.data})
					let InterNameList = this.data.InterNameList;
					InterNameList.forEach(
						(item,itemindex)=>{
							if(itemindex==index){
								this.setData({'model.tagName':item.courseName})
							}
						}
					)
				},
				(rej)=>{}
			)
		}
      }
    }
  }

  mapUIEvent({put}) {
    return {
		[events.ui.DEL_TAG](e) {
	        this.setData({'model.tagName':''})
	    },
		[events.ui.CHANGE_TAGNAME](e) {
			let tagName = e.detail.value;
			this.setData({'model.tagName':tagName})
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
          common.showMessage(this, '课程名称不能为空');
          return false;
        }
        model.tagNameSub = model.tagName.slice(0,1);
        this.data.InterNameList.splice(this.data.index,1,{courseName: model.tagName, courseNameSub: model.tagNameSub,courseDel:false, checked: 1});
        this.$storage.set('InterNameList',this.data.InterNameList).then(
        	(res)=>{wx.navigateBack();},
        	(rej)=>{}
        )
      }
    }
  }
}


EApp.instance.register({
  type: SchoolinTagModifyPage,
  id: 'SchoolinTagModifyPage',
  config: {
    events,
    effects,
    actions
  }
});