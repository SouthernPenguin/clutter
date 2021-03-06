Page({
  data: {
    /*必要数据*/
    pxW: 750,
    pxH: 1036,
    dpr: '',
    fontSizeDPR: '',
    domeW: '', // 根据父容器宽度
    domeH: '', // 根据父容器高度度
    canvasPadding: '',
    canvas: '', // 操作的画布节点
    ctx: "", // 以2d模式，获取一个画布节点的上下文对象
    /*海报绘制参数*/
    userHeader: 'https://thirdwx.qlogo.cn/mmopen/vi_32/PFaAUqJ9MibPgAL2Fsl6miaVtZqTxGrI09Ewsh6LibgI6IRhcsJGqy9ugOtTDTv1TdOUFnApmryYzngDSFlWnia4WA/132', ///img/1x3.png
    cover: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fattach.bbs.miui.com%2Fforum%2F201305%2F11%2F212813ql8v5igl9cjt8vmb.jpg&refer=http%3A%2F%2Fattach.bbs.miui.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622943556&t=410e2aa589c10510150cd8ce627be71b',
    converInform: '/img/price.png',
    hotIcon: '/img/icon.png',
    qrCode: '/img/QR.jpg',
    qrCodeNetWork: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2877499757,3239316825&fm=224&gp=0.jpg',
    classInform: {
      totalSles: 'test累计销售',
      price: 'test99',
      name: '课程名名字',
      grab: '以抢',
      label: '小标题',
      slogan: '口号'
    }
  },
  onReady: function () {
    this.drawImage()
  },
  drawImage() {
    const query = wx.createSelectorQuery() // 创建一个dom元素节点查询器
    query.in(this).select('#canves').fields({
      node: true,
      size: true
    }).exec(res => {
      query.in(this).select('#myCanvas').fields({
        node: true,
        size: true
      }).exec(canvasRes => {
        let dpr = {
          dprX: Math.round((this.data.pxW / canvasRes[0].width) * 100) / 100,
          dprY: Math.round((this.data.pxH / canvasRes[0].height) * 100) / 100
        }
        const fontSizeDPR = wx.getSystemInfoSync().pixelRatio
        const dom = canvasRes[1]
        const canvas = dom.node // canvas就是我们要操作的画布节点
        canvas.width = canvasRes[0].width
        canvas.height = canvasRes[0].height
        const ctx = canvas.getContext('2d') // 以2d模式，获取一个画布节点的上下文对象
        ctx.fillStyle = '#EDEDED';
        ctx.fillRect(0, 0, canvasRes[0].width, canvasRes[0].height);
        this.setData({
          canvas,
          ctx,
          domeW: canvasRes[0].width,
          domeH: canvasRes[0].height,
          dpr,
          fontSizeDPR
        }, () => {
          // 海报上半部分开始
          this.drawingTop()
          // 海报下半部分开始
          this.drawingBottom()
        })
      })
    })
  },
  drawingTop() {
    const that = this
    const myData = that.data
    let {
      dpr
    } = that.data
    //计算canvas的"padding"值
    let canvasPadding = {}
    let canvasPaddingX = 40 / dpr.dprX
    let canvasPaddingY = 40 / dpr.dprY
    canvasPadding.canvasPaddingX = canvasPaddingX
    canvasPadding.canvasPaddingY = canvasPaddingY
    that.setData({
      canvasPadding
    }, () => {
      let height = 734 / dpr.dprY
      let radius = 24 / dpr.dprY
      let width = 670 / dpr.dprX
      myData.ctx.save()
      that.drawRoundedRect(myData.ctx, canvasPaddingX, canvasPaddingY, width, height, radius)
      myData.ctx.clip()
      myData.ctx.fillStyle = '#EDEDED'
      // myData.ctx.fillStyle = 'green'  //'#EDEDED'
      myData.ctx.fillRect(canvasPaddingX, canvasPaddingY, width, height)
      myData.ctx.restore();
      // 虚线绘制
      myData.ctx.lineWidth = 5;
      myData.ctx.setLineDash([3, 10]);
      // myData.ctx.strokeStyle = 'red';
      myData.ctx.strokeStyle = '#EDEDED';
      myData.ctx.beginPath();
      myData.ctx.moveTo(canvasPaddingX + radius, height + radius + (15 / dpr.dprX));
      myData.ctx.lineTo(width + radius, height + radius + (15 / dpr.dprX));
      myData.ctx.stroke();

      that.drawHeader()
      that.drawCover()
      that.drawInform()
    })
  },
  /**
   * 圆角矩形方法 左下圆角右下圆角
   * @param {*} ctx 
   * @param {*} x 
   * @param {*} y 
   * @param {*} width 
   * @param {*} height 
   * @param {*} radius 
   */
  drawRoundedRect(ctx, x, y, width, height, radius) {
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
  /**
   * 圆角矩形方法 左下圆角右下圆角
   * @param {*} ctx 
   * @param {*} x 
   * @param {*} y 
   * @param {*} width 
   * @param {*} height 
   * @param {*} radius 
   */
  drawCoverRoundedRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.arc(x + width - radius, y + radius, radius, 1.5 * Math.PI, 2 * Math.PI) //右上圆角
    ctx.lineTo(x + width, y + height + radius)
    ctx.lineTo(0, y + height + radius)
    ctx.lineTo(x, y + radius)
    ctx.arc(x + radius, y + radius, radius, 1 * Math.PI, 1.5 * Math.PI)
  },
  /**
   * 圆角矩形方法 左下圆角右下圆角
   * @param {*} ctx 
   * @param {*} x 
   * @param {*} y 
   * @param {*} width 
   * @param {*} height 
   * @param {*} radius 
   */
  drawInformRoundedRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width, y)
    ctx.arc(x + width - radius, y + height - radius, radius, 0, 0.5 * Math.PI)
    ctx.lineTo(x + radius, y + height)
    ctx.arc(x + radius, y + height - radius, radius, 0.5 * Math.PI, 1 * Math.PI)
    ctx.lineTo(x, y)
  },
  drawHeader() {
    const myData = this.data
    let {
      dpr,
      canvasPadding
    } = this.data
    const headerHeight = 84 / dpr.dprY // 自动缩放
    let widht = 670 / dpr.dprX // 自动缩放
    // myData.ctx.fillStyle = 'yellow'
    myData.ctx.fillStyle = '#EDEDED'
    myData.ctx.fillRect(canvasPadding.canvasPaddingX, canvasPadding.canvasPaddingY, widht, headerHeight)
    myData.ctx.restore();
    // 头像绘制
    let headerPhoto = myData.canvas.createImage();
    headerPhoto.src = myData.userHeader
    headerPhoto.onload = () => {
      const radius = headerHeight / 2
      myData.ctx.save()
      myData.ctx.beginPath()
      myData.ctx.arc(canvasPadding.canvasPaddingX + radius, canvasPadding.canvasPaddingY + radius, radius, 0, 2 * Math.PI) //绘制圆圈
      myData.ctx.clip() //裁剪
      myData.ctx.drawImage(headerPhoto, canvasPadding.canvasPaddingX, canvasPadding.canvasPaddingY, headerHeight, headerHeight) //定位在圆圈范围内便会出现
      myData.ctx.restore()
    }
    // 文字绘制
    let headerName1 = 34 / 2
    myData.ctx.font = `bold ${headerName1}px PingFang SC`; // 设置字体大小
    myData.ctx.fillStyle = "#130A0F"; // 设置文字颜色
    let headerName1X = canvasPadding.canvasPaddingX + headerHeight + (26 / dpr.dprX)
    let headerName1Y = canvasPadding.canvasPaddingY + (44 / dpr.dprY)
    myData.ctx.fillText('我向你推荐', headerName1X, headerName1Y);

    let headerName2 = 28 / 2
    myData.ctx.font = ` ${headerName2}px PingFang SC`; // 设置字体大小
    myData.ctx.fillStyle = "#999B9D"; // 设置文字颜色
    let headerName2X = canvasPadding.canvasPaddingX + headerHeight + (26 / dpr.dprX)
    let headerName2Y = canvasPadding.canvasPaddingY + (80 / dpr.dprY)
    myData.ctx.fillText('趣艺塘的课程', headerName2X, headerName2Y);
  },
  drawCover() {
    const myData = this.data
    let {
      dpr,
      canvasPadding
    } = myData
    let headerHeight = 84 / dpr.dprY // 头像高度
    let headerHeightBottom = 38 / dpr.dprY
    // 封面尺寸
    let height = 456 / dpr.dprY
    let width = 670 / dpr.dprX
    let {
      canvasPaddingX,
      canvasPaddingY
    } = canvasPadding
    let beginY = canvasPaddingY + headerHeightBottom + headerHeight
    myData.ctx.fillStyle = '#EDEDED'
    myData.ctx.fillRect(canvasPaddingX, beginY, width, height)
    myData.ctx.restore();

    //封面图片绘制
    let coverHeight = 376 / dpr.dprY
    let coverWidth = 670 / dpr.dprX
    let coverRadius = 28 / dpr.dprY
    let coverBeginX = canvasPaddingX
    let coverBeginY = canvasPaddingY + headerHeightBottom + headerHeight
    let coverPhoto = myData.canvas.createImage();
    coverPhoto.src = myData.cover
    coverPhoto.onload = (() => {
      myData.ctx.save()
      this.drawCoverRoundedRect(myData.ctx, coverBeginX, coverBeginY, coverWidth, coverHeight, coverRadius)
      myData.ctx.clip()
      myData.ctx.drawImage(coverPhoto, coverBeginX, coverBeginY, coverWidth, coverHeight)
      myData.ctx.restore()
      // 封面课程价，积累销售绘制
      this.drawCoverInform()
    })
  },
  // 封面课程价，积累销售绘制
  drawCoverInform() {
    const myData = this.data
    let {
      dpr,
      canvasPadding
    } = myData
    let {
      canvasPaddingX,
      canvasPaddingY
    } = canvasPadding

    let headerHeight = 84 / dpr.dprY // 头像高度
    let headerHeightBottom = 38 / dpr.dprY

    let coverInformTop = 312 / dpr.dprY
    let coverInformWidth = 670 / dpr.dprX
    let coverInformHeight = 144 / dpr.dprY
    let converInformBeginY = canvasPaddingY + headerHeightBottom + headerHeight + coverInformTop
    let converInformBeginX = canvasPaddingX

    let converInformPhoto = myData.canvas.createImage();
    converInformPhoto.src = myData.converInform
    converInformPhoto.onload = (() => {
      myData.ctx.drawImage(converInformPhoto, converInformBeginX, converInformBeginY, coverInformWidth, coverInformHeight)
      // 累积销售1254 文字绘制
      let coverInformText1 = 28 / 2
      myData.ctx.font = `Regular ${coverInformText1}px SourceHanSansSC-Regular`; // 设置字体大小
      myData.ctx.fillStyle = "#fff"; // 设置文字颜色
      let coverInformText1X = canvasPaddingX + (26 / dpr.dprX)
      let coverInformText1Y = converInformBeginY + (115 / dpr.dprY)
      myData.ctx.fillText('累积销售1254', coverInformText1X, coverInformText1Y);
      // 课程价 文字绘制
      let coverInformText2 = 24 / 2
      myData.ctx.font = `Regular ${coverInformText2}px SourceHanSansSC-Regular`; // 设置字体大小
      myData.ctx.fillStyle = "#fff"; // 设置文字颜色
      let coverInformText2X = coverInformWidth - (120 / dpr.dprY)
      let coverInformText2Y = converInformBeginY + (50 / dpr.dprY)
      myData.ctx.fillText('课程价', coverInformText2X, coverInformText2Y);
      // ￥ 文字绘制
      let coverInformText3 = 34 / 2
      myData.ctx.font = `Regular ${coverInformText3}px SourceHanSansSC-Regular`; // 设置字体大小
      myData.ctx.fillStyle = "#fff"; // 设置文字颜色
      let coverInformText3X = coverInformWidth - (160 / dpr.dprY)
      let coverInformText3Y = converInformBeginY + (115 / dpr.dprY)
      myData.ctx.fillText('￥', coverInformText3X, coverInformText3Y);
      // 价格文字绘制
      let coverInformText4 = 48 / 2
      myData.ctx.font = `Bold ${coverInformText4}px SourceHanSansSC-Regular`; // 设置字体大小
      myData.ctx.fillStyle = "#fff"; // 设置文字颜色
      let coverInformText4X = coverInformWidth - (130 / dpr.dprY)
      let coverInformText4Y = converInformBeginY + (115 / dpr.dprY)
      myData.ctx.fillText('999.00', coverInformText4X, coverInformText4Y);
    })
  },
  // 课程信息
  drawInform() {
    const myData = this.data
    let {
      dpr,
      canvasPadding
    } = myData
    let {
      canvasPaddingX,
      canvasPaddingY
    } = canvasPadding

    let headerHeight = 84 / dpr.dprY // 头像高度
    let headerHeightBottom = 38 / dpr.dprY
    let coverHeight = 456 / dpr.dprY // 封面高度尺寸
    let radius = 24 / dpr.dprY

    //绘制课程信息
    let informHeight = 156 / dpr.dprY
    let informWidth = 670 / dpr.dprX
    let inforBeginX = canvasPaddingX
    let inforBeginY = canvasPaddingY + headerHeightBottom + headerHeight + coverHeight

    myData.ctx.save()
    this.drawInformRoundedRect(myData.ctx, inforBeginX, inforBeginY, informWidth, informHeight, radius)
    myData.ctx.clip()
    myData.ctx.fillStyle = 'white'
    myData.ctx.fillRect(inforBeginX, inforBeginY, informWidth, informHeight)
    myData.ctx.restore();

    // 周末钢琴体验课周末钢琴体验课周末钢琴 课程名称文字绘制
    let informText1 = 34 / 2
    myData.ctx.font = `Bold ${informText1}px PingFang SC`; // 设置字体大小
    myData.ctx.fillStyle = "#130A0F"; // 设置文字颜色
    let informText1X = canvasPaddingX + (26 / dpr.dprX)
    let informText1Y = inforBeginY + (44 / dpr.dprY)
    myData.ctx.fillText('周末钢琴体验课周末钢琴体验课周末钢琴', informText1X, informText1Y);

    // 以抢xxx%
    let hotPhoto = myData.canvas.createImage();
    hotPhoto.src = myData.hotIcon
    hotPhoto.onload = (() => {
      myData.ctx.drawImage(hotPhoto, informText1X, inforBeginY + (65 / dpr.dprY), 15 / dpr.dprX, 18 / dpr.dprX)
      let hotText2 = 20 / 2
      myData.ctx.font = ` ${hotText2}px PingFang SC`; // 设置字体大小
      myData.ctx.fillStyle = "#D22410"; // 设置文字颜色
      let hotText2X = canvasPaddingX + (54 / dpr.dprX)
      let hotText2Y = inforBeginY + (84 / dpr.dprY)
      myData.ctx.fillText('以抢98%', hotText2X, hotText2Y);
    })




    // let grabHeight = 36 / dpr.dprY
    // let grabBeginX = canvasPaddingX + (26 / dpr.dprX)
    // let grabBeginY = inforBeginY + (55 / dpr.dprY)
    // let radius1 = 20 / dpr.dprY
    // myData.ctx.save()
    // this.drawRoundedRect(myData.ctx, grabBeginX, grabBeginY, grabWidth, grabHeight, radius1)
    // myData.ctx.clip()
    // myData.ctx.fillStyle = 'rgba(230, 0, 19, 0.1)'
    // myData.ctx.fillRect(grabBeginX, grabBeginY, grabWidth, grabHeight)
    // myData.ctx.restore();


    // 精选琴谱免费送文字绘制
    let informText2 = 24 / 2
    let grabWidth = 128 / dpr.dprX
    myData.ctx.font = ` ${informText2}px PingFang SC`; // 设置字体大小
    myData.ctx.fillStyle = "#4C4D55"; // 设置文字颜色
    let informText2X = canvasPaddingX + (38 / dpr.dprX) + grabWidth
    let informText2Y = inforBeginY + (84 / dpr.dprY)
    myData.ctx.fillText('精选琴谱免费送', informText2X, informText2Y);
  },
  // 下部分
  drawingBottom() {
    const myData = this.data
    let {
      dpr,
      canvasPadding
    } = this.data
    let {
      canvasPaddingX,
      canvasPaddingY
    } = canvasPadding
    let beginX = canvasPaddingX
    let beginY = 734 / dpr.dprY + canvasPaddingY
    let width = 670 / dpr.dprX
    let height = 224 / dpr.dprY
    let radius = 28 / dpr.dprY
    myData.ctx.save()
    this.drawRoundedRect(myData.ctx, beginX, beginY, width, height, radius)
    myData.ctx.clip()
    myData.ctx.fillStyle = 'white'
    myData.ctx.fillRect(beginX, beginY, width, height)
    myData.ctx.restore();

    // 趣艺塘文字绘制
    let headerName1 = 48 / 2
    myData.ctx.font = ` ${headerName1}px PingFang SC`; // 设置字体大小
    myData.ctx.fillStyle = "#130A0F"; // 设置文字颜色
    myData.ctx.fillText('趣艺塘', beginX + (26 / dpr.dprY), beginY + (100 / dpr.dprY));
    // 趣艺塘文字绘制
    let headerName2 = 28 / 2
    myData.ctx.font = ` ${headerName2}px PingFang SC`; // 设置字体大小
    myData.ctx.fillStyle = "#999B9D"; // 设置文字颜色
    myData.ctx.fillText('口号口号口号', beginX + (26 / dpr.dprY), beginY + (160 / dpr.dprY));

    //绘制二维码
    const QRPhoto = myData.canvas.createImage();
    QRPhoto.src = myData.qrCode
    QRPhoto.onload = (() => {
      myData.ctx.drawImage(QRPhoto, beginX + (482 / dpr.dprX), beginY + (32 / dpr.dprY), 160 / dpr.dprY, 160 / dpr.dprY)
    })
  }
})