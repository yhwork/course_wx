import regeneratorRuntime from '../../../lib/runtime'
import Resource from '../Resource'

class MessageApi {
  constructor(options) {
    const config = [
      { name: 'getUnreadMessageInfo', url: '/message/getUnreadMessageInfo', method: 'post' },
    ]
    this._resource = new Resource(options, config);
  }

  // 更新成员状态
  getUnreadMessageInfo(model) {
    return this._resource.getUnreadMessageInfo({ model: model });
  }
}

export default MessageApi