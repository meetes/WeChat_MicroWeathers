App({
  onLaunch() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systeminfo = res
        this.globalData.isIPhoneX = /iphonex/gi.test(res.model.replace(/\s+/, ''))
      },
    })
  },
  globalData: {
    keepscreenon: false,  // 是否保持常亮，离开小程序失效
    systeminfo: {},
    isIPhoneX: false,
    ak: 'your baidu map application ak',
  },
  setGeocoderUrl(address) {
    return `https://api.map.baidu.com/geocoder/v2/?address=${address}&output=json&ak=${this.globalData.ak}`
  },
})