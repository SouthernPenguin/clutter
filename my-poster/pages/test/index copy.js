Page({
  data: {
    canvasDom: '',
    canvas: '',
    ctx: '',
    dpr: '',
    headerPhoneW: '',
    headerPhoneH: '',
    //测试数据
    photoUrl: '/img/1x3.png',
    // photoCover:'/img/',
    // photoUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F14%2F20190114004816_nhtgr.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622870740&t=fd8f6a67806838551232c99cade0f4d5', //头像图片路径
    w: 670, //实际像素px
    h: 956 //实际像素px
  },
  onReady() {
    this.drawImage()
  },
  drawImage() {
    const query = wx.createSelectorQuery() // 创建一个dom元素节点查询器
    query.select('#myCanvas') // 选择我们的canvas节点
      .fields({ // 需要获取的节点相关信息
        node: true, // 是否返回节点对应的 Node 实例
        size: true // 是否返回节点尺寸（width height）
      }).exec((res) => {
        const dom = res[0] // 因为页面只存在一个画布，所以我们要的dom数据就是 res数组的第一个元素
        const canvas = dom.node // canvas就是我们要操作的画布节点
        const ctx = canvas.getContext('2d') // 以2d模式，获取一个画布节点的上下文对象
        const dpr = wx.getSystemInfoSync().pixelRatio // 获取设备的像素比，未来整体画布根据像素比扩大
        this.setData({
          canvasDom: dom,
          canvas: canvas,
          ctx: ctx,
          dpr: dpr
        }, function () {
          this.drawing() // 开始绘图
        })
      })
  },
  drawing() {
    // wx.showLoading({
    //   title: "生成中"
    // })
    this.drawPoster().then(() => {
      //头部
      this.drawPhoto()
      this.drawHeaderText()
      //详情封面
      this.drawCover()
    }) // 绘制海报
  },
  drawPoster() {
    let that = this
    const ctx = that.data.canvas.getContext('2d')
    return new Promise((resolve, reject) => {
      that.computeCanvasSize(that.data.w / this.data.dpr, that.data.h / this.data.dpr).then(res => {
        ctx.fillStyle = 'green'
        ctx.fillRect(0, 30, res.width, res.height)
        resolve()
      })
    })

    // return new Promise((resolve, reject) => {
    //   let poster = that.data.canvas.createImage(); // 创建一个图片对象
    //   // poster.src = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F14%2F20190114004816_nhtgr.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622870740&t=fd8f6a67806838551232c99cade0f4d5' // 图片对象地址赋值
    //   // poster.onload = () => {
    //   //   that.computeCanvasSize(poster.width, poster.height) // 计算画布尺寸
    //   //     .then(function (res) {
    //   //       that.data.ctx.drawImage(poster, 0, 0, poster.width, poster.height, 0, 0, res.width, res.height);
    //   //       resolve()
    //   //     })
    //   // }
    // })
  },

  // 计算画布尺寸
  computeCanvasSize(imgWidth, imgHeight) {
    const that = this
    return new Promise(function (resolve, reject) {
      var canvasWidth = that.data.canvasDom.width // 获取画布宽度
      var posterHeight = canvasWidth * (imgHeight / imgWidth) // 计算海报高度
      var posterHeight = canvasWidth * (imgHeight / imgWidth) // 计算海报高度
      var canvasHeight = posterHeight // 计算画布高度 海报高度+底部高度
      that.setData({
        canvasWidth: canvasWidth, // 设置画布容器宽
        canvasHeight: canvasHeight, // 设置画布容器高
        posterHeight: posterHeight // 设置海报高
      }, () => { // 设置成功后再返回
        that.data.canvas.width = that.data.canvasWidth * that.data.dpr // 设置画布宽
        that.data.canvas.height = canvasHeight * that.data.dpr // 设置画布高
        that.data.ctx.scale(that.data.dpr, that.data.dpr) // 根据像素比放大
        setTimeout(function () {
          resolve({
            "width": canvasWidth,
            "height": posterHeight
          }) // 返回成功
        }, 1200)
      })
    })
  },
  // 绘制头部
  drawPhoto() {
    const myData = this.data
    // let photoDiam = this.data.photoDiam // 头像路径
    let photoDiam = 84 / 2
    let photo = myData.canvas.createImage(); // 创建一个图片对象
    photo.src = myData.photoUrl // 图片对象地址赋值
    photo.onload = () => {
      let radius = photoDiam / 2 // 圆形头像的半径
      let x = 0 // 左上角相对X轴的距离
      let y = 35 // 左上角相对Y轴的距离 ：整体高度 - 头像直径 - 微调
      // let x = myData.infoSpace // 左上角相对X轴的距离
      // let y = myData.canvasHeight - photoDiam - 35 // 左上角相对Y轴的距离 ：整体高度 - 头像直径 - 微调
      myData.ctx.save()
      myData.ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI) // arc方法画曲线，按照中心点坐标计算，所以要加上半径
      myData.ctx.clip()
      myData.ctx.drawImage(photo, 0, 0, photo.width, photo.height, x, y, photoDiam, photoDiam) // 详见 drawImage 用法
      myData.ctx.restore();
      this.setData({
        headerPhoneW: photo.width,
        headerPhoneH: photo.height,
      })
    }
  },
  drawHeaderText() {
    const myData = this.data
    // 我向你推荐
    let recommendToYouFontSize = 34 / 2
    myData.ctx.font = `bold ${recommendToYouFontSize}px PingFang SC`; // 设置字体大小
    myData.ctx.fillStyle = "#130A0F"; // 设置文字颜色
    let recommendToYouX = myData.headerPhoneW * 1 + 50
    let recommendToYouY = myData.headerPhoneH * 1 + 50
    myData.ctx.fillText('我向你推荐', recommendToYouX, recommendToYouY);
    myData.ctx.restore();
    // 趣艺塘的课程
    let classNameFontSize = 28 / 2
    myData.ctx.font = `bold ${classNameFontSize}px PingFang SC`; // 设置字体大小
    myData.ctx.fillStyle = "#999B9D"; // 设置文字颜色
    let classNameX = myData.headerPhoneW * 1 + 50
    let classNameY = myData.headerPhoneH * 1 + 72
    myData.ctx.fillText('趣艺塘的课程', classNameX, classNameY);
    myData.ctx.restore();
  },
  // 绘制封面图片

  drawCover() {
    const myData = this.data
    let {
      canvasWidth
    } = myData
    let photo = myData.canvas.createImage(); // 创建一个图片对象
    photo.src = myData.photoUrl // 图片对象地址赋值
    photo.onload = () => {
      var Point = function (x, y) {
        return {
          x: x,
          y: y
        };
      }
      var r = 13;
      var rect = this.Rect(0, 96, canvasWidth, 188);
      var ptA = Point(rect.x + r, rect.y);
      var ptB = Point(rect.x + rect.width, rect.y);
      var ptC = Point(rect.x + rect.width, rect.y + rect.height);
      var ptD = Point(rect.x, rect.y + rect.height);
      var ptE = Point(rect.x, rect.y);

      ctx.beginPath();

      ctx.moveTo(ptA.x, ptA.y);
      ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
      ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
      ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
      ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);

      ctx.stroke();
      // myData.ctx.save()
      // myData.ctx.clip()
      myData.ctx.drawImage(photo, 0, 0, photo.width, photo.height, x, y, photoDiam, photoDiam) // 详见 drawImage 用法
      // myData.ctx.restore();
    }
    const ctx = this.data.canvas.getContext('2d')
    // ctx.moveTo(10, 188); //起点左下 ---> 右下
    // ctx.lineTo(canvasWidth - 10, 188); //右下 --> 右上
    // ctx.lineTo(canvasWidth - 10, 96); //右上 --> 左上
    // // ctx.arcTo(260, 86, 300, 100, 28);
    // ctx.lineTo(10, 96); //左上 --> 左下
    // ctx.lineTo(10, 188) //回到起点

    // ctx.moveTo(100, 200);
    // ctx.lineTo(200, 200);
    // ctx.arcTo(260, 200, 300, 100, 28);
    // ctx.stroke();

    // ctx.fillStyle = 'red'
    // ctx.fillRect(0, 96, 335, 188)

    // ctx.strokeRect(50, 100, 100, 50);
    // ctx.fillRect(200, 100, 150, 100);

    // photo.onload = () => {
    //   myData.fillStyle = 'red'
    //   myData.fillRect(0,0, 30, 30)
    // }


  },
  Rect(x, y, w, h) {
    return {
      x: x,
      y: y,
      width: w,
      height: h
    };
  }
})