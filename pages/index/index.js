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
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }


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
        console.log("onask")
        wx.navigateTo({
            url: "../ask/ask"
        })
    },
    //点击问题item
    questionitemclick: function(e) {
        console.log(e)
    },
    //打开登录的模态框
    showModal: function(e) {
        var showName = e.currentTarget.dataset.modal;
        this.setData({
            modalName: showName
        })
    },
    //关闭登录的模态框
    closeModal: function(e) {
        this.setData({
            modalName: null
        })
    },
})