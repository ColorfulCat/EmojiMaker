// 表情包模板数据
const emojiTemplates = [
  { main: '一只很喜庆的大花猫', caption: '新年快乐' },
  { main: '一只戴着墨镜的柴犬', caption: '我太难了' },
  { main: '一只在下雨天打伞的小企鹅', caption: '今天也要加油呀' },
  { main: '一只抱着咖啡杯的熊猫', caption: '困困困' },
  { main: '一只穿着小西装的兔子', caption: '上班第一天' },
  { main: '一只躺在沙发上的懒猫', caption: '周末万岁' },
  { main: '一只举着小红旗的小狗', caption: '为祖国加油' },
  { main: '一只戴着圣诞帽的小鹿', caption: '圣诞快乐' },
  { main: '一只打着哈欠的小猫咪', caption: '早安啊' },
  { main: '一只抱着月饼的玉兔', caption: '中秋快乐' },
  { main: '一只戴着毕业帽的小狗', caption: '终于毕业啦' },
  { main: '一只举着爱心的小熊', caption: '爱你哦' },
  { main: '一只吃着火锅的熊猫', caption: '太幸福了' },
  { main: '一只看书的猫头鹰', caption: '知识就是力量' },
  { main: '一只打篮球的小猴子', caption: '投篮高手' },
  { main: '一只弹吉他的小狐狸', caption: '音乐时光' },
  { main: '一只跳舞的小企鹅', caption: '快乐舞动' },
  { main: '一只做瑜伽的小兔子', caption: '保持健康' },
  { main: '一只画画的小浣熊', caption: '艺术家' },
  { main: '一只做蛋糕的小熊', caption: '甜蜜时光' },
  { main: '一只玩滑板的小狗', caption: '酷毙了' },
  { main: '一只织毛衣的老奶奶猫', caption: '温暖冬天' },
  { main: '一只修电脑的程序猿', caption: 'Debug中' },
  { main: '一只开飞机的小鸟', caption: '翱翔天际' },
  { main: '一只种花的小刺猬', caption: '春天来了' },
  { main: '一只钓鱼的小熊', caption: '静待时机' },
  { main: '一只写书法的大熊猫', caption: '文化传承' },
  { main: '一只做实验的小白鼠', caption: '科学探索' },
  { main: '一只摄影的小狐狸', caption: '捕捉美好' },
  { main: '一只做手工的小羊', caption: '创意无限' },
  { main: '一只卖冰淇淋的北极熊', caption: '清凉一夏' },
  { main: '一只修理自行车的猴子', caption: '技术达人' },
  { main: '一只做陶艺的小兔子', caption: '匠心独运' },
  { main: '一只指挥交响乐的企鹅', caption: '艺术人生' },
  { main: '一只做寿司的小猫', caption: '美食家' },
  { main: '一只教书的老师猫', caption: '传道授业' },
  { main: '一只跑马拉松的兔子', caption: '永不放弃' },
  { main: '一只做瑜伽的大象', caption: '保持平衡' },
  { main: '一只玩魔方的小猪', caption: '智力挑战' },
  { main: '一只跳芭蕾的天鹅', caption: '优雅至上' },
  { main: '一只做披萨的意大利猫', caption: '美食诱惑' },
  { main: '一只写代码的程序猫', caption: 'Hello World' },
  { main: '一只做园艺的小松鼠', caption: '绿色生活' },
  { main: '一只玩滑雪的北极熊', caption: '冰雪运动' },
  { main: '一只做魔术的兔子', caption: '神奇时刻' },
  { main: '一只调酒的企鹅', caption: '品味生活' },
  { main: '一只做瑜伽的火烈鸟', caption: '优雅生活' },
  { main: '一只打太极的大熊猫', caption: '内外合一' },
  { main: '一只做蛋糕的小熊猫', caption: '甜蜜时光' },
  { main: '一只跳街舞的小狗', caption: '舞动青春' }
];

// 获取随机模板
function getRandomTemplate() {
  const randomIndex = Math.floor(Math.random() * emojiTemplates.length);
  return emojiTemplates[randomIndex];
}

// 使用 module.exports 导出
module.exports = {
  emojiTemplates,
  getRandomTemplate
}; 