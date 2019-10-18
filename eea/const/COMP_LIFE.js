export const COMP_LIFE = {
    ON_CREATED: 'created',	    //!组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
    ON_ATTACHED: 'attached',	//!组件生命周期函数，在组件实例进入页面节点树时执行
    ON_READY: 'ready',		    //!组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
    ON_MOVED: 'moved',		    //!组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
    ON_DETACHED: 'detached',	//!组件生命周期函数，在组件实例被从页面节点树移除时执行
}