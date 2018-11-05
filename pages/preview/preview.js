// pages/preview/preview.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //问题的标题
        questionTitle:"",
        // 问题的详细内容
        article:{},
        //问题的奖励红包
        questionReward:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        wx.getStorage({
          key: 'question',
          success (res) {
            console.log(res.data)
            let data = app.towxml.toJson(
                        res.data.content,               // `markdown`或`html`文本内容
                        'html',             // `markdown`或`html`
                        that                    // 当前页面的`this`（2.1.0或以上的版本该参数不可省略）
                    );
            data.theme = "dark";
            that.setData({
                questionTitle:res.data.title,
                article:data,
                questionReward:res.data.reward
            })
          } 
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

    },
    //点击修改事件
    onrewrite:function(e){
        wx.navigateBack({
            delta:1
        })
    }
})