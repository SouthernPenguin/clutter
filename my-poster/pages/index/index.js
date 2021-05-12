Page({
  data: {
    header: '/img/1x3.png',
    imgHeight: '',
    productCode: "" //二维码
  },
  onReady() {
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({
        node: true
      })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        //头部
        // 创建一个图片
        const image = canvas.createImage()
        image.src = 'https://th.bing.com/th/id/R10a301bdda8ea635347f1931c2ca5f6e?rik=6dN1%2bSinQrd%2f%2bA&riu=http%3a%2f%2fimg2.woyaogexing.com%2f2017%2f06%2f26%2f9e1b4d8e9271ed56!400x400_big.jpg&ehk=8dvmplZb9hf0vbeDViy9Uamhz%2bLDpHYehAtMrdqBOs4%3d&risl=&pid=ImgRaw'

        // 把图片画到离屏 canvas 上
        ctx.clearRect(0, 0, 84, 21)
        ctx.drawImage(image, 0, 0, 84,21)
        // ctx.fillStyle = 'red'
        // ctx.fillRect(0, 0, 350, 21)
        //主体部分
        ctx.fillStyle = 'green'
        ctx.fillRect(0, 30, 350, 186)
      })
  }
})