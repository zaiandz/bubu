/* ============================================================
 * 【租赁页数据层】js/rental-data.js
 * 结构：8 大类目 → 15 个基础型号 → 每个型号可选套餐（variants）
 * 套餐覆盖首页 js/data.js 中的 25 个型号：
 *   Osmo Pocket 3     ← gimbal-phone / gimbal-one / gimbal-two
 *   Osmo Pocket 4 Pro ← gimbal-pocket4pro-standard / gimbal-pocket4pro-combo
 *   Ace Pro 2         ← action-standard / action-street / action-neck / action-vlog
 *   Insta360 X6       ← insta360-x6-standard / insta360-x6-allround / insta360-x6-travel
 *   佳能 EOS R50      ← mirrorless-entry / mirrorless-plus / mirrorless-pro / mirrorless-one
 *   G7 X Mark III     ← compact-entry / compact-vlog
 *   G12 / IXUS 210 / IXUS 130 / FY-830 / SD 卡 / TF 卡 各自 1 个
 * 参数来源：DJI 官方技术参数页、Insta360 官方产品页、佳能相机博物馆规格页。
 * 产品图：images/products/*.png（由用户提供的白底实拍/官方图统一裁切为 900×900），竖排脚架与存储卡沿用自绘矢量图。
 * ============================================================ */
window.RENTAL_DATA = {
  brand: "视感闪租",
  site: "湖北视感闪租相机租赁",
  updated: "2026-10",
  /* 微信加好友：替换 images/wechat-qr.png 即可换成个人微信二维码（建议 600×600 白底） */
  wechat: {
    name: "视感闪租 · 租赁顾问",
    wechatId: "z310sr",              // 微信号：支持复制 / 点击一键拨号
    phone: "13671963506",            // 手机号
    qr: "images/客服售后二维码.jpg",
    tip: "长按二维码识别，或在微信里扫码添加好友"
  },
  /* 客服信息与首页 HOME_CONFIG.services 保持一致 */
  services: [
    { title: "在线租赁客服", hours: "早 9:20 — 晚 11:30", qr: "images/客服售后二维码.jpg", qrText: "扫码联系租赁客服" },
    { title: "售后客服", hours: "早 9:00 — 晚 11:30", qr: "images/客服售后二维码.jpg", qrText: "扫码联系售后客服" }
  ],
  categories: [
    {
      key: "gimbal",
      title: "手持云台",
      brand: "DJI",
      desc: "三轴机械增稳，一个人也能拍出稳定的 Vlog 和旅拍",
      accent: "#1e4fd8",
      items: [
        {
          id: "pocket-3",
          art: "images/products/pocket-3.png",
          name: "Osmo Pocket 3",
          full: "大疆 Osmo Pocket 3",
          brand: "DJI",
          hot: true,
          tags: ["1 英寸大底", "三轴云台", "Vlog 神器"],
          scene: "日常记录 / 旅行 Vlog / 探店拍摄",
          summary: "2.0 英寸旋转触控屏一拧即开机，1 英寸 CMOS 配三轴云台，边走边拍也稳，是租机首选。",
          highlights: [
            "转屏幕就开机，2 秒进入拍摄状态，没有学习成本",
            "1 英寸 CMOS + 三轴机械云台，抖动抑制 ±0.005°",
            "智能跟随、竖拍模式、延时摄影一应俱全",
            "179 克口袋尺寸，随身带着几乎没负担"
          ],
          specs: [
            ["传感器", "1 英寸 CMOS"],
            ["镜头", "等效 20mm，f/2.0"],
            ["视频", "4K 60fps / 2.7K / 1080p，慢动作 4K 120fps"],
            ["照片", "16:9 3840×2160，约 940 万像素"],
            ["屏幕", "2.0 英寸旋转触控屏，700 尼特"],
            ["防抖", "三轴机械云台 + 电子增稳"],
            ["重量", "约 179 克"],
            ["续航", "约 166 分钟（1080p/24fps）"],
            ["存储", "microSD（最大 1TB），无内置存储"]
          ],
          variants: [
            {
              name: "标准版",
              tag: "入门首选",
              priceHint: "轻装拍摄",
              desc: "相机主机 + 基础配件，适合个人旅拍、日常记录。",
              includes: ["相机主机", "官方保护壳", "收纳包", "128G 内存卡", "手绳", "USB 读卡器"],
              suitable: "一个人旅行、日常 Vlog、探店拍摄"
            },
            {
              name: "长续航版",
              tag: "拍一整天",
              priceHint: "续航加倍",
              desc: "在标准版基础上增加原厂续航手柄，长时间跟拍不用中途充电。",
              includes: ["相机主机", "续航手柄", "官方保护壳", "收纳包", "128G 内存卡", "手绳", "USB 读卡器"],
              suitable: "整日活动跟拍、户外长时间录制"
            },
            {
              name: "全能套装",
              tag: "配件最全",
              priceHint: "专业创作",
              desc: "续航手柄、增广镜、无线麦克风、迷你三脚架一次配齐，收音与超广角都有。",
              includes: ["相机主机", "续航手柄", "增广镜", "DJI Mic 2 发射器与配件", "迷你三脚架", "收纳包", "128G 内存卡"],
              suitable: "商业拍摄、多机位 Vlog、团队外拍"
            }
          ],
          source: "https://www.dji.com/cn/osmo-pocket-3/specs"
        },
        {
          id: "pocket-4-pro",
          art: "images/products/pocket-4-pro.png",
          name: "Osmo Pocket 4 Pro",
          full: "大疆 Osmo Pocket 4 Pro",
          brand: "DJI",
          tags: ["新品", "自带补光灯", "横竖拍"],
          scene: "夜间拍摄 / 人像 Vlog / 直播补光",
          summary: "带官方补光灯的手持云台，暗光下也能把脸拍亮，旋转屏幕即可切换横拍竖拍。",
          highlights: [
            "机身集成补光灯，暗夜自拍和口播不用另带灯",
            "屏幕旋转即切换横拍 / 竖拍，短视频平台直接可用",
            "承袭 Pocket 系列三轴云台与智能跟随，运镜稳",
            "新品机型，画质与算法较上一代进一步优化"
          ],
          specs: [
            ["传感器", "1 英寸级 CMOS（以官方页面为准）"],
            ["镜头", "广角镜头，支持数码变焦"],
            ["视频", "最高 4K 录制（以官方参数页为准）"],
            ["屏幕", "旋转触控屏，支持横竖拍切换"],
            ["防抖", "三轴机械云台"],
            ["补光", "机身内置补光灯，多档亮度可调"],
            ["存储", "microSD 存储卡"],
            ["说明", "具体规格以随机说明书与 DJI 官方页面为准"]
          ],
          variants: [
            {
              name: "标准套装",
              tag: "轻装夜拍",
              priceHint: "补光灯尝鲜",
              desc: "相机主机 + 保护壳 + 基础配件，主打内置补光灯与竖拍。",
              includes: ["相机主机", "官方保护壳", "收纳包", "内存卡", "手绳", "USB 读卡器"],
              suitable: "夜间自拍、人像 Vlog、轻度直播"
            },
            {
              name: "全能套装",
              tag: "配件齐全",
              priceHint: "长时间创作",
              desc: "加配续航手柄、迷你三脚架与收音配件，补光灯配合手柄可长时间拍摄。",
              includes: ["相机主机", "续航手柄", "迷你三脚架", "收音配件", "收纳包", "内存卡"],
              suitable: "团队创作、户外直播、多场景切换"
            }
          ],
          source: "https://www.dji.com/cn/osmo-pocket-3/downloads"
        }
      ]
    },
    {
      key: "action",
      title: "运动相机",
      brand: "Insta360",
      desc: "防水抗摔，第一视角记录滑板、骑行、露营与旅行",
      accent: "#0f766e",
      items: [
        {
          id: "ace-pro-2",
          art: "images/products/ace-pro-2.png",
          name: "Ace Pro 2",
          full: "影石 Insta360 Ace Pro 2",
          brand: "Insta360",
          hot: true,
          tags: ["8K 运动相机", "徕卡镜头", "翻转屏"],
          scene: "骑行 / 滑板 / 街拍 / 第一视角记录",
          summary: "1/1.3 英寸 8K 传感器配徕卡 SUMMARIT 镜头，2.5 英寸翻转触摸屏，自拍和低角度都能看着拍。",
          highlights: [
            "8K 超清运动画质，细节经得起放大与裁切",
            "徕卡联合调校镜头，夜景纯净度同级别突出",
            "2.5 英寸翻转屏，自拍构图、低角度拍摄都方便",
            "防风麦克风结构，户外骑行收音更干净"
          ],
          specs: [
            ["传感器", "1/1.3 英寸 8K 传感器"],
            ["镜头", "徕卡 SUMMARIT 镜头"],
            ["视频", "最高 8K 录制"],
            ["屏幕", "2.5 英寸翻转触摸屏"],
            ["音频", "机内防风麦克风"],
            ["防水", "机身防水（以官方说明为准）"],
            ["存储", "microSD 存储卡"]
          ],
          variants: [
            {
              name: "标准版",
              tag: "全能基础",
              priceHint: "运动记录",
              desc: "标准套餐，适合大多数运动与旅行记录。",
              includes: ["相机主机", "电池", "快拆底座", "麦克风防风罩", "数据线", "收纳包"],
              suitable: "骑行、滑板、露营、旅行"
            },
            {
              name: "街拍套装",
              tag: "竖拍抓拍",
              priceHint: "城市扫街",
              desc: "加装街拍手柄，单手握持更稳，竖拍构图更顺手。",
              includes: ["相机主机", "街拍手柄", "电池", "快拆底座", "数据线", "收纳包"],
              suitable: "城市扫街、潮流穿搭、街头采访"
            },
            {
              name: "挂脖套装",
              tag: "解放双手",
              priceHint: "第一视角",
              desc: "配挂脖支架，相机挂在胸前拍第一视角，双手完全解放。",
              includes: ["相机主机", "挂脖支架", "电池", "快拆底座", "数据线", "收纳包"],
              suitable: "做饭、手工、沉浸式体验记录"
            },
            {
              name: "手持 Vlog 套装",
              tag: "口播旅行",
              priceHint: "边走边讲",
              desc: "加装手持支架，握持更接近传统 Vlog 机，翻转屏实时自检构图。",
              includes: ["相机主机", "手持支架", "电池", "快拆底座", "数据线", "收纳包"],
              suitable: "旅行 Vlog、口播讲解、边走边拍"
            }
          ],
          source: "https://store.insta360.com/cn/product/ace-pro-2"
        }
      ]
    },
    {
      key: "x360",
      title: "全景相机",
      brand: "Insta360",
      desc: "先拍后构图，360° 记录一次不漏，后期随意取景",
      accent: "#7c3aed",
      items: [
        {
          id: "insta360-x6",
          art: "images/products/insta360-x6.png",
          name: "Insta360 X6",
          full: "影石 Insta360 X6",
          brand: "Insta360",
          hot: true,
          tags: ["8K 全景", "1 英寸级", "先拍后构图"],
          scene: "旅行全景 / 运动记录 / 创意运镜",
          summary: "双 1/1.1 英寸方形传感器实现 1 英寸级全景画质，8K50fps 录制，拍完再在 App 里取景。",
          highlights: [
            "8K50fps 全景视频，后期任意角度取景都不掉画质",
            "1 英寸级传感器 + AI 三芯，夜景更纯净",
            "隐形自拍杆，一个人也能拍出无人机跟拍视角",
            "2600mAh 电池，8K 连续录制约 140 分钟"
          ],
          specs: [
            ["传感器", "双 1/1.1 英寸方形传感器（1 英寸级）"],
            ["视频", "8K 50fps 全景；5K60fps / 4K120fps 平面"],
            ["照片", "1.2 亿像素全景照片"],
            ["屏幕", "2.32 英寸 OLED 全面屏，1200 尼特"],
            ["电池", "2600mAh，8K30fps 约 140 分钟"],
            ["防水", "IP68 裸机防水 20 米"],
            ["存储", "内置 47GB + microSD"],
            ["传输", "Wi-Fi 6 / USB 3.1 / NFC 快连"]
          ],
          variants: [
            {
              name: "标准版",
              tag: "全景入门",
              priceHint: "轻装出行",
              desc: "单电池标准配置，适合短途出行与日常全景记录。",
              includes: ["相机主机", "电池", "USB-C 数据线", "收纳包", "备用镜片", "内存卡"],
              suitable: "旅行全景、运动记录、创意运镜"
            },
            {
              name: "全能版",
              tag: "续航加倍",
              priceHint: "整日外拍",
              desc: "加配备用电池与手柄，长时间外拍不断电。",
              includes: ["相机主机", "电池 ×2", "手柄", "数据线", "收纳包", "内存卡"],
              suitable: "整日外拍、长途骑行、活动记录"
            },
            {
              name: "旅拍套装",
              tag: "旅行出游",
              priceHint: "自拍杆 + 脚架",
              desc: "配隐形自拍杆与迷你三脚架，举杆拍出无人机视角，架起来拍延时。",
              includes: ["相机主机", "隐形自拍杆", "迷你三脚架", "电池", "收纳包", "内存卡"],
              suitable: "出国旅行、城市打卡、风景延时"
            }
          ],
          source: "https://www.insta360.com/cn/product/insta360-x6"
        }
      ]
    },
    {
      key: "mirrorless",
      title: "微单相机",
      brand: "Canon",
      desc: "APS-C 大底可换镜头，人像、风光、演出都能打",
      accent: "#b45309",
      items: [
        {
          id: "canon-r50",
          art: "images/products/canon-r50.png",
          name: "佳能 EOS R50",
          full: "佳能 EOS R50 微单",
          brand: "Canon",
          hot: true,
          tags: ["APS-C 画幅", "轻巧机身", "入门友好"],
          scene: "第一台微单 / 日常人像 / 旅行随拍",
          summary: "APS-C 大底画质配轻巧机身，AUTO 模式抬手就拍，套餐可选四支镜头覆盖风光、人像与远摄。",
          highlights: [
            "APS-C 大底画质，虚化和暗部表现远胜手机",
            "AUTO 模式自动识别场景，零基础也能出片",
            "可换镜头，一支机身覆盖多种拍摄题材",
            "机身轻巧，一天背着逛景点不累"
          ],
          specs: [
            ["传感器", "APS-C 画幅 CMOS，约 2420 万有效像素"],
            ["视频", "4K 30P（裁切）/ 全高清"],
            ["对焦", "全像素双核自动对焦，支持眼部检测"],
            ["屏幕", "可翻转触摸屏"],
            ["卡口", "佳能 RF 卡口（APS-C 可用 RF-S）"],
            ["重量", "机身约 375 克"],
            ["存储", "SD/SDHC/SDXC 卡"]
          ],
          variants: [
            {
              name: "18-45mm 入门套机",
              tag: "新手入门",
              priceHint: "轻便随身",
              desc: "APS-C 画质 + 轻巧变焦头，AUTO 模式抬手就拍。",
              includes: ["机身", "RF-S 18-45mm 镜头", "电池与充电器", "SD 卡", "背带", "收纳包"],
              suitable: "第一次用微单、日常人像、旅行随拍"
            },
            {
              name: "18-150mm 风光变焦",
              tag: "一镜走天下",
              priceHint: "旅行首选",
              desc: "8 倍以上变焦，风景、人文、特写一支镜头搞定。",
              includes: ["机身", "RF-S 18-150mm 镜头", "电池与充电器", "SD 卡", "背带", "收纳包"],
              suitable: "长途旅行、风光、一机三用"
            },
            {
              name: "F1.8 人像大光圈",
              tag: "人像神器",
              priceHint: "奶油虚化",
              desc: "F1.8 大光圈定焦，背景奶油虚化、暗光更亮。",
              includes: ["机身", "RF 50mm F1.8 镜头", "电池与充电器", "SD 卡", "背带", "收纳包"],
              suitable: "人像写真、情侣照、夜景街拍"
            },
            {
              name: "100-400mm 超远摄",
              tag: "远摄长焦",
              priceHint: "拍鸟拍演出",
              desc: "最长 400mm（等效 640mm），远处主体也能拍满画面。",
              includes: ["机身", "RF 100-400mm 镜头", "电池与充电器", "SD 卡", "背带", "收纳包"],
              suitable: "拍鸟、演唱会、体育赛事、野生动物"
            }
          ],
          source: "https://www.canon.com.cn/product/eosr50/specification.html"
        }
      ]
    },
    {
      key: "compact",
      title: "卡片相机",
      brand: "Canon",
      desc: "口袋即可开拍，旅行日常随手记录",
      accent: "#0369a1",
      items: [
        {
          id: "g7x-mark3",
          art: "images/products/g7x-mark3.png",
          name: "G7 X Mark III",
          full: "佳能 PowerShot G7 X Mark III",
          brand: "Canon",
          hot: true,
          tags: ["1 英寸大底", "F1.8 大光圈", "4K 无裁切"],
          scene: "旅行随拍 / 美食探店 / 自拍 Vlog",
          summary: "1.0 英寸 2010 万像素配 F1.8-2.8 大光圈变焦，口袋大小却有大底画质。",
          highlights: [
            "1.0 英寸堆栈式 CMOS，画质比普通卡片机高一档",
            "24-100mm 焦段配 F1.8 大光圈，暗光拍照也通透",
            "4K 无裁切录像，广角视角完整保留",
            "约 30 张/秒高速连拍，抓拍不丢瞬间"
          ],
          specs: [
            ["传感器", "1.0 英寸堆栈式 CMOS，约 2010 万有效像素"],
            ["镜头", "等效 24-100mm，F1.8-2.8（4.2 倍变焦）"],
            ["视频", "4K 30p 无裁切 / 高帧频全高清 120p"],
            ["连拍", "约 30 张/秒"],
            ["屏幕", "可翻转触摸屏"],
            ["电池", "NB-13L 锂电池"],
            ["存储", "SD/SDHC/SDXC 卡"]
          ],
          variants: [
            {
              name: "标准版",
              tag: "轻装随身",
              priceHint: "口袋相机",
              desc: "机身 + 电池 + 存储卡，随手装进口袋就能拍。",
              includes: ["相机主机", "电池与充电器", "SD 卡", "手腕带", "收纳包"],
              suitable: "旅行随拍、美食探店、日常人像"
            },
            {
              name: "蓝牙自拍杆版",
              tag: "单人自拍",
              priceHint: "Vlog 标配",
              desc: "加配无线蓝牙自拍杆，手机遥控快门，一个人也能拍全身自拍。",
              includes: ["相机主机", "无线蓝牙自拍杆", "电池与充电器", "SD 卡", "收纳包"],
              suitable: "自拍 Vlog、单人旅行、合影"
            }
          ],
          source: "https://global.canon/zh/c-museum/product/dcc884.html"
        },
        {
          id: "g12",
          art: "images/products/g12.png",
          name: "佳能 G12",
          full: "佳能 PowerShot G12",
          brand: "Canon",
          tags: ["专业操控", "双层转盘", "翻转屏"],
          scene: "备机扫街 / 质感直出 / 摄影入门练习",
          summary: "G 系列经典机皇，双层转盘加前部拨轮，像用单反一样调参数。",
          highlights: [
            "双层模式转盘 + 前部电子拨轮，参数调节像单反",
            "2.8 英寸可旋转屏，翻到 177° 便于自拍和低角度",
            "光学取景器 + 屈光度调节，强光下也看得清",
            "28-140mm 五倍变焦，日常扫街焦段够用"
          ],
          specs: [
            ["传感器", "约 1000 万像素（HS SYSTEM）"],
            ["镜头", "5 倍变焦，等效 28-140mm，F2.8-8.0"],
            ["屏幕", "2.8 英寸可旋转 LCD（约 46.1 万点）"],
            ["取景器", "光学实像式取景器，带屈光度调节"],
            ["存储", "SD/SDHC/SDXC 卡"],
            ["视频", "1280×720 短片"],
            ["电池", "NB-7L"]
          ],
          variants: [
            {
              name: "标准配置",
              tag: "经典操控",
              priceHint: "练手备机",
              desc: "机身加电池存储卡，体验单反式操控与翻转屏取景。",
              includes: ["相机主机", "电池与充电器", "SD 卡", "手绳", "收纳包"],
              suitable: "备机扫街、质感直出、摄影入门练习"
            }
          ],
          source: "https://global.canon/zh/c-museum/product/dcc596.html"
        }
      ]
    },
    {
      key: "ccd",
      title: "复古 CCD",
      brand: "Canon",
      desc: "千禧年复古色调，氛围感照片与胶片质感",
      accent: "#be185d",
      items: [
        {
          id: "ixus-210",
          art: "images/products/ixus-210.png",
          name: "IXUS 210",
          full: "佳能 IXUS 210 复古 CCD",
          brand: "Canon",
          tags: ["3.5 英寸触摸屏", "24mm 广角", "复古色调"],
          scene: "氛围感人像 / 复古街拍 / 旅行记录",
          summary: "3.5 英寸大触摸屏取代了背面所有按键，24mm 广角加 CCD 出片自带奶油色调。",
          highlights: [
            "CCD 传感器独有的柔和色彩，直出就有复古氛围",
            "3.5 英寸全触摸屏，像用手机一样操作相机",
            "24mm 广角配 5 倍变焦，拍人多景都行",
            "机身配色经典，出片拍照都好看"
          ],
          specs: [
            ["传感器", "1/2.3 英寸 CCD，约 1410 万有效像素"],
            ["镜头", "5 倍变焦，等效 24-120mm，F2.8-5.9"],
            ["屏幕", "3.5 英寸触摸屏"],
            ["视频", "1280×720 / 640×480"],
            ["存储", "SD/SDHC/SDXC 卡"],
            ["电池", "NB-6L，约 220 张"],
            ["重量", "约 160 克（含电池与卡）"]
          ],
          variants: [
            {
              name: "标准配置",
              tag: "氛围神器",
              priceHint: "复古直出",
              desc: "机身加电池存储卡，出门就能拍复古氛围照。",
              includes: ["相机主机", "电池与充电器", "SD 卡", "手绳", "收纳包"],
              suitable: "氛围感人像、复古街拍、旅行记录"
            }
          ],
          source: "https://global.canon/zh/c-museum/product/dcc587.html"
        },
        {
          id: "ixus-130",
          art: "images/products/ixus-130.png",
          name: "IXUS 130",
          full: "佳能 IXUS 130 复古 CCD",
          brand: "Canon",
          tags: ["超薄机身", "28mm 广角", "复古"],
          scene: "口袋扫街 / 复古氛围 / 随手记录",
          summary: "IXUS 系列经典卡片造型，小巧便携、出片复古，适合当扫街备机。",
          highlights: [
            "超薄卡片设计，塞进牛仔裤口袋就走",
            "CCD 成像柔和自然，直出就有胶片味",
            "28mm 广角起步，朋友聚会合影一拍装得下",
            "小巧轻便，作为扫街备机几乎没有负担"
          ],
          specs: [
            ["传感器", "CCD 传感器（约 1400 万级，以官方为准）"],
            ["镜头", "约 4 倍变焦，等效 28mm 广角起步"],
            ["屏幕", "2.7 英寸液晶屏"],
            ["存储", "SD/SDHC/SDXC 卡"],
            ["机身", "超薄卡片式设计"],
            ["电池", "专用锂电池"],
            ["说明", "具体规格以实物与官方页面为准"]
          ],
          variants: [
            {
              name: "标准配置",
              tag: "随身扫街",
              priceHint: "轻便复古",
              desc: "机身加电池存储卡，轻便随身带。",
              includes: ["相机主机", "电池与充电器", "SD 卡", "手绳", "收纳包"],
              suitable: "口袋扫街、复古氛围、随手记录"
            }
          ],
          source: "https://global.canon/zh/c-museum/camera.html?s=dcc"
        }
      ]
    },
    {
      key: "tripod",
      title: "三脚架与配件",
      brand: "Fotopro",
      desc: "液压云台稳定支撑，直播、合影与长曝光必备",
      accent: "#7c2d12",
      items: [
        {
          id: "fy-830",
          art: "images/rental/fy-830.svg",
          name: "富图宝 FY-830",
          full: "富图宝 FY-830 + MH-4A 液压云台三脚架",
          brand: "Fotopro",
          tags: ["液压云台", "直播固定", "稳定支撑"],
          scene: "直播带货 / 多人合影 / 延时与长曝光",
          summary: "液压云台顺滑调节俯仰横摇，三脚架稳住画面不抖，直播、合影、延时都能固定拍。",
          highlights: [
            "液压云台阻尼顺滑，推拉摇移不生硬",
            "三脚架稳定支撑，长曝光与延时画面清晰",
            "手柄控制方向，拧紧即锁定构图",
            "手机夹、延长杆等配件可按需自选"
          ],
          specs: [
            ["型号", "富图宝 FY-830 + MH-4A 液压云台"],
            ["云台类型", "液压阻尼云台"],
            ["快装", "快装板锁紧设计，装机快速"],
            ["水平", "带水平泡，便于快速调平"],
            ["接口", "1/4 英寸标准螺丝"],
            ["适用", "相机、云台相机、手机"]
          ],
          variants: [
            {
              name: "液压云台标准版",
              tag: "基础固定",
              priceHint: "直播合影",
              desc: "标准三脚架 + 液压云台 + 快装板，固定机位最常用。",
              includes: ["三脚架", "液压云台", "快装板", "收纳袋"],
              suitable: "直播带货、多人合影、延时与长曝光"
            },
            {
              name: "自选赠送配件",
              tag: "按需选配",
              priceHint: "免费加装",
              desc: "下单时联系客服自选配件：手机夹、小桌板、云台支架、延长杆等，以库存为准。",
              includes: ["标准版全部", "手机增位夹", "小桌板", "云台相机支架", "30cm 延长杆（按需选，以库存为准）"],
              suitable: "手机直播、云台机固定、桌面拍摄"
            }
          ],
          source: "https://www.fotopro.cn/"
        }
      ]
    },
    {
      key: "recovery",
      title: "内存卡数据找回",
      brand: "SanDisk · Lexar",
      desc: "素材误删别慌，按官方工具流程尝试找回",
      accent: "#0f766e",
      items: [
        {
          id: "sd-recovery",
          art: "images/rental/sd-recovery.svg",
          name: "SD 卡数据找回",
          full: "SD 卡误删数据找回服务",
          brand: "SanDisk · Lexar",
          tags: ["误删找回", "官方工具", "电脑操作"],
          scene: "相机素材误删 / 格式化后找回",
          summary: "照片误删或格式化别急着继续拍，用品牌官方恢复工具在电脑上尝试找回。",
          highlights: [
            "提供闪迪、雷克沙官方恢复工具的正确下载入口",
            "指导「先停止写入」的正确止损操作",
            "电脑端读卡器操作，避免相机内二次损坏",
            "不涉及盗版与破解工具，操作合规可追溯"
          ],
          specs: [
            ["适用卡型", "SD / SDHC / SDXC"],
            ["操作设备", "Windows 或 Mac 电脑 + 读卡器"],
            ["官方工具", "SanDisk RescuePRO / Lexar 数据恢复"],
            ["注意事项", "误删后立即停止拍摄，不要再写入新数据"],
            ["风险提示", "非百分百找回，操作风险需自行承担"]
          ],
          variants: [
            {
              name: "远程指导",
              tag: "在线协助",
              priceHint: "客服陪跑",
              desc: "客服远程指导下载官方工具与操作步骤。",
              includes: ["操作指引", "官方工具下载入口", "售后客服跟进"],
              suitable: "相机 SD 卡素材误删、格式化后找回"
            }
          ],
          source: "https://www.lc-tech.com/"
        },
        {
          id: "tf-recovery",
          art: "images/rental/tf-recovery.svg",
          name: "TF 卡数据找回",
          full: "microSD（TF）卡误删数据找回服务",
          brand: "SanDisk · Lexar",
          tags: ["运动相机卡", "误删找回", "官方工具"],
          scene: "运动相机 / 无人机 / 全景相机素材找回",
          summary: "运动相机、无人机常见的 microSD 卡误删，同样用官方工具在读卡器上尝试恢复。",
          highlights: [
            "适配运动相机、全景相机、无人机使用的 microSD 卡",
            "同样遵循「先止损、再恢复」的流程",
            "提供官方软件入口，拒绝来源不明的恢复工具",
            "客服可远程指导，减少二次误操作"
          ],
          specs: [
            ["适用卡型", "microSD / microSDHC / microSDXC"],
            ["操作设备", "Windows 或 Mac 电脑 + 读卡器"],
            ["官方工具", "SanDisk RescuePRO / Lexar 数据恢复"],
            ["注意事项", "误删后立即停止拍摄，不要格式化"],
            ["风险提示", "非百分百找回，操作风险需自行承担"]
          ],
          variants: [
            {
              name: "远程指导",
              tag: "在线协助",
              priceHint: "客服陪跑",
              desc: "客服远程指导下载官方工具与操作步骤。",
              includes: ["操作指引", "官方工具下载入口", "售后客服跟进"],
              suitable: "运动相机、无人机、全景相机 microSD 卡找回"
            }
          ],
          source: "https://www.lexar.com/"
        }
      ]
    }
  ]
};
