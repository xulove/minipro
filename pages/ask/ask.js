// pages/ask/ask.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //图片上传相关属性，参考wx.uploadFile
        imageUploadUrl: String,
        imageUploadName: String,
        imageUploadHeader: Object,
        imageUploadFormData: Object,
        imageUploadKeyChain: String, //例：'image.url'

        //是否在选择图片后立即上传
        // uploadImageWhenChoose:false

        //输入内容
        nodes: [],
        html: "",

        //内容输出格式，参考rich-text组件，默认为节点列表
        outputType: 'html',

        //初始化事件
        nodeList: [],
        textBufferPool: [],
        //初始化页面展示的内容
        // html: '<p class="xing-p">不谈琐碎的细节，突出主题，颜色运用。这些都是行为，这些行为是纹身师的能力表达，而他们要达到一个目标：</p><img class="xing-img" style="width: 100%" src="https://www.uooyoo.com/img2017/2/15/2017021560909533.jpg" _height="0.61983" _uploaded="true"></img><p class="xing-p">创作出来的这个纹身，有没有在瞬间抓住人眼球，让人不断的想一直看。</p>',
        html:'<p class="xing-p"></p>',
        //红包的列表
        prices: [
            2, 5, 10, 20, 50
        ],
        //选中的红包金额
        selected: 0,
        //提问标题框中输入的内容
        questionTitle: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.attached()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },
    attached: function() {
        var that = this;
        if (this.data.nodes && this.data.nodes.length > 0) {
            const textBufferPool = [];
            this.data.nodes.forEach((node, index) => {
                if (node.name === 'p') {
                    textBufferPool[index] = node.children[0].text;
                }
            })
            this.setData({
                textBufferPool,
                nodeList: this.data.nodes,
            })
        } else if (this.data.html) {
            const nodeList = this.HTMLtoNodeList();
            const textBufferPool = [];
            nodeList.forEach((node, index) => {
                if (node.name === 'p') {
                    textBufferPool[index] = node.children[0].text;
                }
            })
            console.log("textBufferPool", textBufferPool)
            console.log("nodeList", nodeList)
            that.setData({
                textBufferPool: textBufferPool,
                nodeList: nodeList
            })
        }
    },
    /**
     * 添加文本
     */
    addText: function(e) {
        this.writeTextToNode();
        const index = e.currentTarget.dataset.index;
        const node = {
            name: 'p',
            attrs: {
                class: 'xing-p',
            },
            children: [{
                type: 'text',
                text: ''
            }]
        }
        const nodeList = this.data.nodeList;
        const textBufferPool = this.data.textBufferPool;
        nodeList.splice(index + 1, 0, node);
        textBufferPool.splice(index + 1, 0, '');
        this.setData({
            nodeList,
            textBufferPool,
        })
    },

    /**
     * 事件：添加图片
     */
    addImage: function(e) {
        var that = this;
        this.writeTextToNode();
        const index = e.currentTarget.dataset.index;
        wx.chooseImage({
            success: res => {
                var tempFilePath = res.tempFilePaths[0];
                //上传图片，用返回的图片路劲替换展示的图片路劲
                wx.uploadFile({
                    url: app.globalData.requesturl + '/uploadimage' ,
                    filePath: tempFilePath,
                    name: "image",
                    success:function(uploadres){
                        var data = JSON.parse(uploadres.data)
                        wx.getImageInfo({
                            src: app.globalData.requesturl +"/imagelook/"+data.imageurl,
                            success: res => {
                                const node = {
                                    name: 'img',
                                    attrs: {
                                        class: 'xing-img',
                                        style: 'width: 100%',
                                        src: tempFilePath,
                                        _height: res.height / res.width,
                                    },
                                }
                                let nodeList = that.data.nodeList;
                                let textBufferPool = that.data.textBufferPool;
                                nodeList.splice(index + 1, 0, node);
                                textBufferPool.splice(index + 1, 0, tempFilePath);
                                that.setData({
                                    nodeList,
                                    textBufferPool,
                                })
                            }
                        })
                    }
                })
            },
        })
    },
    /**
     * 删除节点
     */
    deleteNode: function(e) {
        this.writeTextToNode();
        const index = e.currentTarget.dataset.index;
        let nodeList = this.data.nodeList;
        let textBufferPool = this.data.textBufferPool;
        nodeList.splice(index, 1);
        textBufferPool.splice(index, 1);
        this.setData({
            nodeList,
            textBufferPool,
        })
    },
    /**
     * 文本输入事件
     */
    onTextareaInput: function(e) {
        const index = e.currentTarget.dataset.index;
        let textBufferPool = this.data.textBufferPool;
        textBufferPool[index] = e.detail.value;
        this.setData({
            textBufferPool,
        })
    },
    /**
     * 事件：提交内容
     */
    onFinish: function(e) {
        wx.showLoading({
            title: '正在保存',
        })
        this.writeTextToNode();
        this.handleOutput();
    },
    /**
     * 方法：HTML转义
     */
    htmlEncode: function(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&gt;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br>");
        return s;
    },
    /**
     * 方法：HTML转义
     */
    htmlDecode: function(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&gt;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br>/g, "\n");
        return s;
    },
    /**
     * 方法：将缓冲池的文本写入节点
     */
    writeTextToNode: function(e) {
        const textBufferPool = this.data.textBufferPool;
        const nodeList = this.data.nodeList;
        nodeList.forEach((node, index) => {
            if (node.name === 'p') {
                node.children[0].text = textBufferPool[index];
            }
        })
        this.setData({
            nodeList,
        })
    },
    /**
     * 方法：将HTML转为节点
     */
    HTMLtoNodeList: function() {
        let html = this.data.html;
        let htmlNodeList = [];
        while (html.length > 0) {
            const endTag = html.match(/<\/[a-z0-9]+>/);
            if (!endTag) break;
            const htmlNode = html.substring(0, endTag.index + endTag[0].length);
            htmlNodeList.push(htmlNode);
            html = html.substring(endTag.index + endTag[0].length);
        }
        return htmlNodeList.map(htmlNode => {
            let node = {
                attrs: {}
            };
            const startTag = htmlNode.match(/<[^<>]+>/);
            const startTagStr = startTag[0].substring(1, startTag[0].length - 1).trim();
            node.name = startTagStr.split(/\s+/)[0];
            startTagStr.match(/[^\s]+="[^"]+"/g).forEach(attr => {
                const [name, value] = attr.split('=');
                node.attrs[name] = value.replace(/"/g, '');
            })
            if (node.name === 'p') {
                const endTag = htmlNode.match(/<\/[a-z0-9]+>/);
                const text = this.htmlDecode(htmlNode.substring(startTag.index + startTag[0].length, endTag.index).trim());
                node.children = [{
                    text,
                    type: 'text',
                }]
            }
            return node;
        })
    },
    /**
     * 方法：将节点转为HTML
     */
    nodeListToHTML: function() {
        return this.data.nodeList.map(node => `<${node.name} ${Object.keys(node.attrs).map(key => `${key}="${node.attrs[key]}"`).join(' ')}>${node.children ? this.htmlEncode(node.children[0].text) : ''}</${node.name}>`).join('');
    },
    /**
     * 方法：上传图片
     */
    uploadImage: function(node) {
        return new Promise(resolve => {
            let options = {
                filePath: node.attrs.src,
                url: this.data.imageUploadUrl,
                name: this.data.imageUploadName,
            }
            if (this.data.imageUploadHeader) {
                options.header = this.data.imageUploadHeader;
            }
            if (this.data.imageUploadFormData) {
                options.formData = this.data.imageUploadFormData;
            }
            options.success = res => {
                const keyChain = this.data.imageUploadKeyChain.split('.');
                let url = JSON.parse(res.data);
                keyChain.forEach(key => {
                    url = url[key];
                })
                node.attrs.src = url;
                node.attrs._uploaded = true;
                resolve();
            }
            wx.uploadFile(options);
        })
    },
    /**
     * 方法：处理节点，递归
     */
    handleOutput: function(index = 0) {
        let nodeList = this.data.nodeList;
        if (index >= nodeList.length) {
            wx.hideLoading();
            if (this.data.outputType.toLowerCase() === 'array') {
                console.log(this.data.nodeList);
            }
            if (this.data.outputType.toLowerCase() === 'html') {
                console.log(this.nodeListToHTML());
            }
            return;
        }
        const node = nodeList[index];
        if (node.name === 'img' && !node.attrs._uploaded) {
            this.uploadImage(node).then(() => {
                this.handleOutput(index + 1)
            });
        } else {
            this.handleOutput(index + 1);
        }
    },
    // 标题输入框输入事件
    onTitleInput: function(e) {
        this.setData({
            questionTitle: e.detail.value
        })
    },
    // 红包点击事件
    selectItem: function(event) {
        var that = this;
        var total = event.currentTarget.dataset.item;
        that.setData({
            selected: total
        });
    },
    // 处理问题的基本信息,然后得到问题对象
    getquestionHandler:function(e){
        var that = this;
        that.writeTextToNode();
        that.handleOutput();
        var questionContent;
        // 确定提交的形式，然后调用不同的方法得questionContent
        if (that.data.outputType.toLowerCase() === 'array') {
            questionContent = that.data.nodeList
        }
        if (that.data.outputType.toLowerCase() === 'html') {
            questionContent = that.nodeListToHTML()
        }
        var question = {
            title: that.data.questionTitle,
            content: questionContent,
            reward: that.data.selected
        };
        return question
    },
    // 点击预览事件
    onpreview: function(e) {
        var that = this;
        if(that.data.questionTitle.length<5){
            wx.showToast({
                title:'标题至少五个字',
                icon:"none"
            })
        }else{
            if(that.data.selected == 0){
                wx.showToast({
                  title: '请选择奖励红包',
                  icon:"none"
                })
            }else{
                //两次判断都通过后，再进行后面的逻辑
                wx.showLoading({
                    title: '正在加载...',
                })
                var question = that.getquestionHandler()
                wx.setStorage({
                    key: "question",
                    data: question
                })
                wx.hideLoading()
                wx.navigateTo({
                    url: '../preview/preview'
                })
            }
        }       
    },
    //点击支付事件
    onPay:function(e){
        var that = this;
        console.log("onPay...")
        // 得到问题的基本信息
        var question = that.getquestionHandler()
        //把问题保存在本地的存储对象里
        wx.setStorage({
            key: "question",
            data: question
        })

        // 首先微信登录获取code
        wx.login({
            success: res => {
                // 这时候我们是发送给后台的接口pay，获取openid的操作，在pay中完成
                wx.request({
                    url: app.globalData.requesturl + '/pay',
                    data: {
                        code: res.code,
                        question: JSON.stringify(question)
                    },
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    //这个是准备订单成功，我们可以发起支付了
                    success(res) {
                        console.log(res.data);
                        
                    },fail(err){
                        console.log(err)
                    }
                })
            }
        })
    }


})