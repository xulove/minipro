//logs.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    // 是否显示登录的模态框
    more_login_modal:false,
    // 是否已经登录
    logined:false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: ''
    })
  },
  onLoad: function () {
    var that = this;
    console.log('more-onLoad')
    //首先去获取token,有的话就去后台获取提问，没有的话，就登录
    var token = wx.getStorageSync("token") || "";
    if (!token) {
        //没有token就登录
        console.log("unable to get login token,we should login now")
        that.setData({
            more_login_modal: true
        })
    }else{
      console.log("have token on local storage")
        // 有token，说明已经登录了
        that.setData({
          logined:true
        })
    }
  },
  // 我的提问点击事件
  myquestionclick:function(){
    wx.navigateTo({
      url:'../myquestion/myquestion'
    })
  },
  // 点击登录按钮
  onGotUserInfo: function(e) {
      this.setData({
          more_login_modal:false
      })
      console.log(e.detail.userInfo)
      var logined = app.login(e.detail.userInfo)
      this.setData({
        logined:true
      })
  },
  //打开登录的模态框
  showLoginModal: function(e) {
      var showName = e.currentTarget.dataset.modal;
      this.setData({
          loginmodal: true
      })
  },
  //关闭登录的模态框
  closeLoginModal: function(e) {
      this.setData({
          loginmodal: false
      })
  }
})