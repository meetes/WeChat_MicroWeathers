// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    github: 'https://github.com/meetes',
    email: '582871072@qq.com',
    qq: '582871072',
    swiperHeight: 'auto',
    bannerImgList: [
      {
        src: 'https://raw.githubusercontent.com/myvin/miniprogram/master/quietweather/images/miniqrcode.jpg',
        title: 'Quiet Weather',
      },
      {
        src: 'https://raw.githubusercontent.com/myvin/miniprogram/master/juejin/images/miniqrcode.jpg',
        title: '掘金第三方版',
      },
    ],
  },


  /**
   * 设置高度
   */
  setSwiperHeight: function (res) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          swiperHeight: `${(res.windowWidth || res.screenWidth) / 375 * 200}px`
        })
      }
    })
  },

  /**
   * 在新页面中全屏预览图片
   */
  previewImages: function (e){
    let index = e.currentTarget.dataset.index || 0
    let urls = this.data.bannerImgList
    let arr = []
    let imgs = urls.forEach(item => {
      arr.push(item.src)
    })

    wx.previewImage({
      current: arr[index],
      urls: arr,
    })
  },

  /**
   * 复制到剪切板
   */
  copy: function (e){
    //console.log(e.currentTarget)
    let title = e.currentTarget.dataset.title;
    let content = e.currentTarget.dataset.content;
    wx.setClipboardData({
      data: content,
      success() {
        wx.showToast({
          title: `已复制${title}`,
          duration: 2000,
        })
      },
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setSwiperHeight();   //更新屏幕高度
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