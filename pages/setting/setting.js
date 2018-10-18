// pages/setting/setting.js

let utils = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {},
    show: false,
    screenBrightness: '获取中',
    keepscreenon: false,
    SDKVersion: '',
    enableUpdate: true,
  },

  /**
   * 查看系统信息_页面跳转
   */
  getsysteminfo: function(){
    wx.navigateTo({
      url: '/pages/systeminfo/systeminfo',
    })
  },

  /**
   * 检查更新_显示提示信息
   */
  updateInstruc: function(){
    this.setData({
      show: true,
    })
  },

  /**
   * 检查更新_隐藏提示信息
   */
  hide: function() {
    this.setData({
      show: false,
    })
  },


  /**
   * 小工具_NFC
   */
  getHCEState: function(){
    wx.showLoading({
      title: '检测中...',
    })

    wx.getHCEState({
      success: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '检测结果',
          content: '该设备支持NFC功能',
          showCancel: false,
          confirmText: '朕知道了',
          confirmColor: '#21b68e',
        })
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '检测结果',
          content: '该设备不支持NFC功能',
          showCancel: false,
          confirmText: '朕知道了',
          confirmColor: '#21b68e',
        })
      }
    })
  },

  /**
   * 小工具_修改屏幕亮度
   */
  screenBrightnessChanging: function(e){
    var that = this;
    let val = e.detail.value;
    wx.setScreenBrightness({
      value: val / 100,
      success: function(res){
        that.setData({
          screenBrightness: val,
        })
      },
    })
  },
  
  /**
   * 小工具_获取屏幕亮度
   */
  getScreenBrightness: function(){
    var that = this;
    wx.getScreenBrightness({
      success: function (res){
        that.setData({
          screenBrightness: Number(res.value * 100).toFixed(0),
        })
      },
      fail: function(res){
        that.setData({
          screenBrightness: '获取失败',
        })
      }
    })
  },

  /**
   * 小工具_保持常量、天气搜索
   */
  switchChange: function(e){
    let dataset = e.currentTarget.dataset
    let switchparam = dataset.switchparam
    let setting = this.data.setting
    let b = this.data.keepscreenon
    let that = this

    if (switchparam === 'forceUpdate') {
      //检查更新
      if (this.data.enableUpdate) {
        setting[switchparam] = (e.detail || {}).value
      } else {
        setting[switchparam] = false
        wx.showToast({
          title: '基础库版本较低，无法使用该功能',
          icon: 'none',
          duration: 2000,
        })
      }
    } else if (switchparam === 'keepscreenon') {

      //设置常亮
      wx.setKeepScreenOn({
        keepScreenOn: !b,
        success: function (res) {
          that.setData({
            keepscreenon: !b,
          })
        },
      })
      //设置全局的常亮参数
      getApp().globalData.keepscreenon = !b

    } else {
      //自定义
      setting[switchparam] = !(e.detail || {}).value
    }
    
    this.setData({
      setting,
    })
    wx.setStorage({
      key: 'setting',
      data: setting,
    })

  },


  /**
   * 清除数据_所有
   */
  removeStorage: function (e) {
    let that = this
    let datatype = e.currentTarget.dataset.type
    if (datatype === 'menu') {    //首页悬浮球复位
      wx.setStorage({
        key: 'pos',
        data: {
          top: 'auto',
          left: 'auto',
        },
        success: function (res) {
          wx.showToast({
            title: '悬浮球已复位',
          })
        },
      })
    } else if (datatype === 'setting') {      //恢复初始化设置
      wx.showModal({
        title: '提示',
        content: '确认要初始化设置',
        cancelText: '容朕想想',
        confirmColor: '#21b68e',
        success: (res) => {
          if (res.confirm) {
            wx.removeStorage({
              key: 'setting',
              success: function (res) {
                wx.showToast({
                  title: '设置已初始化',
                })
                that.setData({
                  setting: {},
                })
              },
            })
          }
        },
      })
    } else if (datatype === 'all') {      //清除所有本地数据
      wx.showModal({
        title: '提示',
        content: '确认要删除',
        cancelText: '容朕想想',
        confirmColor: '#21b68e',
        success:function(res){
          if (res.confirm) {
            //清除缓存
            wx.clearStorage({
              success:function(res){
                wx.showToast({
                  title: '数据已清除',
                })
                that.setData({
                  setting: {},
                  pos: {},
                })
              }
            })
          }
        },
      })

    }
  },

  /**
   * 检查更新，检查版本
   */
  ifDisableUpdate: function (res) {
    let systeminfo = getApp().globalData.systeminfo
    let SDKVersion = systeminfo.SDKVersion
    let version = utils.cmpVersion(SDKVersion, '1.9.90')
    if (version >= 0) {
      this.setData({
        SDKVersion,
        enableUpdate: true,
      })
    } else {
      this.setData({
        SDKVersion,
        enableUpdate: false,
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this;

    //获取屏幕亮度
    this.getScreenBrightness()
    //更新是否长亮
    this.setData({
      keepscreenon: getApp().globalData.keepscreenon,
    })

    //获取检查更新，版本检查
    this.ifDisableUpdate();

    //获取缓存的值
    wx.getStorage({
      key: 'setting',
      success: function (res) {
        let setting = res.data
        that.setData({
          setting,
        })
      },
      fail: function (res) {
        that.setData({
          setting: {},
        })
      },
    })

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