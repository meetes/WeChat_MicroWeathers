// pages/citychoose/citychoose.js
let staticData = require('../../data/staticData.js')
let utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alternative: null,
    cities: [],
    // 需要显示的城市
    showItems: null,
    inputText: '',
  },

  /**
   * 清空搜索框
   */
  cancel: function(){
    this.setData({
      inputText: '',
      showItems: this.data.cities,
    })
  },

  /**
   * 文本框输入内容
   */
  inputFilter: function(e){
    let alternative = {}
    let cities = this.data.cities
    let value = e.detail.value.replace(/\s+/g, '')

    console.log(alternative)
    console.log(cities)
    console.log(value)
    if (value.length) {
      for (let i in cities) {
        let items = cities[i]
        for (let j = 0, len = items.length; j < len; j++) {
          let item = items[j]
          if (item.name.indexOf(value) !== -1) {
            if (utils.isEmptyObject(alternative[i])) {
              alternative[i] = []
            }
            alternative[i].push(item)
          }
        }
      }
      if (utils.isEmptyObject(alternative)) {
        alternative = null
      }
      this.setData({
        alternative,
        showItems: alternative,
      })
    }else{
      this.setData({
        alternative: null,
        showItems: cities,
      })
    }
  },

  // 按照字母顺序生成需要的数据格式
  getSortedAreaObj(areas) {
    // let areas = staticData.areas
    areas = areas.sort((a, b) => {
      if (a.letter > b.letter) {
        return 1
      }
      if (a.letter < b.letter) {
        return -1
      }
      return 0
    })
    let obj = {}
    for (let i = 0, len = areas.length; i < len; i++) {
      let item = areas[i]
      delete item.districts
      let letter = item.letter
      if (!obj[letter]) {
        obj[letter] = []
      }
      obj[letter].push(item)
    }
    // 返回一个对象，直接用 wx:for 来遍历对象，index 为 key，item 为 value，item 是一个数组
    return obj
  },
  choose(e) {
    let item = e.currentTarget.dataset.item
    let name = item.name
    let pages = getCurrentPages()
    let len = pages.length
    let indexPage = pages[len - 2]
    console.log(name)
    console.log(indexPage)
    indexPage.setData({
      // 是否切换了城市
      cityChanged: true,
      // 需要查询的城市
      searchCity: name,
    })
    wx.navigateBack({})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cities = this.getSortedAreaObj(staticData.cities || [])
    this.setData({
      cities,
      showItems: cities,
    })
  },

})