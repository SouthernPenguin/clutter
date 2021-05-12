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
    photoCover: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fattach.bbs.miui.com%2Fforum%2F201305%2F11%2F212813ql8v5igl9cjt8vmb.jpg&refer=http%3A%2F%2Fattach.bbs.miui.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622943556&t=410e2aa589c10510150cd8ce627be71b',
    // photoCover: '/img/2x3.png',
    price: '/img/price.png',
    // photoUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F14%2F20190114004816_nhtgr.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622870740&t=fd8f6a67806838551232c99cade0f4d5', //头像图片路径
    QRCover: '/img/QR.jpg',
    iconCover: '/img/icon.png',
    w: 670, //实际像素px
    h: 1150 //实际像素px
    // h: 1120 //实际像素px
    // h: 956 //实际像素px
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
      //课程名字
      this.drawClassName()
      // 二维码区域
      this.drawQRcode()
      //二维码区域文字
      this.drawQRtext()
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
    // XXXX的课程
    let classNameFontSize = 28 / 2
    myData.ctx.font = `bold ${classNameFontSize}px PingFang SC`; // 设置字体大小
    myData.ctx.fillStyle = "#999B9D"; // 设置文字颜色
    let classNameX = myData.headerPhoneW * 1 + 50
    let classNameY = myData.headerPhoneH * 1 + 72
    myData.ctx.fillText('XXXX的课程', classNameX, classNameY);
    myData.ctx.restore();
  },
  // 绘制封面图片
  drawCover() {
    const myData = this.data
    let {
      canvasWidth
    } = myData
    let photo = myData.canvas.createImage(); // 创建一个图片对象
    photo.src = myData.photoCover // 图片对象地址赋值
    photo.onload = () => {
      // 绘制圆角矩形
      myData.ctx.save()
      this.drawRoundedRect(myData.ctx, 0, 96, canvasWidth, 188, 14);
      // myData.ctx.clip()      
      myData.ctx.drawImage(photo, 0, 96, canvasWidth, 188) // 详见 drawImage 用法

      myData.ctx.restore();
      // 价格销量
      this.drawSalesPrice()
    }
  },
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.arc(x + width - radius, y + radius, radius, 1.5 * Math.PI, 2 * Math.PI) //右上圆角

    ctx.lineTo(x + width, y + height - radius)
    ctx.arc(x + width - radius, y + height - radius, 0, 0, 0.5 * Math.PI) //右下圆角

    ctx.lineTo(0, y + height - radius)
    // ctx.lineTo(x + radius, y + height)
    // ctx.arc(0, height , 0, 0.5 * Math.PI, 1 * Math.PI) //左下圆角

    ctx.lineTo(x, y + radius)
    ctx.arc(x + radius, y + radius, radius, 1 * Math.PI, 1.5 * Math.PI)
  },
  drawRoundedRectAll(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.arc(x + width - radius, y + radius, radius, 1.5 * Math.PI, 2 * Math.PI)
    ctx.lineTo(x + width, y + height - radius)
    ctx.arc(x + width - radius, y + height - radius, radius, 0, 0.5 * Math.PI)
    ctx.lineTo(x + radius, y + height)
    ctx.arc(x + radius, y + height - radius, radius, 0.5 * Math.PI, 1 * Math.PI)
    ctx.lineTo(x, y + radius)
    ctx.arc(x + radius, y + radius, radius, 1 * Math.PI, 1.5 * Math.PI)
  },
  //价格销量底图
  drawSalesPrice() {
    const myData = this.data
    let {
      canvasWidth,
      price
    } = myData
    let photo = myData.canvas.createImage(); // 创建一个图片对象
    photo.src = price // 图片对象地址赋值
    photo.onload = () => {
      myData.ctx.drawImage(photo, 0, 238, canvasWidth, 72) // 详见 drawImage 用法
      this.drawSalesPriceText()
    }
  },
  //价格销量信息
  drawSalesPriceText() {
    const myData = this.data
    let {
      canvasWidth
    } = myData
    // 累积销售
    let marke = 14
    myData.ctx.font = `${marke}px Regular PingFang SC`;
    myData.ctx.fillStyle = "#FFFFFF";
    let marketX = 13
    let marketY = 294
    myData.ctx.fillText('累积销售1254', marketX, marketY);
    // 课程价
    let classPrice = 12
    myData.ctx.font = ` ${classPrice}px Regular PingFang SC`;
    myData.ctx.fillStyle = "#FFFFFF";
    let classPriceX = canvasWidth - 73
    let classPriceY = 260
    myData.ctx.fillText('课程价', classPriceX, classPriceY);
    // 符号￥
    let flag = 17
    myData.ctx.font = `${flag}px Bold PingFang SC`;
    myData.ctx.fillStyle = "#FFFFFF";
    let flagX = canvasWidth - 108
    let flagY = 294
    myData.ctx.fillText('￥', flagX, flagY);
    // 价格
    let price = 24
    myData.ctx.font = `Bold ${price}px PingFang SC`;
    myData.ctx.fillStyle = "#FFFFFF";
    let priceX = canvasWidth - 90
    let priceY = 294
    myData.ctx.fillText('111.2', priceX, priceY);
  },
  //课程名字
  drawClassName() {
    const myData = this.data
    let {
      canvasWidth
    } = myData
    myData.ctx.save()
    let x = 0,
      y = 310,
      width = canvasWidth,
      height = 78,
      radius = 12
    myData.ctx.moveTo(x + radius, y)
    myData.ctx.lineTo(width, y)
    myData.ctx.arc(x + width - radius, y + height - radius, radius, 0, 0.5 * Math.PI)
    myData.ctx.lineTo(x + radius, y + height)
    myData.ctx.arc(x + radius, y + height - radius, radius, 0.5 * Math.PI, 1 * Math.PI)
    myData.ctx.lineTo(x, y)
    myData.ctx.clip()
    const ctx1 = this.data.canvas.getContext('2d')
    ctx1.fillStyle = 'white'
    ctx1.fillRect(0, 310, canvasWidth, 78)


    myData.ctx.restore();
    // 标题
    let classNameFontSize = 17
    myData.ctx.font = `${classNameFontSize}px Bold PingFang SC`;
    myData.ctx.fillStyle = "#130A0F";
    let classNameX = 10
    let classNameY = 334
    myData.ctx.fillText('周末钢琴体验课周末钢琴体验课周末', classNameX, classNameY);
    //标签
    let labelNameFontSize = 12
    myData.ctx.font = `${labelNameFontSize}px Bold  PingFang SC`;
    myData.ctx.fillStyle = "#4C4D55";
    let labelNameX = 83
    let labelNameY = 355
    myData.ctx.fillText('精选琴谱免费送', labelNameX, labelNameY);
    //以抢xx%
    this.scareBuying()

  },
  //以抢xx%
  scareBuying() {
    const myData = this.data
    myData.ctx.save()
    this.drawRoundedRectAll(myData.ctx, 10, 342, 64, 18, 10)
    myData.ctx.clip()
    const ctx = this.data.canvas.getContext('2d')
    ctx.fillStyle = 'rgba(230, 0, 19, 0.1)'
    ctx.fillRect(10, 342, 64, 18)
    myData.ctx.restore();
    // 火icon
    let photo = myData.canvas.createImage(); // 创建一个图片对象
    photo.src = myData.iconCover // 图片对象地址赋值
    photo.onload = () => {
      myData.ctx.drawImage(photo, 16, 346, photo.width / 2, photo.height / 2) // 详见 drawImage 用法
    }
    // 标题
    let iconNameFontSize = 10
    myData.ctx.font = `${iconNameFontSize}px PingFang SC`;
    myData.ctx.fillStyle = "#D22410";
    let iconNameX = 28
    let iconNameY = 355
    myData.ctx.fillText('已抢98%', iconNameX, iconNameY);
  },
  //二维码
  drawQRcode() {
    const myData = this.data
    let {
      canvasWidth
    } = myData
    myData.ctx.save()
    this.drawRoundedRectAll(myData.ctx, 0, 388, canvasWidth, 122, 14)

    myData.ctx.clip()
    const ctx = this.data.canvas.getContext('2d')
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 388, canvasWidth, 122)
    
    this.AAA()
    myData.ctx.restore();

   

    let photoDiam = 160 / 2
    let photo = myData.canvas.createImage(); // 创建一个图片对象
    photo.src = myData.QRCover // 图片对象地址赋值
    photo.onload = () => {
      let x = canvasWidth - photoDiam - 14 // 左上角相对X轴的距离
      let y = 400 // 左上角相对Y轴的距离 ：整体高度 - 头像直径 - 微调
      myData.ctx.drawImage(photo, 0, 0, photo.width, photo.height, x, y, photoDiam, photoDiam) // 详见 drawImage 用法
    }

  

  },
  drawQRtext() {
    const myData = this.data
    // 标题
    let QRNameFontSize = 24
    myData.ctx.font = `${QRNameFontSize}px PingFang SC`;
    myData.ctx.fillStyle = "#130A0F";
    let QRNameX = 10
    let QRNameY = 450 //428
    myData.ctx.fillText('XXXX', QRNameX, QRNameY);
    // 标题
    let sloganFontSize = 14
    myData.ctx.font = `${sloganFontSize}px PingFang SC`;
    myData.ctx.fillStyle = "#999B9D";
    let sloganX = 10
    let sloganY = 472 //450
    myData.ctx.fillText('XXXX', sloganX, sloganY);
  },
  AAA(){
    const myData = this.data
    let {
      canvasWidth
    } = myData
    myData.ctx.lineWidth = 3;
    myData.ctx.setLineDash([5, 15]);
    myData.ctx.strokeStyle = '#EDEDED';
    myData.ctx.beginPath();
    myData.ctx.moveTo(10, 388);
    myData.ctx.lineTo(canvasWidth - 10, 388);
    myData.ctx.stroke();
  }
})