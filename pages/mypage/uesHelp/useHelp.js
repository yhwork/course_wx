// pages/mypage/uesHelp/useHelp.js
var pageData = {},
  type = [
    'content1', 'content2', 'content3', 'content4', 'content5', 'content6', 'content7', 'content7'
  ];

pageData.widgetsToggle = function (e) {
  var id = e.currentTarget.id, data = {};
  for (var i = 0, len = type.length; i < len; ++i) {
    data[type[i] + 'Show'] = false;
  }
  data[id + 'Show'] = !this.data[id + 'Show'];
  this.setData(data);
};

Page(pageData);