// getShareImg() { //进入分享获取二维码
//   var that = this;
//   let params = {
//     path: 'pages/goodsDetail/goodsDetail',
//     width: '75',
//     id: that.data.resData.id,
//   };
//   getApp().API.getShareImg(params).then(res => {
//     if (res.code == 1) {
//       this.setData({
//         qrcodeUrl: 'data:image/png;base64,' + res.result,
//       })
//       this.drawImage()
//     } else {
//       wx.showToast({
//         title: res.message,
//         icon: 'none',
//       })
//     }
//   })
// }

// // 查询节点信息，并准备绘制图像
// drawImage() {
//   const query = wx.createSelectorQuery() // 创建一个dom元素节点查询器
//   query.select('#canvasBox') // 选择我们的canvas节点
//     .fields({ // 需要获取的节点相关信息
//       node: true, // 是否返回节点对应的 Node 实例
//       size: true // 是否返回节点尺寸（width height）
//     }).exec((res) => { // 执行针对这个节点的所有请求，exec((res) => {alpiny})  这里是一个回调函数

//       const dom = res[0] // 因为页面只存在一个画布，所以我们要的dom数据就是 res数组的第一个元素
//       const canvas = dom.node // canvas就是我们要操作的画布节点
//       const ctx = canvas.getContext('2d') // 以2d模式，获取一个画布节点的上下文对象
//       const dpr = wx.getSystemInfoSync().pixelRatio // 获取设备的像素比，未来整体画布根据像素比扩大
//       this.setData({
//         canvasDom: dom, // 把canvas的dom对象放到全局
//         canvas: canvas, // 把canvas的节点放到全局
//         ctx: ctx, // 把canvas 2d的上下文放到全局
//         dpr: dpr // 屏幕像素比
//       }, function () {
//         this.drawing() // 开始绘图
//       })
//     })
// }

// // 绘制画面 
// drawing() {
//   const that = this;
//   wx.showLoading({
//     title: "生成中"
//   }) // 显示loading
//   that.drawPoster() // 绘制海报
//     .then(function () { // 这里用同步阻塞一下，因为需要先拿到海报的高度计算整体画布的高度
//       // that.drawInfoBg()           // 绘制底部白色背景
//       that.drawPhoto() // 绘制头像
//       that.drawQrcode() // 绘制小程序码
//       that.drawText() // 绘制文字
//       setTimeout(function () {
//         wx.canvasToTempFilePath({ //将canvas生成图片
//           canvas: that.data.canvas,
//           x: 0,
//           y: 0,
//           width: that.data.canvasWidth,
//           height: that.data.canvasHeight,
//           destWidth: that.data.canvasWidth, //截取canvas的宽度
//           destHeight: that.data.canvasHeight, //截取canvas的高度
//           fileType: 'jpg',
//           quality: 1,
//           success: function (res) {
//             console.log('生成图片成功：', res)
//             that.setData({
//               imgFilePath: res.tempFilePath,
//               postersShow: false,
//             })
//             wx.previewImage({
//               current: res.tempFilePath, // 当前显示图片的http链接
//               urls: [res.tempFilePath], // 需要预览的图片http链接列表
//             })
//           },
//           fail: function (err) {
//             console.log('生成图片失败：', err)
//           },
//         }, this)
//         wx.hideLoading() // 隐藏loading
//       }, 1000)
//     })
// }

// // 绘制海报
// drawPoster() {
//   const that = this
//   return new Promise(function (resolve, reject) {
//     let poster = that.data.canvas.createImage(); // 创建一个图片对象
//     poster.src = that.data.posterUrl // 图片对象地址赋值
//     poster.onload = () => {
//       that.computeCanvasSize(poster.width, poster.height) // 计算画布尺寸
//         .then(function (res) {
//           that.data.ctx.drawImage(poster, 0, 0, poster.width, poster.height, 0, 0, res.width, res.height);
//           resolve()
//         })
//     }
//   })
// }

// // 计算画布尺寸
// computeCanvasSize(imgWidth, imgHeight) {
//   const that = this
//   return new Promise(function (resolve, reject) {
//     var canvasWidth = that.data.canvasDom.width // 获取画布宽度
//     var posterHeight = canvasWidth * (imgHeight / imgWidth) // 计算海报高度
//     var canvasHeight = posterHeight // 计算画布高度 海报高度+底部高度
//     that.setData({
//       canvasWidth: canvasWidth, // 设置画布容器宽
//       canvasHeight: canvasHeight, // 设置画布容器高
//       posterHeight: posterHeight // 设置海报高
//     }, () => { // 设置成功后再返回
//       that.data.canvas.width = that.data.canvasWidth * that.data.dpr // 设置画布宽
//       that.data.canvas.height = canvasHeight * that.data.dpr // 设置画布高
//       that.data.ctx.scale(that.data.dpr, that.data.dpr) // 根据像素比放大
//       setTimeout(function () {
//         resolve({
//           "width": canvasWidth,
//           "height": posterHeight
//         }) // 返回成功
//       }, 1200)
//     })
//   })
// }

// // 绘制白色背景
// // 注意：这里使用save 和 restore 来模拟图层的概念，防止污染
// drawInfoBg() {
//   this.data.ctx.save();
//   this.data.ctx.fillStyle = "#ffffff"; // 设置画布背景色
//   this.data.ctx.fillRect(0, this.data.canvasHeight - this.data.bottomInfoHeight, this.data.canvasWidth, this.data.bottomInfoHeight); // 填充整个画布
//   this.data.ctx.restore();
// }

// // 绘制头像
// drawPhoto() {
//   let photoDiam = this.data.photoDiam // 头像路径
//   let photo = this.data.canvas.createImage(); // 创建一个图片对象
//   photo.src = this.data.photoUrl // 图片对象地址赋值
//   photo.onload = () => {
//     let radius = photoDiam / 2 // 圆形头像的半径
//     let x = this.data.infoSpace // 左上角相对X轴的距离
//     let y = this.data.canvasHeight - photoDiam - 35 // 左上角相对Y轴的距离 ：整体高度 - 头像直径 - 微调
//     this.data.ctx.save()
//     this.data.ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI) // arc方法画曲线，按照中心点坐标计算，所以要加上半径
//     this.data.ctx.clip()
//     this.data.ctx.drawImage(photo, 0, 0, photo.width, photo.height, x, y, photoDiam, photoDiam) // 详见 drawImage 用法
//     this.data.ctx.restore();
//   }
// }
// // 绘制小程序码
// drawQrcode() {
//   let diam = this.data.qrcodeDiam // 小程序码直径
//   let qrcode = this.data.canvas.createImage(); // 创建一个图片对象
//   qrcode.src = this.data.qrcodeUrl // 图片对象地址赋值
//   qrcode.onload = () => {
//     // let radius = diam / 2                                             // 半径，alpiny敲碎了键盘
//     let x = (this.data.canvasWidth / 2) - 50 // 左上角相对X轴的距离：画布宽 - 间隔 - 直径
//     let y = this.data.canvasHeight - 258 // 左上角相对Y轴的距离 ：画布高 - 间隔 - 直径 + 微调
//     this.data.ctx.drawImage(qrcode, 0, 0, qrcode.width, qrcode.height, x, y, 100, 100 / 0.8785)
//     this.data.ctx.restore();
//   }
// }
// // 绘制文字
// drawText() {
//   const infoSpace = this.data.infoSpace // 下面数据间距
//   const photoDiam = this.data.photoDiam // 圆形头像的直径
//   this.data.ctx.save();
//   this.data.ctx.font = "14px Arial"; // 设置字体大小
//   this.data.ctx.fillStyle = "#ffffff"; // 设置文字颜色
//   // 姓名（距左：间距 + 头像直径 + 间距）（距下：总高 - 间距 - 文字高 - 头像直径 + 下移一点 ）
//   this.data.ctx.fillText(this.data.name, infoSpace * 2 + photoDiam, this.data.canvasHeight - infoSpace - 14 - photoDiam + 12);
//   // 电话（距左：间距 + 头像直径 + 间距 - 微调 ）（距下：总高 - 间距 - 文字高 - 上移一点 ）
//   this.data.ctx.fillText(this.data.phone, infoSpace * 2 + photoDiam - 2, this.data.canvasHeight - infoSpace - 14 - 16);
//   // 提示语（距左：间距 ）（距下：总高 - 间距 ）
//   this.data.ctx.fillText(this.data.tips, infoSpace, this.data.canvasHeight - infoSpace);
//   this.data.ctx.restore();
// }