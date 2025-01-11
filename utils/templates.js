// 表情包模板数据
const emojiTemplates = [
  // 工作场景模板
  { 
    main: '一只穿着职业装、对着电脑屏幕、双眼通红、头发凌乱、桌上堆满咖啡杯的小熊猫，表情疲惫不堪，眼神涣散，嘴里嘟囔着"我还能干"', 
    caption: '加班人生' 
  },
  { 
    main: '一只穿着格子衬衫、戴着黑框眼镜、抱着厚厚的文件夹、被各种任务追着跑、头上冒着汗、表情慌乱的小兔子，身后还飘着各种任务便利贴', 
    caption: '忙到飞起' 
  },
  { 
    main: '一只穿着西装、打着领带、坐在会议室角落、假装认真记笔记实则画着圈圈、眼神放空、嘴角微微上扬的小狐狸，桌上放着保温杯和平板', 
    caption: '假装认真' 
  },

  // 春节主题模板
  { 
    main: '一只身穿大红色绣金龙唐装、头戴福字帽、手捧金元宝、脸上洋溢着幸福笑容的小兔子，身边飘着红包雨，背景是烟花绽放的夜空', 
    caption: '恭喜发财' 
  },
  { 
    main: '一只穿着中国结盘扣旗袍、系着红色蝴蝶结、手持金元宝、笑容甜美、眼睛眯成月牙的胖胖招财猫，周围环绕着闪闪发光的铜钱', 
    caption: '招财进宝' 
  },
  { 
    main: '一只身着喜庆唐装、手捧一大盘热气腾腾的饺子、眼睛放光、口水直流、尾巴欢快摇摆的小狗，厨房里还飘着各种年味小吃的香气', 
    caption: '真香' 
  },
  { 
    main: '一只穿着红色马甲、戴着中国结发饰、正在专心贴春联、舌头微微吐出、一脸认真的小熊猫，身边放着墨汁和毛笔，周围已经贴满了"福"字', 
    caption: '春节快乐' 
  },
  { 
    main: '一只身穿喜庆棉袄、手提大红灯笼、蹦蹦跳跳、满脸喜气的小羊，背景是张灯结彩的街道，周围飘着红色的灯笼和中国结', 
    caption: '喜气洋洋' 
  },
  { 
    main: '一只穿着厨师服、系着红围裙、忙着炒菜煮饭、额头冒汗、却笑容满面的小猫，厨房里飘着年夜饭的香气，灶台上摆满了团圆饭菜', 
    caption: '新年快乐' 
  },
  { 
    main: '一只戴着福字头巾、手拿鞭炮、兴奋地又蹦又跳、眼睛闪闪发亮的小老鼠，身边是噼里啪啦的鞭炮声，背景是红红火火的新年装饰', 
    caption: '新春大吉' 
  },
  { 
    main: '一只穿着红色棉袄、抱着一大堆金橘、脸上洋溢着财运来的喜悦、眉飞色舞的小仓鼠，屋子里堆满了各种年货，墙上贴着"财运亨通"', 
    caption: '' 
  },
  { 
    main: '一只身着喜庆唐装、手捧一叠红包、眼冒金光、笑得合不拢嘴的小狐狸，背景是烫金的福字和红色窗花，周围飘着铜钱和福字', 
    caption: '新春吉祥' 
  },
  { 
    main: '一只戴着新年帽、捧着一碗热腾腾的汤圆、幸福地眯着眼、嘴角沾着芝麻馅的小熊，桌上摆满了元宵节的各色小吃', 
    caption: '快快乐乐' 
  },

  // 工作场景模板
  {
    main: '一只对着电脑屏幕疯狂敲代码、头顶冒烟、眼镜起雾、桌上散落着各种bug截图和报错日志的程序猿熊猫，身边堆满了外卖盒子和咖啡杯',
    caption: '即将崩溃'
  },
  {
    main: '一只穿着正装、抱着厚厚的PPT文件、对着镜子练习演讲、表情夸张、手势激动的小狮子，白板上写满了"加油"和"必胜"',
    caption: '卷起来！'
  },
  {
    main: '一只戴着降噪耳机、缩在工位角落、假装看不见周围热闹的八卦群、专注敲键盘的小猫，显示器上贴满了"勿扰"的便利贴',
    caption: '专心写代码'
  },
  {
    main: '一只对着工作群消息、表情惊恐、冷汗直流、手忙脚乱删除已发信息的小狗，屏幕上显示着"撤回了一条消息"',
    caption: ''
  },
  {
    main: '一只穿着睡衣、顶着鸡窝头、手忙脚乱打开电脑、惊慌失措看着钉钉未读消息的小兔子，闹钟显示着"上午9:30"',
    caption: '要迟到了'
  },
  {
    main: '一只戴着金丝眼镜、西装革履、对着会议室里昏昏欲睡的同事们慷慨陈词的小孔雀，投影幕布上全是密密麻麻的数据图表',
    caption: '会议演讲'
  },
  {
    main: '一只抱着厚厚的周报文件、对着老板点头哈腰、满头大汗、尾巴紧张地摇摆的小狐狸，办公室里弥漫着紧张的气氛',
    caption: '周报汇报'
  },
  {
    main: '一只对着工作电脑屏幕、表情呆滞、双手无力、眼神死寂的小浣熊，显示器上飘着"系统正在重启"的提示',
    caption: '文件没存'
  },
  {
    main: '一只被各种文件和报表压得喘不过气、只露出一个小脑袋、眼冒金星的小仓鼠，办公桌上堆满了待处理的文件山',
    caption: '压力山大'
  },
  {
    main: '一只对着工作群消息疯狂点赞、表情谄媚、眼神讨好的小狗，手机屏幕上显示"老板发来一条消息"',
    caption: '点赞狂魔'
  },

  // 新年主题模板
  {
    main: '一只穿着喜庆棉袄、戴着大红花、手捧一大堆压岁钱、笑得见牙不见眼的小兔子，背景是烟花绽放的新年夜空',
    caption: '快乐'
  },
  {
    main: '一只身穿厨师服、系着红围裙、忙着包饺子、面粉沾满全身的小熊猫，厨房里飘着香喷喷的饺子香',
    caption: '真香'
  },
  {
    main: '一只穿着中式马褂、手持春联、认真写字、舌头微微吐出的文艺小猫，书桌上摆满了毛笔和红纸',
    caption: ''
  },
  {
    main: '一只戴着红色围巾、举着烟花棒、蹦蹦跳跳、眼里闪着星星的小狐狸，周围是绚丽的烟火',
    caption: '看烟花喽'
  },
  {
    main: '一只穿着喜庆唐装、手拿如意、站在门口迎接客人、笑容满面的小熊，门上贴着大大的"福"字',
    caption: '春节快乐'
  },

  // 工作场景模板
  {
    main: '一只对着笔记本疯狂记录、头上顶着十几个便利贴、眼神慌乱的小考拉，会议桌上摆满了各种文件和咖啡杯',
    caption: ''
  },
  {
    main: '一只穿着格子衬衫、被各种报表包围、对着计算器猛按、头发竖起的小松鼠，桌上还放着厚厚的财务报表',
    caption: '报表还没搞'
  },
  {
    main: '一只戴着蓝牙耳机、表情严肃、对着电脑屏幕连开三个视频会议的小狸花猫，显示器上挤满了会议窗口',
    caption: '又要开会，，'
  },
  {
    main: '一只穿着休闲西装、对着手机疯狂回复工作消息、走路都不看路的小狗，周围都是红色感叹号的提醒',
    caption: '消息爆炸'
  },
  {
    main: '一只戴着眼镜、对着电脑屏幕发呆、手中咖啡已经凉掉的小熊，显示器上全是密密麻麻的代码',
    caption: '正在写代码'
  },

  // 新年主题模板
  {
    main: '一只穿着喜庆旗袍、手持蒸笼、忙着蒸年糕、满头大汗的小熊猫，厨房里弥漫着甜甜的年糕香',
    caption: '香喷喷'
  },
  {
    main: '一只戴着红色围巾、举着大红灯笼、在雪地里蹦蹦跳跳的小兔子，背景是张灯结彩的年味街道',
    caption: '过年啦！'
  },
  {
    main: '一只穿着唐装、手捧一大盘橘子、笑眯眯分发给大家的小狐狸，周围都是欢声笑语',
    caption: '唠嗑'
  },
  {
    main: '一只系着红围裙、专注擀饺子皮、案板上撒满面粉的小猫，旁边放着各种饺子馅料',
    caption: '饿了'
  },
  {
    main: '一只戴着福字帽、手拿鞭炮、兴奋地直跳脚的小老鼠，身边是噼里啪啦的鞭炮声',
    caption: '噼里啪啦'
  },

  // 工作场景模板
  {
    main: '一只穿着职业装、对着镜子练习微笑、表情僵硬、额头冒汗的小狐狸，桌上放着"面试技巧"的书',
    caption: '紧张~'
  },
  {
    main: '一只戴着耳机、对着麦克风讲解、手舞足蹈比划的小熊猫，屏幕上显示着线上培训的界面',
    caption: ''
  },
  {
    main: '一只穿着休闲装、躲在工位后偷偷打游戏、时不时紧张张望的小仓鼠，键盘上还放着零食',
    caption: '摸鱼'
  },
  {
    main: '一只对着打印机抓狂、满地找碎纸的小狗，打印机显示"卡纸"红灯闪烁',
    caption: '罢工了'
  },
  {
    main: '一只抱着笔记本、在会议室外徘徊、不知道该进哪个会议室的小兔子，手机上显示着三个会议邀请',
    caption: '天天开会'
  },

  // 新年主题模板
  {
    main: '一只穿着喜庆棉袄、举着火锅勺、满脸幸福的小熊，围着一桌热气腾腾的年夜饭火锅',
    caption: ''
  },
  {
    main: '一只戴着红帽子、手捧糖果盒、给大家派发新年糖果的小松鼠，口袋里塞满了各色糖果',
    caption: '新年快乐'
  },
  {
    main: '一只穿着中式服装、手持算盘、正在计算压岁钱的小狐狸，桌上堆满了红包',
    caption: '压岁钱'
  },
  {
    main: '一只系着红领结、举着相机、给全家拍全家福的小猫，背景是新年装饰的客厅',
    caption: '幸福一家人'
  },
  {
    main: '一只穿着唐装、手拿春联、正在给邻居派发春联的小狗，背着一大包写好的春联',
    caption: '春节快乐'
  },

  // 经典表情包模板
  {
    main: '一只戴着金丝眼镜、表情严肃、手指指着前方、摆出说教姿态的小狐狸，身后是写满"不要啊"的黑板',
    caption: '不要啊'
  },
  {
    main: '一只穿着睡衣、头发凌乱、对着镜子露出惊恐表情、双手抱头的小熊猫，镜子里倒映着黑眼圈',
    caption: '我裂开了'
  },
  {
    main: '一只戴着墨镜、叼着棒棒糖、靠在墙边摆出酷酷表情的小狗，爪子比着剪刀手',
    caption: '就这？'
  },
  {
    main: '一只穿着背心、躺在沙发上、举着手机、表情呆滞的小猫，周围散落着零食包装',
    caption: '我太难了'
  },
  {
    main: '一只戴着发箍、对着镜子摆出各种表情、自拍不断的小兔子，手机相册已经存满照片',
    caption: '我可以'
  },
  {
    main: '一只穿着运动服、躺在跑步机上、气喘吁吁、满头大汗的小熊，旁边放着没动过的哑铃',
    caption: '告辞'
  },
  {
    main: '一只戴着眼罩、裹着被子、手机闹钟响个不停的小浣熊，床头摆着七个已被按掉的闹钟',
    caption: '再睡会儿'
  },
  {
    main: '一只穿着格子衬衫、抱着一堆购物袋、表情心虚的小仓鼠，购物袋里露出新买的玩具',
    caption: '我不听我不听'
  },
  {
    main: '一只戴着棒球帽、举着奶茶、用吸管猛吸的小狗，表情陶醉，奶茶已经见底',
    caption: '真快乐'
  },
  {
    main: '一只穿着卫衣、对着手机疯狂点赞、不停傻笑的小猫，屏幕上全是可爱动物视频',
    caption: '我爱了'
  },
  {
    main: '一只戴着耳机、对着空气打拳、沉浸在自己世界的小狐狸，脚下踩着节奏跳舞',
    caption: '我最棒'
  },
  {
    main: '一只穿着睡衣、抱着空空的零食袋、一脸懊悔的小熊猫，周围是零食的包装纸',
    caption: '又要胖了'
  },
  {
    main: '一只戴着美食头饰、对着外卖软件流口水、肚子咕咕叫的小狗，手机上显示"订单已满"',
    caption: '饿了饿了'
  },
  {
    main: '一只穿着围裙、举着锅铲、厨房一片狼藉的小狗，案板上是失败的料理作品',
    caption: '我错了'
  },
  {
    main: '一只穿着睡衣、抱着手机、表情惊恐的小狗，屏幕显示"女朋友最后在线时间：2小时前"',
    caption: '完蛋了'
  },
  {
    main: '一只戴着发带、举着存钱罐、使劲摇晃的小仓鼠，存钱罐里只有几个硬币在响',
    caption: '月底了'
  },
  {
    main: '一只穿着背心、对着空调狂按遥控器、满头大汗的小熊，空调显示屏上闪烁着"检修"',
    caption: '热死了'
  },
  {
    main: '一只戴着围巾、缩在被窝里、瑟瑟发抖的小兔子，暖气片上贴着"维修通知"',
    caption: '冷死了'
  },
  {
    main: '一只穿着睡衣、对着镜子摆拍、却怎么拍都不满意的小猫，地上散落着几十张自拍失败照片',
    caption: '我不管'
  }
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