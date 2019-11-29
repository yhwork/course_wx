

// import regeneratorRuntime from '../../lib/runtime'
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './answer.eea'

const that = this;
// const audioPlay = require("../../lib/audioPlay");
class answer extends EPage {
  get data() {
    return {
      selected: true,
      ismoudle: true,  // 显示 模态框
      mycope:'',       // 
      datas: [
        {
          soft: '判断题',
          type: 'err',
          data: [
            {
              "id": 1,
              "name": "阻力臂是支点到动力作用线的距离。 ",
              "soft": "判断题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "正确",
                "state": "1"
              }, {
                "txt": "错误",
                "state": "0"
              }]
            }, {
              "id": 2,
              "name": "机器语言是能够被计算机直接接受和执行的计算机语言。 ",
              "soft": "判断题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "正确",
                "state": "1"
              }, {
                "txt": "错误",
                "state": "0"
              }]
            }, {
              "id": 3,
              "name": "1是质数。 ",
              "soft": "判断题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "正确",
                "state": "1"
              }, {
                "txt": "错误",
                "state": "0"
              }]
            }, {
              "id": 4,
              "name": "摩擦力分为静摩擦力、滑动摩擦力和滚动摩擦力。 ",
              "soft": "判断题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "正确",
                "state": "1"
              }, {
                "txt": "错误",
                "state": "0"
              }]
            }, {
              "id": 5,
              "name": "电池内部发生了物理反应从而产生电能。 ",
              "soft": "判断题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "正确",
                "state": "1"
              }, {
                "txt": "错误",
                "state": "0"
              }]
            }, {
              "id": 6,
              "name": "控制系统中涉及传感技术、驱动技术、控制理论和控制算法等。 ",
              "soft": "判断题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "正确",
                "state": "1"
              }, {
                "txt": "错误",
                "state": "0"
              }]
            }, {
              "id": 7,
              "name": "传动比是机构中两转动构件线速度的比值,也称速比。 ",
              "soft": "判断题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "正确",
                "state": "1"
              }, {
                "txt": "错误",
                "state": "0"
              }]
            }, {
              "id": 8,
              "name": "电影《机器人总动员》是日本制作的。 ",
              "soft": "判断题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "正确",
                "state": "1"
              }, {
                "txt": "错误",
                "state": "0"
              }]
            }, {
              "id": 9,
              "name": "scratch是图形化编程语言。 ",
              "soft": "判断题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "正确",
                "state": "1"
              }, {
                "txt": "错误",
                "state": "0"
              }]
            }, {
              "id": 10,
              "name": "旋转电机常用的转速单位：转/分(rpm) ,表示每分钟转数。 ",
              "soft": "判断题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "正确",
                "state": "1"
              }, {
                  "txt": "错误",
                  "state": "0"
                }]
              }
          ]
        },
        {
          soft: '单选题',
          type: 'redio',
          data: [
            {
              "id": 11,
              "name": "下图中（ ）是圆柱齿轮。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "A",
                "state": "a"
              }, {
                "txt": "B",
                "state": "b"
              }, {
                "txt": "C",
                "state": "c"
              }]
            }, {
              "id": 12,
              "name": "（ ）是杠杠绕着转动的固定点。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "支点",
                "state": "a"
              }, {
                "txt": "动力臂",
                "state": "b"
              }, {
                "txt": "阻力臂",
                "state": "c"
              }]
            }, {
              "id": 13,
              "name": "杠杆是在力的作用下,能绕某一（ ）转动的硬棒。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "固定点",
                "state": "a"
              }, {
                "txt": "移动点",
                "state": "b"
              }, {
                "txt": "随机点",
                "state": "c"
              }]
            }, {
              "id": 14,
              "name": "下图是舵机的拆开图,其中白色的塑料部分是？ ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "齿轮组",
                "state": "a"
              }, {
                "txt": "电机",
                "state": "b"
              }, {
                "txt": "电位器",
                "state": "c"
              }]
            }, {
              "id": 15,
              "name": "如图,三角形ABC的面积（ ）三角形BCD的面积。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "大于",
                "state": "a"
              }, {
                "txt": "小于",
                "state": "b"
              }, {
                "txt": "等于",
                "state": "c"
              }]
            }, {
              "id": 16,
              "name": "图中A物体长度是（ ）cm。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "2.25",
                "state": "a"
              }, {
                "txt": "22.5",
                "state": "b"
              }, {
                "txt": "2.2",
                "state": "c"
              }, {
                "txt": "22",
                "state": "d"
              }]
            }, {
              "id": 17,
              "name": "一个长方形的长是30米,宽是20米,它的周长是（ ）米。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "50",
                "state": "a"
              }, {
                "txt": "100",
                "state": "b"
              }, {
                "txt": "150",
                "state": "c"
              }, {
                "txt": "200",
                "state": "d"
              }]
            }, {
              "id": 18,
              "name": "1平方米=（ ）平方厘米。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "10",
                "state": "a"
              }, {
                "txt": "100",
                "state": "b"
              }, {
                "txt": "1000",
                "state": "c"
              }, {
                "txt": "10000 ",
                "state": "d"
              }]
            }, {
              "id": 19,
              "name": "计算机通过（ ）来处理数据。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "二进制",
                "state": "a"
              }, {
                "txt": "八进制",
                "state": "b"
              }, {
                "txt": "十进制",
                "state": "c"
              }, {
                "txt": "十六进制",
                "state": "d"
              }]
            }, {
              "id": 20,
              "name": "质数除了（ ）和它本身以外不再有别的因数。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "0",
                "state": "a"
              }, {
                "txt": "1",
                "state": "b"
              }, {
                "txt": "2",
                "state": "c"
              }, {
                "txt": "3",
                "state": "d"
              }]
            }, {
              "id": 21,
              "name": "（ ）是52的因数。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "5",
                "state": "a"
              }, {
                "txt": "6",
                "state": "b"
              }, {
                "txt": "13",
                "state": "c"
              }, {
                "txt": "14",
                "state": "d"
              }]
            }, {
              "id": 22,
              "name": "LED是半导体二极管的一种,可以把( )转化成光能。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "热能",
                "state": "a"
              }, {
                "txt": "化学能",
                "state": "b"
              }, {
                "txt": "动能",
                "state": "c"
              }, {
                "txt": "电能",
                "state": "d"
              }]
            }, {
              "id": 23,
              "name": "键盘属于计算机的（ ） ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "输入设备",
                "state": "a"
              }, {
                "txt": "输出设备",
                "state": "b"
              }, {
                "txt": "控制器",
                "state": "c"
              }, {
                "txt": "处理器",
                "state": "d"
              }]
            }, {
              "id": 24,
              "name": "十进制数2转换为二进制数是（ ） ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "001",
                "state": "a"
              }, {
                "txt": "010",
                "state": "b"
              }, {
                "txt": "011",
                "state": "c"
              }, {
                "txt": "110",
                "state": "d"
              }]
            }, {
              "id": 25,
              "name": "精度与误差之间说法正确的是？ ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "误差小精度低",
                "state": "a"
              }, {
                "txt": "误差大精度高",
                "state": "b"
              }, {
                "txt": "误差大精度低",
                "state": "c"
              }, {
                "txt": "精度与误差无关",
                "state": "d"
              }]
            }, {
              "id": 26,
              "name": "其他条件不变的情况下,以下哪个是增大摩擦力的措施？ ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "接触面加入润滑油 ",
                "state": "a"
              }, {
                "txt": "减小正压力",
                "state": "b"
              }, {
                "txt": "使接触面更光滑",
                "state": "c"
              }, {
                "txt": "增大物体的质量",
                "state": "d"
              }]
            }, {
              "id": 27,
              "name": "一个三角形的高扩大2倍,要使它的面积不变,底应该（ ） ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "扩大4倍",
                "state": "a"
              }, {
                "txt": "缩小2倍",
                "state": "b"
              }, {
                "txt": "扩大2倍",
                "state": "c"
              }, {
                "txt": "缩小4倍",
                "state": "d"
              }]
            }, {
              "id": 28,
              "name": "人工智能（AI）是指？ ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "人类所具有的智力和行为能力",
                "state": "a"
              }, {
                "txt": "由人类制造出来的机器",
                "state": "b"
              }, {
                "txt": "用人工的方法和技术，模仿、延伸和扩展人的智能",
                "state": "c"
              }, {
                "txt": "人的感知能力、思维能力和行为能力",
                "state": "d"
              }]
            }, {
              "id": 29,
              "name": "下列数字中是质数的是？ ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "1",
                "state": "a"
              }, {
                "txt": "3",
                "state": "b"
              }, {
                "txt": "4",
                "state": "c"
              }, {
                "txt": "6",
                "state": "d"
              }]
            }, {
              "id": 30,
              "name": " 在计算机内部,信息的存储和处理都采用二进制,最主要的原因是？ ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "便于存储",
                "state": "a"
              }, {
                "txt": "数据输入方便",
                "state": "b"
              }, {
                "txt": "可以增大计算机存储容量",
                "state": "c"
              }, {
                "txt": "易于用电子元件实现",
                "state": "d"
              }]
            }, {
              "id": 31,
              "name": "LED是半导体二极管的一种,可以把电能转化成（ ） ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "光能",
                "state": "a"
              }, {
                "txt": "热能",
                "state": "b"
              }, {
                "txt": "化学能",
                "state": "c"
              }, {
                "txt": "动能",
                "state": "d"
              }]
            }, {
              "id": 32,
              "name": "摩擦力的方向与物体相对运动（或相对运动趋势）的方向（ ） ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "相同",
                "state": "a"
              }, {
                "txt": "相反",
                "state": "b"
              }, {
                "txt": "垂直",
                "state": "c"
              }, {
                "txt": "无法判断",
                "state": "d"
              }]
            }, {
              "id": 33,
              "name": "一个三角形的面积是4.8平方米,与它等底等高的平行四边形的面积是（ ）平方米。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "2.4",
                "state": "a"
              }, {
                "txt": "3.6",
                "state": "b"
              }, {
                "txt": "4.8",
                "state": "c"
              }, {
                "txt": "9.6",
                "state": "d"
              }]
            }, {
              "id": 34,
              "name": "鼠标属于计算机的（ ） ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "输入设备",
                "state": "a"
              }, {
                "txt": "输出设备",
                "state": "b"
              }, {
                "txt": "控制器",
                "state": "c"
              }, {
                "txt": "处理器",
                "state": "d"
              }]
            }, {
              "id": 35,
              "name": "机器视觉是指用计算机实现（ ）的视觉功能。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "人类",
                "state": "a"
              }, {
                "txt": "机器",
                "state": "b"
              }, {
                "txt": "扫描仪",
                "state": "c"
              }, {
                "txt": "摄像头",
                "state": "d"
              }]
            }, {
              "id": 36,
              "name": "传感器是感知各种化学和物理的非电量并按照一定规律,将其转换成（ ）输出的装置或者器件。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "电信号",
                "state": "a"
              }, {
                "txt": "光信号",
                "state": "b"
              }, {
                "txt": "声信号",
                "state": "c"
              }, {
                "txt": "数字信号",
                "state": "d"
              }]
            }, {
              "id": 37,
              "name": "拉弯了的弓、卷紧了的发条、拉长或压缩了的弹簧都具有（ ） ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "弹性势能",
                "state": "a"
              }, {
                "txt": "重力势能",
                "state": "b"
              }, {
                "txt": "动能",
                "state": "c"
              }, {
                "txt": "重力",
                "state": "d"
              }]
            }, {
              "id": 38,
              "name": "舵机由（ ）、齿轮组、电位器和电路板组成。 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "天线",
                "state": "a"
              }, {
                "txt": "电机",
                "state": "b"
              }, {
                "txt": "连杆",
                "state": "c"
              }, {
                "txt": "芯片",
                "state": "d"
              }]
            }, {
              "id": 39,
              "name": "马车4小时行驶了40千米,那么马车行驶速度是？ ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "40千米/时",
                "state": "a"
              }, {
                "txt": "10千米/时",
                "state": "b"
              }, {
                "txt": "400千米/时",
                "state": "c"
              }, {
                "txt": "200千米/时",
                "state": "d"
              }]
            }, {
              "id": 40,
              "name": "精度与误差之间说法正确的是？ ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "误差小精度高",
                "state": "a"
              }, {
                "txt": "误差大精度高",
                "state": "b"
              }, {
                "txt": "误差小精度低",
                "state": "c"
              }, {
                "txt": "精度与误差无关",
                "state": "d"
              }]
            }, {
              "id": 41,
              "name": "在汽车车架和车轮之间装有弹簧,利用弹簧的弹性来减缓车辆的颠簸,这是弹簧的（ ）功能 ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "复位",
                "state": "a"
              }, {
                "txt": "测量",
                "state": "b"
              }, {
                "txt": "缓冲",
                "state": "c"
              }, {
                "txt": "振动发声",
                "state": "d"
              }]
            }, {
              "id": 42,
              "name": "以下哪个是增大摩擦力的措施？ ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "使接触面更加粗糙 ",
                "state": "a"
              }, {
                "txt": "减小正压力",
                "state": "b"
              }, {
                "txt": "使接触面更光滑",
                "state": "c"
              }, {
                "txt": "减小接触面积",
                "state": "d"
              }]
            }, {
              "id": 43,
              "name": "是什么原因让我们能够在地面上行走？ ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "因为我们穿了鞋。",
                "state": "a"
              }, {
                "txt": "因为我们与地面接触面存在摩擦力。",
                "state": "b"
              }, {
                "txt": "因为陆地不会动。",
                "state": "c"
              }, {
                "txt": "因为这是我们天生就有的能力",
                "state": "d"
              }]
            }, {
              "id": 44,
              "name": "下列哪个部件相当于机器人的大脑（ ） ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "微电脑",
                "state": "a"
              }, {
                "txt": "左右电机",
                "state": "b"
              }, {
                "txt": "导向轮",
                "state": "c"
              }, {
                "txt": "传感器部分",
                "state": "d"
              }]
            }, {
              "id": 45,
              "name": "一个三角形的高缩小3倍,要使它的面积不变,底应该（ ） ",
              "soft": "单选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "不变",
                "state": "a"
              }, {
                  "txt": "缩小3倍",
                  "state": "b"
                }, {
                  "txt": "扩大3倍",
                  "state": "c"
                }, {
                  "txt": "缩小1.5倍",
                  "state": "d"
                }]
              }
          ]
        },
        {
          soft: '多选题',
          type: 'checkbox',
          data: [
            {
              "id": 46,
              "name": "下面属于计算机输出设备的有( ) ",
              "soft": "多选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "鼠标",
                "state": "a"
              }, {
                "txt": "键盘",
                "state": "b"
              }, {
                "txt": "显示器 ",
                "state": "c"
              }, {
                "txt": "打印机",
                "state": "d"
              }]
            }, {
              "id": 47,
              "name": "以下那些为费力杠杆（ ）。 ",
              "soft": "多选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "开瓶器",
                "state": "a"
              }, {
                "txt": "扳手",
                "state": "b"
              }, {
                "txt": "筷子",
                "state": "c"
              }, {
                "txt": "钓鱼竿",
                "state": "d"
              }]
            }, {
              "id": 48,
              "name": "平板电脑可以通过（ ）输入信息。 ",
              "soft": "多选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "手写识别",
                "state": "a"
              }, {
                "txt": "屏幕软键盘",
                "state": "b"
              }, {
                "txt": "蓝牙耳机",
                "state": "c"
              }, {
                "txt": "语音识别",
                "state": "d"
              }]
            }, {
              "id": 49,
              "name": "人工智能是计算机科学的一个分支,它企图了解智能的实质,并生产出一种新的能以人类智能相似的方式做出反应的智能机器,该领域的研究包括机器人、（）等 ",
              "soft": "多选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "语言识别",
                "state": "a"
              }, {
                "txt": "图像识别",
                "state": "b"
              }, {
                "txt": "自然语言处理",
                "state": "c"
              }, {
                "txt": "专家系统\n\t\t\t\t\t",
                "state": "d"
              }]
            }, {
              "id": 50,
              "name": "按工作电源分类,电机一般有哪几类？（） ",
              "soft": "多选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "直流电机",
                "state": "a"
              }, {
                "txt": "交流电机",
                "state": "b"
              }, {
                "txt": "伺服电机",
                "state": "c"
              }, {
                "txt": "同步电机",
                "state": "d"
              }]
            }, {
              "id": 51,
              "name": "以下哪一个不是人脸识别的应用领域（ ） ",
              "soft": "多选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "人脸验证驾照",
                "state": "a"
              }, {
                "txt": "嫌疑犯识别",
                "state": "b"
              }, {
                "txt": "智能卡门禁",
                "state": "c"
              }, {
                "txt": "车辆无钥匙进入",
                "state": "d"
              }]
            }, {
              "id": 52,
              "name": "下面属于计算机输入设备的有 ",
              "soft": "多选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "鼠标",
                "state": "a"
              }, {
                "txt": "键盘",
                "state": "b"
              }, {
                "txt": "显示器 ",
                "state": "c"
              }, {
                "txt": "打印机",
                "state": "d"
              }]
            }, {
              "id": 53,
              "name": "摩擦力分为 ",
              "soft": "多选题",
              "scope": "",
              "isright": false,
              "result": [{
                "txt": "静摩擦力",
                "state": "a"
              }, {
                "txt": "动摩擦力",
                "state": "b"
              }, {
                "txt": "滑动摩擦力",
                "state": "c"
              }, {
                "txt": "滚动摩擦力",
                "state": "d"
              }]
            }
          ]
        }
      ],
      answer: [
        {
          type: 'err',
          soft: '判断题',
          name: '阻力臂是支点到动力作用线的距离。',     // 题的名字
          id: 1,                                    // 每道题的id
          result: [{ state: 1, txt: '正确' }, { state: 0, txt: '错误' }], // 选择的答案
          scope: '',                              // 分值
        },
        {
          type: 'err',
          soft: '',
          name: '阻力臂是支点到动力作用线的距离。',
          id: 2,                                    // 每道题的id
          result: [{ state: 1, txt: '正确' }, { state: 0, txt: '错误' }], // 选择的答案
          scope: '',                                 // 分值
        },
        {
          type: 'err',
          soft: '',
          name: '阻力臂是支点到动力作用线的距离。',
          id: 3,                                    // 每道题的id
          result: [{ state: 1, txt: '正确' }, { state: 0, txt: '错误' }], // 选择的答案
          scope: '',                                 // 分值
        },
        {
          type: 'redio',
          soft: '单选题',
          name: '，杠杆是在力的作用下，能绕某一（ ）转动的硬棒。',
          id: 4,                                    // 每道题的id
          result: [{ state: 'a', txt: '固定点' }, { state: 'b', txt: '移动点' }, { state: 'c', txt: '随机点' }], // 选择的答案
          scope: '',                                 // 分值
        },
        {
          type: 'redio',
          soft: '',
          name: '，杠杆是在力的作用下，能绕某一（ ）转动的硬棒。',
          id: 5,                                    // 每道题的id
          result: [{ state: 'a', txt: '固定点' }, { state: 'b', txt: '移动点' }, { state: 'c', txt: '随机点' }], // 选择的答案
          scope: '',                                 // 分值
        },
        {
          type: 'redio',
          soft: '',
          name: '，杠杆是在力的作用下，能绕某一（ ）转动的硬棒。',
          id: 6,                                    // 每道题的id
          result: [{ state: 'a', txt: '固定点' }, { state: 'b', txt: '移动点' }, { state: 'c', txt: '移动点' }, { state: 'd', txt: '随机点' }], // 选择的答案
          scope: '',  // 分值
        },
        {
          type: 'checkbox',
          soft: '多选题',
          name: '以下那些为费力杠杆（ ）',
          id: 7,                                    // 每道题的id
          result: [{ state: 'a', txt: '开瓶器' }, { state: 'b', txt: '扳手' }, { state: 'c', txt: '筷子' }, { state: 'd', txt: '钓鱼竿' }],
          scope: '',                                 // 分值
        },
        {
          type: 'checkbox',
          soft: '',
          name: '以下那些为费力杠杆（ ）',
          id: 8,                                    // 每道题的id
          result: [{ state: 'a', txt: '开瓶器' }, { state: 'b', txt: '扳手' }, { state: 'c', txt: '筷子' }, { state: 'd', txt: '钓鱼竿' }],
          scope: '',                                 // 分值
        },
        {
          type: 'checkbox',
          soft: '',
          name: '以下那些为费力杠杆（ ）',
          id: 9,                              // 每道题的id
          result: [{ state: 'a', txt: '开瓶器' }, { state: 'b', txt: '扳手' }, { state: 'c', txt: '筷子' }, { state: 'd', txt: '钓鱼竿' }],
          scope: '',                                 // 分值
        },
        {
          type: 'checkbox',
          soft: '',
          name: '以下那些为费力杠杆（ ）',
          id: 10,                              // 每道题的id
          result: [{ state: 'a', txt: '开瓶器' }, { state: 'b', txt: '扳手' }, { state: 'c', txt: '筷子' }, { state: 'd', txt: '钓鱼竿' }],
          scope: '',                                 // 分值
        },
        {
          type: 'checkbox',
          soft: '',
          name: '以下那些为费力杠杆（ ）',
          id: 11,                              // 每道题的id
          result: [{ state: 'a', txt: '开瓶器' }, { state: 'b', txt: '扳手' }, { state: 'c', txt: '筷子' }, { state: 'd', txt: '钓鱼竿' }],
          scope: '',                                 // 分值
        },

      ],
      checklist: [
        {
          "type": "err",
          "id": 1,
          "scope": "0",
          "user_scope": "",
          "isright": false
        }, {
          "type": "err",
          "id": 2,
          "scope": "1",
          "user_scope": "",
          "isright": false
        }, {
          "type": "err",
          "id": 3,
          "scope": "0",
          "user_scope": "",
          "isright": false
        }, {
          "type": "err",
          "id": 4,
          "scope": "1",
          "user_scope": "",
          "isright": false
        }, {
          "type": "err",
          "id": 5,
          "scope": "0",
          "user_scope": "",
          "isright": false
        }, {
          "type": "err",
          "id": 6,
          "scope": "1",
          "user_scope": "",
          "isright": false
        }, {
          "type": "err",
          "id": 7,
          "scope": "1",
          "user_scope": "",
          "isright": false
        }, {
          "type": "err",
          "id": 8,
          "scope": "0",
          "user_scope": "",
          "isright": false
        }, {
          "type": "err",
          "id": 9,
          "scope": "1",
          "user_scope": "",
          "isright": false
        }, {
          "type": "err",
          "id": 10,
          "scope": "1",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 11,
          "scope": "b",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 12,
          "scope": "a",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 13,
          "scope": "a",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 14,
          "scope": "a",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 15,
          "scope": "c",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 16,
          "scope": "a",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 17,
          "scope": "b",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 18,
          "scope": "d",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 19,
          "scope": "a",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 20,
          "scope": "b",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 21,
          "scope": "c",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 22,
          "scope": "d",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 23,
          "scope": "a",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 24,
          "scope": "b",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 25,
          "scope": "c",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 26,
          "scope": "d",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 27,
          "scope": "b",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 28,
          "scope": "c",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 29,
          "scope": "b",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 30,
          "scope": "d",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 31,
          "scope": "a",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 32,
          "scope": "b",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 33,
          "scope": "d",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 34,
          "scope": "a",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 35,
          "scope": "a",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 36,
          "scope": "a",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 37,
          "scope": "a",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 38,
          "scope": "b",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 39,
          "scope": "b",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 40,
          "scope": "a",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 41,
          "scope": "c",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 42,
          "scope": "a",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 43,
          "scope": "b",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 44,
          "scope": "a",
          "user_scope": "",
          "isright": false
        }, {
          "type": "redio",
          "id": 45,
          "scope": "c",
          "user_scope": "",
          "isright": false
        }, {
          "type": "checkbox",
          "id": 46,
          "scope": "cd",
          "user_scope": "",
          "isright": false
        }, {
          "type": "checkbox",
          "id": 47,
          "scope": "cd",
          "user_scope": "",
          "isright": false
        }, {
          "type": "checkbox",
          "id": 48,
          "scope": "abcd",
          "user_scope": "",
          "isright": false
        }, {
          "type": "checkbox",
          "id": 49,
          "scope": "abcd",
          "user_scope": "",
          "isright": false
        }, {
          "type": "checkbox",
          "id": 50,
          "scope": "ab",
          "user_scope": "",
          "isright": false
        }, {
          "type": "checkbox",
          "id": 51,
          "scope": "c",
          "user_scope": "",
          "isright": false
        }, {
          "type": "checkbox",
          "id": 52,
          "scope": "ab",
          "user_scope": "",
          "isright": false
        }, {
          "type": "checkbox",
          "id": 53,
          "scope": "acd",
          "user_scope": "",
          "isright": false
        }
      ]
    };
  }


  mapPageEvent({
    put,
    dispatch
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        // dispatch(actions.INIT, this.data.datas);
        console.log(option)
        this.setData({
          value: option.val
        })
      },
    }
  }
  // 界面ui事件
  mapUIEvent({
    put,
    dispatch
  }) {
    return {
      // 得分
      [events.ui.addnum](){
        dispatch(actions.INIT, this.data.datas);
      },
      // 关闭
      [events.ui.closetime]() {

        // let datas = this.data.datas;
        // for (let i of datas) {
        //   for (let j in i.data) {
        //     if (i.data[j].scope == "" || i.data[j].length == 0) {
        //       wx.showToast({
        //         title: `请答${i.soft}
        //                 第${ parseInt(j) + 1 }题`,
        //         icon: 'none',
        //         image: '',
        //         duration: 1500,
        //       })
        //       return
        //     }
        //   }
        // }

        console.log('消失')
        if (this.data.ismoudle) {
          this.setData({
            ismoudle: false
          })
        } else {
          this.setData({
            ismoudle: true
          })
        }


      },
      // 单选
      [events.ui.radioChange](e) {
        let val = e.detail.value;
        let id = e.currentTarget.dataset.id;
        let checklist = this.data.checklist;
        let datas = this.data.datas;
        console.log('单选对错', id, val)
        if (val.length > 0) {
          let clist = checklist.map((v, i) => {
            if (v.id == id) {
              v.user_scope = val
              if (v.user_scope == v.scope){
                v.isright = true
                wx.showToast({
                  title: '答对了',
                  icon: 'success',
                  duration: 1500,
                  mask: true,
                })
              }else{
                v.isright = false
                wx.showToast({
                  title: '答错了',
                  icon: 'err',
                  duration: 1500,
                  mask: true,
                })
              }
            }
            return v
          })
          for (let i of datas) {
            for (let j of i.data) {
              if (j.id == id) {
                j.scope = val;
                j.isright = true
              }
            }
          }
          this.setData({
            datas,
            checklist: clist
          })
          this.setData({
            checklist: clist
          })
          // console.log(this.data.checklist)
          // dispatch(actions.INIT, this.data.datas);
        }
      },
      // 多选
      [events.ui.checkAll](e) {
        // 添加对应的   答案
        let val = e.detail.value;
        let id = e.currentTarget.dataset.id;
        let checklist = this.data.checklist;
        let datas = JSON.parse(JSON.stringify(this.data.datas));
        console.log('多选对错', id, val)

        if (val.length > 0) {
          let data = val.join('')
          let clist = checklist.map((v, i) => {
            if (v.id == id) {
              v.user_scope = data
                //  以用户选择的答案匹配正确答案
                let datas = v.user_scope.split('');
                if (v.user_scope.length !== v.scope.length) {
                    v.isright = false;
                    wx.showToast({
                      title: '答错了',
                      icon: 'err',
                      duration: 1500,
                      mask: true,
                    })
                } else {
                  datas.forEach((it, i) => {
                    if (v.scope.indexOf(it) < 0) {
                      // 选错了
                      wx.showToast({
                        title: '答错了',
                        icon: 'success',
                        duration: 1500,
                        mask: true,
                      })
                      v.isright = false
                      return
                    } else {
                      wx.showToast({
                        title: '答对了',
                        icon: 'success',
                        duration: 1500,
                        mask: true,
                      })
                      // 选对了 加分
                      v.isright = true
                    }
                  })
                }
            }
            return v
          })

          for (let i of datas) {
            for (let j of i.data) {
              if (j.id == id) {
                j.scope = data
              }
            }
          }
          this.setData({
            datas: datas,
            checklist: clist
          })
        } else {
          let data = val.join('')
          let clist = checklist.map((v, i) => {
            if (v.id == id) {
              v.user_scope = data
            }
            return v
          })
          for (let i of datas) {
            for (let j of i.data) {
              if (j.id == id) {
                j.scope = ''
              }
            }
          }
          this.setData({
            datas,
            checklist: clist
          })
        }
        
      }
    }
  }
  // 请求
  mapEffect() {
    return {
      // 发送请求
      async [effects.GETALL_CHILD_LIST]() {
        this.$api.child.getChildListByCondition({}).then(res => {
          this.setData({
            childList: res.data.result.childList,
            theindex: res.data.result.childList.length
          })
          // console.log(res.data.result.childList)
        })
      },
      // 同意请求
      [effects.ADREE_OK](data) {
        // 发送请求
        console.log('请求', data)
        wx.showToast({
          title: '授权成功',
          icon: 'node',
          duration: 1500,
        })
        this.$api.circle.getqrcode({}).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            // 1绑定 0未绑
            console.log(res)
          } else {

          }
        });
      },
    }
  }
  mapAction({
    publish,
    put,
    dispatch
  }) {
    return {
      // 改变日期
      [actions.INIT](data) {
        // 初始化  结果集
        let result = this.data.checklist;
        if (data.length > 0) {
          let arrs = [];
          let nums = 0;
          let arr = JSON.parse(JSON.stringify(result))
          let isOK = arr.map((v, i) => {
            if (v.type === 'err' && v.isright == true){
                  nums +=1

            } else if (v.type === 'checkbox' && v.isright == true){
              nums += 2.5
               
            } else if (v.type === 'redio' && v.isright == true){
              nums += 2
            }
            
            return v
          })
          console.log(nums, '结果')
          this.setData({
            mycope: nums
          })
        }
      },
      // 初始化数据
      [actions.changeinit](data) {
        let arr = JSON.parse(JSON.stringify(data))
        arr.map((v, i) => {
          let obj = {

          }
        })
      },
      [actions.coumper](data) {
        // 计算分数
      }
    }
  }
}

EApp.instance.register({
  type: answer,
  id: 'answer',
  config: {
    events,
    effects,
    actions
  }
});