// index.js

const { getRandomTemplate } = require('../../utils/templates.js');

const app = getApp();

Page({
  data: {
    emojiUrl: '', // 生成的表情包图片URL
    mainText: '', // 主要文本内容
    captionText: '', // 配文内容
    isGenerating: false, // 是否正在生成
    isFlipping: false, // 是否正在翻转
    shake: false, // 是否抖动
    showHistory: false, // 控制历史记录弹窗
    historyList: [], // 历史记录列表
    favoriteList: [], // 收藏列表
    activeTab: 'history', // 当前激活的标签页：history/favorite
    selectedStyle: 'cartoon', // 默认选中Q版卡通风格
    showStyleSelector: false,
    styleNames: {
      cartoon: '可爱卡通',
      realistic: '写实风格',
      sketch: '素描简笔',
      ink: '水墨江南',
      toy: '毛绒玩具'
    },
    useCount: 0,  // 累计使用次数
    remainingCount: 20,  // 剩余可用次数，默认20次
    rewardedVideoAd: null, // 激励广告实例
    tempMainText: '', // 临时保存文本
    showEditModal: false, // 控制编辑弹窗显示
  },

  onLoad() {
  
    
    // 检查是否首次打开
    const isFirstOpen = !wx.getStorageSync('hasOpened');
    if (isFirstOpen) {
      // 标记已打开过
      wx.setStorageSync('hasOpened', true);
      // 执行随机生成
      this.showRandomTemplate();
    }
    
    // 初始化生成次数
    this.initGenerateCount();

    // 初始化剩余次数
    const remainingCount = wx.getStorageSync('remainingCount');
    if (remainingCount === '') {
      // 首次打开，设置默认20次
      wx.setStorageSync('remainingCount', 20);
      this.setData({ remainingCount: 20 });
    } else {
      this.setData({ remainingCount: remainingCount });
    }

    // 获取累计使用次数（保持原有逻辑）
    const useCount = wx.getStorageSync('emojiUseCount') || 0;
    this.setData({ useCount });

    // 初始化激励广告
    if(wx.createRewardedVideoAd) {
      this.data.rewardedVideoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-0f009e28232b1369'
      });

      // 监听广告加载事件
      this.data.rewardedVideoAd.onLoad(() => {
        console.log('激励广告加载成功');
      });

      // 监听广告错误事件
      this.data.rewardedVideoAd.onError((err) => {
        console.error('激励广告加载失败', err);
        // 广告加载失败时，给予用户5次免费机会
        this.setData({ remainingCount: 5 });
        wx.setStorageSync('remainingCount', 5);
        wx.showToast({
          title: '广告加载失败，已获得5次免费机会',
          icon: 'none',
          duration: 2000
        });
      });

      // 监听广告关闭事件
      this.data.rewardedVideoAd.onClose((res) => {
        if(res && res.isEnded) {
          // 正常播放结束，重置剩余次数为20
          this.setData({ remainingCount: 20 });
          wx.setStorageSync('remainingCount', 20);
          wx.showToast({
            title: '恭喜获得20次创作机会',
            icon: 'success'
          });
        } else {
          // 播放中途退出
          wx.showToast({
            title: '需要完整观看广告才能获得创作机会哦~',
            icon: 'none'
          });
        }
      });
    }
  },


  // 保存历史记录
  saveHistory(prompt, imageUrl) {
    try {
      const history = wx.getStorageSync('emojiHistory') || [];
      const newRecord = {
        id: new Date().getTime(), // 使用当前时间戳（毫秒）作为id
        mainText: this.data.mainText,
        captionText: this.data.captionText || '',
        imageUrl,
        style: this.data.selectedStyle,
        styleText: this.data.styleNames[this.data.selectedStyle],
        createTime: new Date().toLocaleString()
      };
      
      // 将新记录添加到开头
      history.unshift(newRecord);
      
      // 最多保存30条记录
      if (history.length > 30) {
        history.length = 30;
      }
      
      // 保存到本地存储
      wx.setStorageSync('emojiHistory', history);
      
      // 更新页面数据
      this.setData({ 
        historyList: history 
      }, () => {
        console.log('历史记录已更新:', history);
      });
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  },

  // 切换到我的创作页面
  toggleHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  // 主文本输入变化
  onMainTextChange(e) {
    this.setData({
      mainText: e.detail.value
    });
  },

  // 配文输入变化
  onCaptionTextChange(e) {
    this.setData({
      captionText: e.detail.value
    });
  },

  // 调用 Coze API 生成表情包
  async callCozeAPI() {
    // 合并主文本和配文
    const combinedText = this.data.captionText.trim() 
      ? `${this.data.mainText}。\n配文"${this.data.captionText}"`
      : this.data.mainText;
    
    return new Promise((resolve, reject) => {
      // 创建请求Promise
      const requestPromise = new Promise((innerResolve, innerReject) => {
        wx.request({
          url: 'https://api.coze.cn/v1/workflow/run',
          method: 'POST',
          header: {
            'Authorization': `Bearer ${app.globalData.COZE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          data: {
            workflow_id: app.globalData.COZE_WORKFLOW_ID,
            parameters: {
              prompt: combinedText,
              type: this.data.selectedStyle // 添加风格参数
            }
          },
          success: (res) => {
            if (res.statusCode === 200 && res.data?.code === 0) {
              try {
                const outputData = JSON.parse(res.data.data);
                const imageUrl = outputData.output;
                
                if (!imageUrl) {
                  innerReject(new Error('未获取到图片地址'));
                  return;
                }
                
                innerResolve({ data: imageUrl });
              } catch (parseError) {
                innerReject(new Error('解析返回数据失败'));
              }
            } else {
              innerReject(new Error(res.data?.msg || '生成失败'));
            }
          },
          fail: (error) => {
            innerReject(error);
          }
        });
      });

      // 创建超时Promise
      const timeoutPromise = new Promise((_, innerReject) => {
        setTimeout(() => {
          innerReject(new Error('请求超时'));
        }, 15000);
      });

      // 使用 Promise.race 竞争超时和请求
      Promise.race([requestPromise, timeoutPromise])
        .then(resolve)
        .catch(reject);
    });
  },

  // 生成表情包
  async generateEmoji() {
    // 检查主文本是否为空
    if (!this.data.mainText || !this.data.mainText.trim()) {
      wx.showToast({
        title: '请输入表情包内容',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 检查是否需要观看广告
    if (this.checkNeedAd()) {
      return;
    }

    try {
      this.setData({ isGenerating: true });
      
      const response = await this.callCozeAPI();
      if (response && response.data) {
        const imageUrl = response.data;
        this.setData({ 
          emojiUrl: imageUrl,
          isFlipping: true
        });

        // 生成成功后，更新计数
        const newRemainingCount = this.data.remainingCount - 1;
        const newUseCount = this.data.useCount + 1;
        
        this.setData({
          remainingCount: newRemainingCount,
          useCount: newUseCount
        });
        
        // 保存到本地存储
        wx.setStorageSync('remainingCount', newRemainingCount);
        wx.setStorageSync('emojiUseCount', newUseCount);

        // 保存到历史记录
        this.saveHistory(this.data.mainText, imageUrl);

        setTimeout(() => {
          this.setData({ isFlipping: false });
        }, 1000);
      }
    } catch(err) {
      console.error('生成失败:', err);
      this.setData({ shake: true });
      
      wx.showToast({
        title: err.message === '请求超时' ? '生成超时，请重试' : '生成失败，请重试',
        icon: 'none'
      });

      setTimeout(() => {
        this.setData({ shake: false });
      }, 500);
    } finally {
      setTimeout(() => {
        this.setData({ isGenerating: false });
      }, 1500);
      
    }
  }, 

  // 预览和保存图片
  previewImage() {
    if (!this.data.emojiUrl) return;
    
    wx.previewImage({
      urls: [this.data.emojiUrl],
      current: this.data.emojiUrl,
      showmenu: true, // 显示长按菜单
      success: () => {
        // 显示保存提示
        wx.showToast({
          title: '长按图片可保存',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 禁止页面滚动
  onPageScroll(e) {
    return false;
  },

  // 显示应用确认对话框
  showApplyConfirm(e) {
    const record = e.currentTarget.dataset.record;  // 获取完整的记录对象
    wx.showModal({
      title: '确认应用',
      content: '是否要将这条记录应用到当前？',
      success: (res) => {
        if (res.confirm) {
          this.applyHistoryPrompt(record);  // 传递完整的记录对象
        }
      }
    });
  },

  // 显示随机生成确认框
  showRandomConfirm() {
    wx.showModal({
      title: '随机生成',
      content: '是否要随机生成一个表情包内容？',
      success: (res) => {
        if (res.confirm) {
          this.generateRandomContent();
        }
      }
    });
  },

  // 生成随机内容
  generateRandomContent() {
    const template = getRandomTemplate();
    
    this.setData({
      mainText: template.main,
      captionText: template.caption
    });

    wx.showToast({
      title: '随机生成成功',
      icon: 'success',
      duration: 1500
    });
  },

  // 显示随机模板
  showRandomTemplate() {
    const template = getRandomTemplate();
    this.setData({
      mainText: template.main,
      captionText: template.caption
    });

    wx.showToast({
      title: '随机生成成功',
      icon: 'success',
      duration: 1500
    });
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '一秒生成爆笑表情包！',
      path: '/pages/index/index',
      imageUrl: '/assets/logo.jpg'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '一键生成爆笑表情包',
      imageUrl: '/assets/logo.jpg'
    }
  },

  // 添加分享按钮点击事件
  handleShare() {
    if (!this.data.emojiUrl) {
      wx.showToast({
        title: '请先生成表情包',
        icon: 'none'
      });
      return;
    }

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 初始化生成次数
  initGenerateCount() {
    const count = wx.getStorageSync('generateCount') || 0;
    this.generateCount = count;
  },

  // 更新生成次数
  updateGenerateCount() {
    this.generateCount = (this.generateCount || 0) + 1;
    wx.setStorageSync('generateCount', this.generateCount);
  },

  // 显示风格选择器
  showStyleSelector() {
    this.setData({ showStyleSelector: true });
  },

  // 隐藏风格选择器
  hideStyleSelector() {
    this.setData({ showStyleSelector: false });
  },

  // 选择风格
  selectStyle(e) {
    const style = e.currentTarget.dataset.style;
    this.setData({ 
      selectedStyle: style,
      showStyleSelector: false
    });
  },

  // 清空主文本
  clearMainText() {
    if (!this.data.mainText.trim()) return;
    
    wx.showModal({
      title: '提示',
      content: '确定要清空当前输入的内容吗？',
      confirmText: '清空',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            mainText: ''
          });
        }
      }
    });
  },

  // 清空配文
  clearCaptionText() {
    if (!this.data.captionText.trim()) return;
    
    wx.showModal({
      title: '提示',
      content: '确定要清空当前输入的配文吗？',
      confirmText: '清空',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            captionText: ''
          });
        }
      }
    });
  },

  // 检查是否需要观看广告
  checkNeedAd() {
    const remainingCount = this.data.remainingCount;
    console.log('当前剩余次数:', remainingCount);
    
    if(remainingCount <= 0) {
      wx.showModal({
        title: '提示',
        content: '您的创作次数已用完，观看一个广告可获得20次创作机会',
        confirmText: '观看广告',
        cancelText: '取消',
        success: (res) => {
          if(res.confirm) {
            this.showRewardedVideoAd();
          }
        }
      });
      return true;
    }
    return false;
  },

  // 显示激励广告
  showRewardedVideoAd() {
    if(this.data.rewardedVideoAd) {
      this.data.rewardedVideoAd.show()
      .catch(() => {
        // 失败重试
        this.data.rewardedVideoAd.load()
          .then(() => this.data.rewardedVideoAd.show())
          .catch(err => {
            console.error('激励广告展示失败', err);
            // 广告展示失败时，也允许用户继续使用
            this.setData({ useCount: 0 });
            wx.setStorageSync('emojiUseCount', 0);
            wx.showToast({
              title: '广告展示失败，已重置使用次数',
              icon: 'none',
              duration: 2000
            });
          });
      });
    }
  },
  // 阻止事件冒泡的空函数
  return() {
    return;
  },

  // 显示编辑弹窗
  showEditModal() {
    this.setData({ 
      showEditModal: true,
      tempMainText: this.data.mainText,
      tempCaptionText: this.data.captionText
    });
  },

  // 隐藏编辑弹窗
  hideEditModal() {
    this.setData({ 
      showEditModal: false,
      mainText: this.data.tempMainText,
      captionText: this.data.tempCaptionText
    });
  },

  // 确认编辑内容
  confirmEdit() {
    this.setData({ 
      showEditModal: false
    });
  },

  // 清空编辑框文本
  clearEditText() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空当前输入的内容吗？',
      confirmText: '清空',
      confirmColor: '#f56c6c',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            mainText: ''
          });
        }
      }
    });
  },

  // 清空配文文本
  clearCaptionText() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空当前配文内容吗？',
      confirmText: '清空',
      confirmColor: '#f56c6c',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            captionText: ''
          });
        }
      }
    });
  }
});
