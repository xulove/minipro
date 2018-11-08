const Towxml = require('/towxml/main');
//app.js
App({
    onLaunch: function() {

    },
    // 登录,
    // 这里的登录并不会在app加载过程中调用，而是作为一个全局方法，在各个页面中调用
    // 参数userInfo是页面中通过登录button传递过来的用户信息
    login: function(userInfo) {
        var that = this;
        wx.showLoading({
          title: '登录中...',
        })
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, token
                wx.request({
                    url: that.globalData.requesturl + '/login', //仅为示例，并非真实的接口地址
                    data: {
                        code: res.code,
                        userinfo: JSON.stringify(userInfo)
                    },
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success(res) {
                        console.log(res.data);
                        //登录成功，1.把userinfo保存到全局的globalData中 1.把token保存在本地
                        wx.hideLoading()
                        that.globalData.userInfo = userInfo;
                        try {
                            wx.setStorageSync('token', res.data.token)
                        } catch (e) {}
                    }
                })
            }
        })

    },
    towxml: new Towxml(),
    globalData: {
        userInfo: null,
        requesturl: "http://localhost:3009"
    }
})