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
  },

  onLoad(options) {
    // 加载历史记录
    this.loadHistory();
    
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

    // 处理分享链接打开的情况
    if (options.imageUrl) {
      // 将分享的图片应用到当前表情包
      this.setData({
        emojiUrl: decodeURIComponent(options.imageUrl),
        mainText: options.mainText ? decodeURIComponent(options.mainText) : '',
        captionText: options.captionText ? decodeURIComponent(options.captionText) : '',
        isFlipping: true
      });

      // 添加翻转动画效果
      setTimeout(() => {
        this.setData({ isFlipping: false });
      }, 1000);
    }
  },

  // 加载历史记录
  loadHistory() {
    const history = wx.getStorageSync('emojiHistory') || [];
    this.setData({ historyList: history });
  },

  // 保存历史记录
  saveHistory(prompt, imageUrl) {
    const history = wx.getStorageSync('emojiHistory') || [];
    const newRecord = {
      id: Date.now(),
      mainText: this.data.mainText,
      captionText: this.data.captionText || '',
      imageUrl,
      createTime: new Date().toLocaleString()
    };
    
    // 将新记录添加到开头
    history.unshift(newRecord);
    
    // 最多保存50条记录
    if (history.length > 50) {
      history.pop();
    }
    
    wx.setStorageSync('emojiHistory', history);
    this.setData({ historyList: history });
  },

  // 切换历史记录弹窗
  toggleHistory() {
    this.setData({
      showHistory: !this.data.showHistory
    });
  },

  // 预览历史记录图片
  previewHistoryImage(e) {
    const { imageUrl } = e.currentTarget.dataset;
    wx.previewImage({
      urls: [imageUrl],
      current: imageUrl,
      showmenu: true
    });
  },

  // 删除历史记录
  deleteHistory(e) {
    const { id } = e.currentTarget.dataset;
    const history = this.data.historyList.filter(item => item.id !== id);
    wx.setStorageSync('emojiHistory', history);
    this.setData({ historyList: history });
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

  // 生成表情包
  async generateEmoji() {
    if (!this.data.mainText.trim()) {
      wx.showToast({
        title: '请输入表情包内容',
        icon: 'none'
      });
      return;
    }
    
    // 设置生成状态，禁用所有输入和按钮
    this.setData({ 
      isGenerating: true,
      showHistory: false // 如果历史记录弹窗打开，则关闭
    });
    
    try {
      // 合并主文本和配文
      const combinedText = this.data.captionText.trim() 
        ? `${this.data.mainText}\n配文“${this.data.captionText}”`
        : this.data.mainText;
      
      // 创建请求Promise
      const requestPromise = new Promise((resolve, reject) => {
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
              prompt: combinedText
            }
          },
          success: (res) => {
            resolve(res);
          },
          fail: (error) => {
            reject(error);
          }
        });
      });

      // 创建超时Promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('请求超时'));
        }, 15000);
      });

      // 使用 Promise.race 竞争超时和请求
      const response = await Promise.race([requestPromise, timeoutPromise]);
      console.log('API Response:', response);

      if (response.statusCode === 200 && response.data?.code === 0) {
        // 解析返回的 data 字符串获取图片 URL
        try {
          const outputData = JSON.parse(response.data.data);
          const imageUrl = outputData.output;
          
          if (!imageUrl) {
            throw new Error('未获取到图片地址');
          }

          this.setData({
            emojiUrl: imageUrl,
            isGenerating: false,
            isFlipping: true
          });
          
          // 保存历史记录
          this.saveHistory(combinedText, imageUrl);
          
          // 更新生成次数
          this.updateGenerateCount();

          setTimeout(() => {
            this.setData({ isFlipping: false });
          }, 1000);
        } catch (parseError) {
          console.error('解析返回数据失败:', parseError);
          throw new Error('解析返回数据失败');
        }
      } else {
        throw new Error(response.data?.msg || '生成失败');
      }
    } catch (error) {
      console.error('生成表情包失败:', error);
      this.setData({ 
        isGenerating: false,
        shake: true 
      });
      
      wx.showToast({
        title: error.message === '请求超时' ? '生成超时，请重试' : '生成失败，请重试',
        icon: 'none'
      });
      
      setTimeout(() => {
        this.setData({ shake: false });
      }, 500);
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

  // 应用历史记录到输入框和预览
  applyHistoryPrompt(record) {
    if (!record) return;  // 添加空值检查
    
    this.setData({
      mainText: record.mainText || '',  // 添加默认值
      captionText: record.captionText || '',
      emojiUrl: record.imageUrl || '',
      showHistory: false,
      isFlipping: true
    });

    // 添加翻转动画效果
    setTimeout(() => {
      this.setData({ isFlipping: false });
    }, 1000);

    wx.showToast({
      title: '应用成功',
      icon: 'success',
      duration: 1500
    });
  },

  // 显示删除确认对话框
  showDeleteConfirm(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.deleteHistory(id);
        }
      }
    });
  },

  // 删除历史记录
  deleteHistory(id) {
    const history = this.data.historyList.filter(item => item.id !== id);
    wx.setStorageSync('emojiHistory', history);
    this.setData({ historyList: history });
    
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 1500
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
  onShareAppMessage(res) {
    const params = this.data.emojiUrl ? {
      imageUrl: encodeURIComponent(this.data.emojiUrl),
      mainText: encodeURIComponent(this.data.mainText || ''),
      captionText: encodeURIComponent(this.data.captionText || '')
    } : {};
    
    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    return {
      title: '一秒生成爆笑表情包！',
      path: `/pages/index/index${queryString ? '?' + queryString : ''}`,
      imageUrl: this.data.emojiUrl || '/assets/images/share-default.png'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    const params = this.data.emojiUrl ? {
      imageUrl: encodeURIComponent(this.data.emojiUrl),
      mainText: encodeURIComponent(this.data.mainText || ''),
      captionText: encodeURIComponent(this.data.captionText || '')
    } : {};
    
    return {
      title: '一键生成爆笑表情包',
      query: Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&'),
      imageUrl: this.data.emojiUrl || '/assets/images/share-default.png'
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
  }
});
