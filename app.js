// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    COZE_API_KEY: 'pat_R3vNyVAglwl5E9Boet7mIDhUNaJ3mqk9nvpAlL6soCOymxjYkkMJI9CpCZCo4D1y', // 替换为你的 API Key
    COZE_WORKFLOW_ID: '7455334693299290153' // 替换为你创建的工作流 ID
  },
  adLoad() {
    console.log('原生模板广告加载成功')
  },
  adError(err) {
    console.error('原生模板广告加载失败', err)
  },
  adClose() {
    console.log('原生模板广告关闭')
  }
})
