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

  onLoad() {
    // 加载历史记录
    this.loadHistory();
  },

  // 加载历史记录
  loadHistory() {
    const history = wx.getStorageSync('emojiHistory') || [];
    this.setData({ historyList: history });
  },

  // 保存历史记录
  saveHistory(prompt, imageUrl) {
    const [mainText, captionText] = prompt.split('\n');
    const history = wx.getStorageSync('emojiHistory') || [];
    const newRecord = {
      id: Date.now(),
      mainText,
      captionText: captionText || '',
      imageUrl,
      createTime: new Date().toLocaleString()
    };
    
    // 将新记录添加到开头
    history.unshift(newRecord);
    
    // 最多保存20条记录
    if (history.length > 20) {
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
    
    // 合并主文本和配文
    const combinedText = this.data.captionText.trim() 
      ? `${this.data.mainText}\n配文“${this.data.captionText}”`
      : this.data.mainText;
    
    this.setData({ isGenerating: true });
    
    try {
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
    const { prompt } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认应用',
      content: '是否要将这条记录应用到当前输入框？',
      success: (res) => {
        if (res.confirm) {
          this.applyHistoryPrompt(prompt);
        }
      }
    });
  },

  // 应用历史记录到输入框
  applyHistoryPrompt(record) {
    this.setData({
      mainText: record.mainText,
      captionText: record.captionText || '',
      showHistory: false
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
  }
});
