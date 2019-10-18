// pages/circle/cardRanking/cardRanking.js
Page({
  data: {
    selected: true,
    selected1: false,
    selected2: false
  },
  selected: function (e) {
    this.setData({
      selected2: false,
      selected1: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected2: false,
      selected: false,
      selected1: true
    })
  },
  selected2: function (e) {
    this.setData({
      selected2: true,
      selected: false,
      selected1:false
    })
  }
})