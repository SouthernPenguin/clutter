Page({
  data: {
    /*必要数据*/
    pxW: 670,
    pxH: 985,
    dpr: '',
    domeW: '', // 根据父容器宽度
    domeH: '', // 根据父容器高度度
    canvas: '', // 操作的画布节点
    ctx: "", // 以2d模式，获取一个画布节点的上下文对象
    /*海报绘制参数*/
    userHeader: '', ///img/1x3.png
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
        // const dpr = wx.getSystemInfoSync().pixelRatio
        const dom = canvasRes[1]
        const canvas = dom.node // canvas就是我们要操作的画布节点
        canvas.width = canvasRes[0].width
        canvas.height = canvasRes[0].height
        const ctx = canvas.getContext('2d') // 以2d模式，获取一个画布节点的上下文对象
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvasRes[0].width, canvasRes[0].height);
        this.setData({
          canvas,
          ctx,
          domeW: canvasRes[0].width,
          domeH: canvasRes[0].height,
          dpr
        })
        // 海报上半部分开始
        this.drawingRoundedRectLeftBottomRightBottom()
      })
    })
  },
  drawingRoundedRectLeftBottomRightBottom() {
    const myData = this.data
    let {
      domeW,
      dpr
    } = this.data
    let height = 734 / dpr.dprY
    let radius = 24 / dpr.dprY
    myData.ctx.save()
    this.drawRoundedRectLeftBottomRightBottom(myData.ctx, 0, 0, domeW, height, radius)
    myData.ctx.clip()
    myData.ctx.fillStyle = 'green'
    myData.ctx.fillRect(0, 0, domeW, height)
    myData.ctx.restore();
    this.drawHeader()
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
  drawRoundedRectLeftBottomRightBottom(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y)
    ctx.lineTo(width, y)
    ctx.arc(x + width - radius, y + height - radius, radius, 0, 0.5 * Math.PI)
    ctx.lineTo(x + radius, y + height)
    ctx.arc(x + radius, y + height - radius, radius, 0.5 * Math.PI, 1 * Math.PI)
    ctx.lineTo(x, y)
  },
  drawHeader() {
    const myData = this.data
    let {
      domeW,
      dpr
    } = this.data
    const headerHeight = 84 / dpr.dprY
    myData.ctx.fillStyle = 'red'
    myData.ctx.fillRect(0, 0, domeW, headerHeight)
    myData.ctx.restore();
  }
})