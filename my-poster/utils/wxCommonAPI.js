/**
 * 微信常见AIP集合
 */
const wxCommonAPI = {
  showShareMenu() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  setNavigationBarTitle(title) {
    wx.setNavigationBarTitle({
      title
    })
  },
  phoneNumber(phoneNumber) {
    wx.makePhoneCall({
      phoneNumber
    })
  },
  showToast(title, icon = 'none', image = '', mask = false) {
    wx.showToast({
      title,
      icon,
      image,
      mask,
      complete: (res) => {
      },
    })
  },
  hideToast() {
    wx.hideToast()
  },
  requestPayment(timeStamp, nonceStr, packageSub, signType, paySign) {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        timeStamp,
        nonceStr,
        package: packageSub,
        signType,
        paySign,
        success: (res) => {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  navigateTo(url) {
    wx.navigateTo({
      url
    })
  },
  showModal(title,cancelColor,cancelText,confirmColor,confirmText,content,showCancel = true) {
    wx.showModal({
      cancelColor,
      cancelText,
      confirmColor,
      confirmText,
      content,
      showCancel,
      title,
      complete: (res) => {
      },
    })
  }

}

export default wxCommonAPI