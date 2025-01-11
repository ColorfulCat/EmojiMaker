Page({
  data: {
    activeTab: 'history', // 当前激活的标签页
    historyList: [], // 创作历史列表
    favoriteList: [], // 收藏列表
  },

  onLoad() {
    this.loadHistory();
    this.loadFavorites();
  },

  // 加载历史记录
  loadHistory() {
    try {
      const history = wx.getStorageSync('emojiHistory') || [];
      this.setData({ historyList: history });
    } catch (error) {
      console.error('加载历史记录失败:', error);
      this.setData({ historyList: [] });
    }
  },

  // 加载收藏列表
  loadFavorites() {
    const favorites = wx.getStorageSync('emojiFavorites') || [];
    this.setData({ favoriteList: favorites });
  },

  // 切换标签页
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ 
      activeTab: tab
    });
    
    // 如果需要，可以在这里重新加载数据
    if (tab === 'history') {
      this.loadHistory();
    } else {
      this.loadFavorites();
    }
  },

  // 预览图片
  previewImage(e) {
    const { imageUrl } = e.currentTarget.dataset;
    wx.previewImage({
      urls: [imageUrl],
      current: imageUrl,
      showmenu: true
    });
  },

  // 切换收藏状态
  toggleFavorite(e) {
    const { record } = e.currentTarget.dataset;
    const favorites = wx.getStorageSync('emojiFavorites') || [];
    
    // 根据id查找是否已收藏
    const index = favorites.findIndex(item => item.id === record.id);
    
    if (index > -1) {
      // 已收藏，执行取消收藏
      wx.showModal({
        title: '提示',
        content: '确定要取消收藏吗？',
        confirmText: '取消收藏',
        confirmColor: '#ff4d4f',
        success: (res) => {
          if (res.confirm) {
            // 从收藏列表中移除
            favorites.splice(index, 1);
            wx.setStorageSync('emojiFavorites', favorites);
            
            // 更新页面数据
            this.setData({
              favoriteList: favorites
            });
            
            // 如果在历史记录页面，需要更新历史记录列表的收藏状态
            if (this.data.activeTab === 'history') {
              this.loadHistory();
            }
            
            wx.showToast({
              title: '已取消收藏',
              icon: 'success'
            });
          }
        }
      });
    } else {
      // 未收藏，执行收藏操作
      const newFavorite = {
        ...record,
        favoriteTime: new Date().toLocaleString()
      };
      
      favorites.unshift(newFavorite);
      wx.setStorageSync('emojiFavorites', favorites);
      
      // 更新页面数据
      this.setData({
        favoriteList: favorites
      });
      
      // 如果在历史记录页面，需要更新历史记录列表的收藏状态
      if (this.data.activeTab === 'history') {
        this.loadHistory();
      }
      
      wx.showToast({
        title: '已加入收藏',
        icon: 'success'
      });
    }
  },

  // 删除历史记录
  deleteHistory(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          const history = this.data.historyList.filter(item => item.id !== id);
          wx.setStorageSync('emojiHistory', history);
          this.setData({ historyList: history });
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 应用到主页
  applyToMain(e) {
    const { record } = e.currentTarget.dataset;
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; // 获取上一个页面
    
    prevPage.setData({
      mainText: record.mainText || '',
      captionText: record.captionText || '',
      emojiUrl: record.imageUrl || '',
      selectedStyle: record.style || 'cartoon',
      isFlipping: true
    });

    setTimeout(() => {
      prevPage.setData({ isFlipping: false });
    }, 1000);

    wx.navigateBack();
    
    wx.showToast({
      title: '应用成功',
      icon: 'success'
    });
  },

  // 检查是否已收藏
  isFavorited(id) {
    // 从本地存储获取最新的收藏列表
    const favorites = wx.getStorageSync('emojiFavorites') || [];
    // 根据id判断是否已收藏
    return favorites.some(item => item.id === id);
  }
}); 