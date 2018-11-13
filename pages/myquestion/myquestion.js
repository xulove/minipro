// pages/myquestion/myquestion.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navigationBarTitleText: "问题"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        // 根据进入页面的query参数，修改导航的字体
        console.log(options.query)
        switch (options.query){
            case "myask":
                that.setData({
                    navigationBarTitleText:"我的提问"
                })
                break;
            case "myanswer":
                that.setData({
                    navigationBarTitleText:"我的回答"
                })
                break;
            case "myread":
                that.setData({
                    navigationBarTitleText:"我的阅读"
                })
                break;
        }
        wx.setNavigationBarTitle({
          title: that.data.navigationBarTitleText//页面标题为路由参数
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})