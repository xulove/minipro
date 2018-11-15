//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        //loginmodalName默认为false，当他值为true的时候，就会弹出登录模态框
        loginmodal: false
    },
    onLoad: function() {
        console.log("index-onload")
        var that = this;
        var token = wx.getStorageSync("token") || "";
        if (!token) {
            console.log("unable to get login token,we should login now")
            that.setData({
                loginmodal: true
            })
        }
    },
    // 点击登录按钮
    onGotUserInfo: function(e) {
        this.setData({
            loginmodal:false
        })
        console.log(e.detail.userInfo)
        app.login(e.detail.userInfo)
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    // 点击【开始提问】按钮
    onask: function(e) {
        console.log("onask was called")
        var token = wx.getStorageSync("token") || "";
        if (!token) {
            console.log("unable to get login token,we should login now")
            that.setData({
                loginmodal: true
            })
        }else{
            wx.navigateTo({
            url: "../ask/ask"
        })
        }
        
    },
    //点击问题item
    questionitemclick: function(e) {
        console.log(e)
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
    },
    // 点击问题列表，实现跳转
    onQuestionTap:function(e){
        wx.navigateTo({
            url: '../question/question',
        })
    }
})