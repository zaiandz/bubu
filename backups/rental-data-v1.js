/* ============================================================
 * 【租赁页数据层】js/rental-data.js
 * 与首页 js/data.js 的类目 / 型号一一对应（25 个型号，8 个类目）。
 * 参数来源：DJI 官方技术参数页、Insta360 官方产品页、佳能相机博物馆规格页，
 * 以及租赁方自有设备清单（脚架、数据找回为服务类目）。
 * 维护提示：id 必须与 js/data.js 中 CATEGORIES[].children[].id 完全一致。
 * ============================================================ */
window.RENTAL_DATA = {
  brand: "视感闪租",
  site: "湖北视感闪租相机租赁",
  updated: "2026-10",
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
          id: "gimbal-phone",
          name: "Pocket 3 标准版",
          full: "大疆 Osmo Pocket 3 标准版",
          brand: "DJI",
          hot: true,
          tags: ["新手友好", "Vlog 神器", "自带云台"],
          art: "images/rental/gimbal-phone.svg",
          artType: "line",
          scene: "日常记录 / 旅行 Vlog / 探店拍摄",
          summary: "2.0 英寸旋转触控屏一拧即开机，1 英寸大底加三轴云台，边走边拍也稳，是租机首选。",
          highlights: [
            "转屏幕就开机，2 秒进入拍摄状态，没有学习成本",
            "1 英寸 CMOS + 三轴机械云台，抖动抑制 ±0.005°，走路拍摄不糊",
            "智能跟随、竖拍模式、延时摄影一应俱全，短视频素材一次拍齐",
            "179 克口袋尺寸，比手机还轻，随身带着毫无负担"
          ],
          specs: [
            ["传感器", "1 英寸 CMOS"],
            ["镜头", "等效 20mm，f/2.0"],
            ["视频", "4K 60fps / 2.7K / 1080p，慢动作 4K 120fps"],
            ["照片", "16:9 3840×2160，约 940 万像素"],
            ["屏幕", "2.0 英寸旋转触控屏，556×314，700 尼特"],
            ["防抖", "三轴机械云台 + 电子增稳"],
            ["重量", "约 179 克"],
            ["续航", "约 166 分钟（1080p/24fps，熄屏关 Wi-Fi）"],
            ["存储", "microSD（最大 1TB），无内置存储"],
            ["接口", "USB-C（支持 PD 快充，16 分钟充 80%）"]
          ],
          includes: ["相机主机", "官方保护壳", "收纳包", "128G 内存卡", "手绳", "USB 读卡器"],
          source: "https://www.dji.com/cn/osmo-pocket-3/specs"
        },
        {
          id: "gimbal-one",
          name: "Pocket 3 长续航版",
          full: "大疆 Osmo Pocket 3 长续航版",
          brand: "DJI",
          tags: ["续航加强", "旅拍", "长时间跟拍"],
          art: "images/rental/gimbal-one.svg",
          artType: "line",
          scene: "跟拍一整天 / 户外旅拍 / 活动现场",
          summary: "在标准版基础上多了一只原厂续航手柄，主电池加手柄双供电，长时间跟拍不用中途充电。",
          highlights: [
            "多备一只原厂续航手柄，拍满一整天活动也够用",
            "手柄带 1/4 螺纹孔，可直接接三脚架固定机位",
            "操作与标准版完全一致，换机不用重新学",
            "适合需要连续录制、不方便中途充电的场景"
          ],
          specs: [
            ["传感器", "1 英寸 CMOS"],
            ["镜头", "等效 20mm，f/2.0"],
            ["视频", "4K 60fps / 2.7K / 1080p，慢动作 4K 120fps"],
            ["屏幕", "2.0 英寸旋转触控屏，700 尼特"],
            ["防抖", "三轴机械云台 + 电子增稳"],
            ["重量", "约 179 克（不含手柄）"],
            ["续航", "相机约 166 分钟 + 续航手柄额外供电"],
            ["存储", "microSD（最大 1TB）"],
            ["接口", "USB-C；手柄底部 1/4 螺纹孔"]
          ],
          includes: ["相机主机", "续航手柄", "官方保护壳", "收纳包", "128G 内存卡", "手绳", "USB 读卡器"],
          source: "https://www.dji.com/cn/osmo-pocket-3/specs"
        },
        {
          id: "gimbal-two",
          name: "Pocket 3 全能套装",
          full: "大疆 Osmo Pocket 3 全能套装",
          brand: "DJI",
          hot: true,
          tags: ["配件最全", "专业创作", "二合一"],
          art: "images/rental/gimbal-two.svg",
          artType: "line",
          scene: "商业拍摄 / 多机位 Vlog / 团队外拍",
          summary: "续航手柄、增广镜、无线麦克风、迷你三脚架一次配齐，一套设备搞定收音、续航与超广角。",
          highlights: [
            "DJI Mic 2 无线麦克风直连，户外口播人声清晰",
            "磁吸增广镜把视角扩展到 108°（等效 15mm），拍建筑和大场景更从容",
            "迷你三脚架立起来就拍延时，固定机位不用另买配件",
            "全套一件包带走，团队外拍不落东西"
          ],
          specs: [
            ["传感器", "1 英寸 CMOS"],
            ["镜头", "等效 20mm，f/2.0（可磁吸增广镜至 108°）"],
            ["视频", "4K 60fps / 2.7K / 1080p，慢动作 4K 120fps"],
            ["屏幕", "2.0 英寸旋转触控屏，700 尼特"],
            ["音频", "3 个机内麦克风 + DJI Mic 2 无线麦克风"],
            ["防抖", "三轴机械云台 + 电子增稳"],
            ["存储", "microSD（最大 1TB）"],
            ["配件", "续航手柄、增广镜、Mic 2、迷你三脚架、磁吸背夹"]
          ],
          includes: ["相机主机", "续航手柄", "增广镜", "DJI Mic 2 发射器与配件", "迷你三脚架", "收纳包", "128G 内存卡"],
          source: "https://www.dji.com/cn/osmo-pocket-3/specs"
        },
        {
          id: "gimbal-pocket4pro-standard",
          name: "Pocket 4 Pro 标准套装",
          full: "大疆 Osmo Pocket 4 Pro 标准套装",
          brand: "DJI",
          tags: ["新品", "自带补光灯", "竖拍"],
          art: "images/rental/gimbal-pocket4pro-standard.svg",
          artType: "line",
          scene: "夜间拍摄 / 人像 Vlog / 直播补光",
          summary: "带官方补光灯的手持云台，室内外光线弱时也能把脸拍亮，竖拍横拍随屏幕旋转切换。",
          highlights: [
            "机身集成补光灯，暗光自拍和夜间口播不用另带灯",
            "屏幕旋转即切换横拍 / 竖拍，短视频平台可直接用",
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
          includes: ["相机主机", "官方保护壳", "收纳包", "内存卡", "手绳", "USB 读卡器"],
          source: "https://www.dji.com/cn/osmo-pocket-3/downloads"
        },
        {
          id: "gimbal-pocket4pro-combo",
          name: "Pocket 4 Pro 全能套装",
          full: "大疆 Osmo Pocket 4 Pro 全能套装",
          brand: "DJI",
          tags: ["配件齐全", "补光灯", "多功能"],
          art: "images/rental/gimbal-pocket4pro-combo.svg",
          artType: "line",
          scene: "团队创作 / 户外直播 / 多场景切换",
          summary: "在标准套装基础上加配续航手柄、三脚架与收音配件，补光灯配合手柄可实现长时间手持拍摄。",
          highlights: [
            "补光灯 + 续航手柄组合，长时间夜间拍摄不掉电",
            "配件齐全，外景、室内、直播一次搞定",
            "竖拍模式适配抖音、小红书等竖屏平台",
            "全套收纳包分格放置，取用一目了然"
          ],
          specs: [
            ["传感器", "1 英寸级 CMOS（以官方页面为准）"],
            ["镜头", "广角镜头，支持数码变焦"],
            ["视频", "最高 4K 录制（以官方参数页为准）"],
            ["屏幕", "旋转触控屏，支持横竖拍切换"],
            ["防抖", "三轴机械云台"],
            ["补光", "机身内置补光灯，多档亮度可调"],
            ["配件", "续航手柄、迷你三脚架、麦克风等（以套装清单为准）"],
            ["说明", "具体规格以随机说明书与 DJI 官方页面为准"]
          ],
          includes: ["相机主机", "续航手柄", "迷你三脚架", "收音配件", "收纳包", "内存卡"],
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
          id: "action-standard",
          name: "Ace Pro 2 标准版",
          full: "影石 Insta360 Ace Pro 2 标准版",
          brand: "Insta360",
          hot: true,
          tags: ["8K 运动相机", "徕卡镜头", "翻转屏"],
          art: "images/rental/action-standard.svg",
          artType: "line",
          scene: "骑行 / 滑板 / 露营 / 旅行记录",
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
            ["存储", "microSD 存储卡"],
            ["配件", "快拆底座、电池、USB-C 数据线"]
          ],
          includes: ["相机主机", "电池", "快拆底座", "麦克风防风罩", "数据线", "收纳包"],
          source: "https://store.insta360.com/cn/product/ace-pro-2"
        },
        {
          id: "action-street",
          name: "Ace Pro 2 街拍套装",
          full: "影石 Insta360 Ace Pro 2 街拍套装",
          brand: "Insta360",
          tags: ["街拍手柄", "竖拍", "抓拍"],
          art: "images/rental/action-street.svg",
          artType: "line",
          scene: "城市扫街 / 潮流穿搭 / 街头采访",
          summary: "在标准版基础上加装街拍手柄，单手握持更稳，竖拍构图更符合社交平台的观看习惯。",
          highlights: [
            "街拍手柄提供更稳的单手抓拍姿态",
            "竖拍握持时操作按钮位置更顺手",
            "8K 画质 + 翻转屏，街拍回看与构图都清楚",
            "快拆结构，几秒就能拆回标准形态"
          ],
          specs: [
            ["传感器", "1/1.3 英寸 8K 传感器"],
            ["镜头", "徕卡 SUMMARIT 镜头"],
            ["视频", "最高 8K 录制"],
            ["屏幕", "2.5 英寸翻转触摸屏"],
            ["配件", "街拍手柄、快拆底座"],
            ["防水", "机身防水（以官方说明为准）"],
            ["存储", "microSD 存储卡"]
          ],
          includes: ["相机主机", "街拍手柄", "电池", "快拆底座", "数据线", "收纳包"],
          source: "https://store.insta360.com/cn/product/ace-pro-2"
        },
        {
          id: "action-neck",
          name: "Ace Pro 2 挂脖套装",
          full: "影石 Insta360 Ace Pro 2 挂脖套装",
          brand: "Insta360",
          tags: ["第一视角", "解放双手", "沉浸感"],
          art: "images/rental/action-neck.svg",
          artType: "line",
          scene: "第一视角 / 做饭 / 手工 / 沉浸式记录",
          summary: "配挂脖支架，相机挂在胸前拍第一视角，双手完全解放，做饭、组装、手工都能边做边拍。",
          highlights: [
            "挂脖支架贴胸固定，画面就是你的第一视角",
            "双手完全解放，边操作边录制不用手持",
            "走动时佩戴稳定，比手持更适合长时间记录",
            "适合教程类、沉浸式体验类内容创作"
          ],
          specs: [
            ["传感器", "1/1.3 英寸 8K 传感器"],
            ["镜头", "徕卡 SUMMARIT 镜头"],
            ["视频", "最高 8K 录制"],
            ["屏幕", "2.5 英寸翻转触摸屏"],
            ["配件", "挂脖支架"],
            ["防水", "机身防水（以官方说明为准）"],
            ["存储", "microSD 存储卡"]
          ],
          includes: ["相机主机", "挂脖支架", "电池", "快拆底座", "数据线", "收纳包"],
          source: "https://store.insta360.com/cn/product/ace-pro-2"
        },
        {
          id: "action-vlog",
          name: "Ace Pro 2 手持 Vlog 套装",
          full: "影石 Insta360 Ace Pro 2 手持 Vlog 套装",
          brand: "Insta360",
          tags: ["手持支架", "口播", "旅行 Vlog"],
          art: "images/rental/action-vlog.svg",
          artType: "line",
          scene: "旅行 Vlog / 口播讲解 / 边走边拍",
          summary: "加装手持支架后握持更接近传统 Vlog 机，翻转屏实时自检构图，适合边走边讲的旅行记录。",
          highlights: [
            "手持支架让握持姿势更自然，长时间拍摄不累手",
            "翻转屏实时预览构图，自拍口播不拍偏",
            "防风麦克风 + 机内降噪，户外人声清晰",
            "支架可折叠，塞进背包不占地方"
          ],
          specs: [
            ["传感器", "1/1.3 英寸 8K 传感器"],
            ["镜头", "徕卡 SUMMARIT 镜头"],
            ["视频", "最高 8K 录制"],
            ["屏幕", "2.5 英寸翻转触摸屏"],
            ["配件", "手持支架"],
            ["音频", "机内防风麦克风"],
            ["存储", "microSD 存储卡"]
          ],
          includes: ["相机主机", "手持支架", "电池", "快拆底座", "数据线", "收纳包"],
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
          id: "insta360-x6-standard",
          name: "Insta360 X6 标准版",
          full: "影石 Insta360 X6 标准版",
          brand: "Insta360",
          hot: true,
          tags: ["8K 全景", "1 英寸底", "先拍后构图"],
          art: "images/rental/insta360-x6-standard.svg",
          artType: "line",
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
          includes: ["相机主机", "电池", "USB-C 数据线", "收纳包", "备用镜片", "内存卡"],
          source: "https://www.insta360.com/cn/product/insta360-x6"
        },
        {
          id: "insta360-x6-allround",
          name: "Insta360 X6 全能版",
          full: "影石 Insta360 X6 全能版",
          brand: "Insta360",
          tags: ["双电池", "续航加倍", "配件齐全"],
          art: "images/rental/insta360-x6-allround.svg",
          artType: "line",
          scene: "整日外拍 / 长途骑行 / 活动记录",
          summary: "在标准版基础上加配备用电池与手柄配件，长时间外拍不用中途充电，换电几秒完成。",
          highlights: [
            "双电池 + 快充，长时间外拍不断电",
            "手柄配件提升握持稳定性，运镜更顺",
            "8K 全景画质与标准版一致",
            "适合一整天在外的骑行、徒步、活动跟拍"
          ],
          specs: [
            ["传感器", "双 1/1.1 英寸方形传感器（1 英寸级）"],
            ["视频", "8K 50fps 全景；5K60fps 平面"],
            ["照片", "1.2 亿像素全景照片"],
            ["屏幕", "2.32 英寸 OLED 全面屏"],
            ["电池", "2600mAh × 2（含备用电池）"],
            ["防水", "IP68 裸机防水 20 米"],
            ["存储", "内置 47GB + microSD"],
            ["配件", "备用电池、手柄、收纳包"]
          ],
          includes: ["相机主机", "电池 ×2", "手柄", "数据线", "收纳包", "内存卡"],
          source: "https://www.insta360.com/cn/product/insta360-x6"
        },
        {
          id: "insta360-x6-travel",
          name: "Insta360 X6 旅拍套装",
          full: "影石 Insta360 X6 旅拍套装",
          brand: "Insta360",
          tags: ["自拍杆", "三脚架", "旅行出游"],
          art: "images/rental/insta360-x6-travel.svg",
          artType: "line",
          scene: "出国旅行 / 城市打卡 / 风景延时",
          summary: "配隐形自拍杆与迷你三脚架，举杆拍出无人机视角，架起来拍延时，旅行一趟素材全有。",
          highlights: [
            "隐形自拍杆在画面里自动消失，第三人称视角随手拍",
            "迷你三脚架固定机位，拍星空延时和延时大片",
            "8K 全景 + 防水，海边、雨天都能用",
            "全套放进旅行收纳包，机场托运不占地"
          ],
          specs: [
            ["传感器", "双 1/1.1 英寸方形传感器（1 英寸级）"],
            ["视频", "8K 50fps 全景；5K60fps 平面"],
            ["照片", "1.2 亿像素全景照片"],
            ["屏幕", "2.32 英寸 OLED 全面屏"],
            ["电池", "2600mAh，8K30fps 约 140 分钟"],
            ["防水", "IP68 裸机防水 20 米"],
            ["配件", "隐形自拍杆、迷你三脚架"],
            ["存储", "内置 47GB + microSD"]
          ],
          includes: ["相机主机", "隐形自拍杆", "迷你三脚架", "电池", "收纳包", "内存卡"],
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
          id: "mirrorless-entry",
          name: "佳能微单 + 18-45mm 入门套机",
          full: "佳能 EOS R50 + RF-S 18-45mm 入门套机",
          brand: "Canon",
          hot: true,
          tags: ["新手入门", "轻便", "易上手"],
          art: "images/rental/mirrorless-entry.svg",
          artType: "line",
          scene: "第一台微单 / 日常人像 / 旅行随拍",
          summary: "APS-C 画质 + 轻巧变焦头，AUTO 模式抬手就拍，适合第一次用可换镜头相机的用户。",
          highlights: [
            "APS-C 大底画质，虚化和暗部表现远胜手机",
            "18-45mm 覆盖广角到中焦，人像风景都能用",
            "AUTO 模式自动识别场景，零基础也能出片",
            "机身轻巧，一天背着逛景点不累"
          ],
          specs: [
            ["传感器", "APS-C 画幅 CMOS，约 2420 万有效像素"],
            ["镜头", "RF-S 18-45mm f/4.5-6.3 IS STM"],
            ["视频", "4K 30P（裁切）/ 全高清"],
            ["对焦", "全像素双核自动对焦，支持眼部检测"],
            ["屏幕", "可翻转触摸屏"],
            ["连拍", "电子快门高速连拍（以官方参数为准）"],
            ["重量", "机身约 375 克"],
            ["存储", "SD/SDHC/SDXC 卡"]
          ],
          includes: ["机身", "18-45mm 镜头", "电池与充电器", "SD 卡", "背带", "收纳包"],
          source: "https://www.canon.com.cn/product/eosr50/specification.html"
        },
        {
          id: "mirrorless-plus",
          name: "佳能微单 + 18-150mm 风光变焦",
          full: "佳能 EOS R50 + RF-S 18-150mm 一镜走天下",
          brand: "Canon",
          tags: ["一镜走天下", "风光", "旅行"],
          art: "images/rental/mirrorless-plus.svg",
          artType: "line",
          scene: "长途旅行 / 风光 / 一机三用",
          summary: "18-150mm 大变焦覆盖广角到长焦，一支镜头拍风景、人文和特写，旅行最省事的组合。",
          highlights: [
            "8 倍以上变焦，风景、人文、特写不用换镜头",
            "APS-C 高画质，细节和宽容度都比卡片机强",
            "镜头带 IS 防抖，长焦端手持也不糊",
            "一支镜头走完一趟旅行，包里轻很多"
          ],
          specs: [
            ["传感器", "APS-C 画幅 CMOS，约 2420 万有效像素"],
            ["镜头", "RF-S 18-150mm f/3.5-6.3 IS STM"],
            ["等效焦距", "约 29-240mm（35mm 等效）"],
            ["视频", "4K 30P / 全高清"],
            ["防抖", "镜头光学防抖 IS"],
            ["对焦", "全像素双核自动对焦"],
            ["存储", "SD/SDHC/SDXC 卡"],
            ["重量", "机身约 375 克 + 镜头约 310 克"]
          ],
          includes: ["机身", "18-150mm 镜头", "电池与充电器", "SD 卡", "背带", "收纳包"],
          source: "https://www.canon.com.cn/product/eosr50/specification.html"
        },
        {
          id: "mirrorless-pro",
          name: "佳能微单 + F1.8 人像大光圈",
          full: "佳能 EOS R50 + RF 50mm F1.8 人像镜头",
          brand: "Canon",
          hot: true,
          tags: ["人像神器", "大光圈虚化", "夜景"],
          art: "images/rental/mirrorless-pro.svg",
          artType: "line",
          scene: "人像写真 / 情侣照 / 夜景街拍",
          summary: "F1.8 大光圈定焦，背景奶油虚化、暗光更亮，人像和夜景的第一选择。",
          highlights: [
            "F1.8 大光圈虚化，人物和背景一眼分开",
            "暗光下进光更多，夜拍噪点更少",
            "50mm 黄金人像焦段，接近人眼视角",
            "轻量小巧，拍一整天不压手"
          ],
          specs: [
            ["传感器", "APS-C 画幅 CMOS，约 2420 万有效像素"],
            ["镜头", "RF 50mm F1.8 STM（等效约 80mm）"],
            ["最大光圈", "F1.8"],
            ["对焦", "全像素双核自动对焦 + 眼部检测"],
            ["视频", "4K 30P / 全高清"],
            ["虚化", "大光圈浅景深，背景虚化明显"],
            ["存储", "SD/SDHC/SDXC 卡"],
            ["重量", "机身约 375 克 + 镜头约 160 克"]
          ],
          includes: ["机身", "50mm F1.8 镜头", "电池与充电器", "SD 卡", "背带", "收纳包"],
          source: "https://www.canon.com.cn/product/eosr50/specification.html"
        },
        {
          id: "mirrorless-one",
          name: "佳能微单 + 超远摄 100-400mm",
          full: "佳能 EOS R50 + RF 100-400mm 超远摄镜头",
          brand: "Canon",
          tags: ["超远摄", "拍鸟拍演出", "运动"],
          art: "images/rental/mirrorless-one.svg",
          artType: "line",
          scene: "拍鸟 / 演唱会 / 体育赛事 / 野生动物",
          summary: "100-400mm 超远摄，公园拍鸟、看台拍爱豆、球场拍运动员，远处细节也能拉近。",
          highlights: [
            "最长 400mm（等效 640mm），远处主体也能拍满画面",
            "镜头光学防抖，手持长焦成功率更高",
            "适合演唱会、体育、野生动物等不方便靠近的场景",
            "与微单机身通用，可搭配其他镜头灵活使用"
          ],
          specs: [
            ["传感器", "APS-C 画幅 CMOS，约 2420 万有效像素"],
            ["镜头", "RF 100-400mm f/5.6-8 IS USM"],
            ["等效焦距", "约 160-640mm（35mm 等效）"],
            ["防抖", "镜头光学防抖 IS"],
            ["视频", "4K 30P / 全高清"],
            ["对焦", "全像素双核自动对焦"],
            ["存储", "SD/SDHC/SDXC 卡"],
            ["重量", "机身约 375 克 + 镜头约 635 克"]
          ],
          includes: ["机身", "100-400mm 镜头", "电池与充电器", "SD 卡", "背带", "收纳包"],
          source: "https://www.canon.com.cn/product/eosr50/specification.html"
        }
      ]
    },
    {
      key: "compact",
      title: "卡片相机",
      brand: "Canon",
      desc: "口袋即可开拍，旅行日常随手记录，G 系列与复古 CCD",
      accent: "#0369a1",
      items: [
        {
          id: "compact-entry",
          name: "G7 X Mark III 标准版",
          full: "佳能 PowerShot G7 X Mark III 标准版",
          brand: "Canon",
          hot: true,
          tags: ["1 英寸大底", "F1.8 大光圈", "4K 无裁切"],
          art: "images/rental/compact-entry.svg",
          artType: "line",
          scene: "旅行随拍 / 美食探店 / 日常人像",
          summary: "1.0 英寸 2010 万像素配 F1.8-2.8 大光圈变焦，口袋大小却有大底画质，是无反之外最省心的选择。",
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
            ["连拍", "约 30 张/秒（RAW 连拍约 70 张）"],
            ["屏幕", "可翻转触摸屏"],
            ["直播", "支持 Wi-Fi 直连直播（中国大陆不支持）"],
            ["电池", "NB-13L 锂电池"],
            ["存储", "SD/SDHC/SDXC 卡"]
          ],
          includes: ["相机主机", "电池与充电器", "SD 卡", "手腕带", "收纳包"],
          source: "https://global.canon/zh/c-museum/product/dcc884.html"
        },
        {
          id: "compact-vlog",
          name: "G7 X Mark III 蓝牙自拍杆版",
          full: "佳能 PowerShot G7 X Mark III + 无线蓝牙自拍杆",
          brand: "Canon",
          tags: ["自拍杆", "蓝牙遥控", "Vlog"],
          art: "images/rental/compact-vlog.svg",
          artType: "line",
          scene: "自拍 Vlog / 单人旅行 / 合影",
          summary: "标准版加上无线蓝牙自拍杆，手机也能当遥控器，一个人出门也能拍全身自拍和 Vlog。",
          highlights: [
            "蓝牙自拍杆，一个人拍全身自拍不求人",
            "可手机 App 远程控制快门，构图更自由",
            "翻转屏实时监看，自拍视角所见即所得",
            "画质与标准版一致，1 英寸大底加 F1.8 光圈"
          ],
          specs: [
            ["传感器", "1.0 英寸堆栈式 CMOS，约 2010 万有效像素"],
            ["镜头", "等效 24-100mm，F1.8-2.8"],
            ["视频", "4K 30p 无裁切 / 全高清 120p"],
            ["连接", "Wi-Fi + 蓝牙（支持手机遥控）"],
            ["配件", "无线蓝牙自拍杆"],
            ["屏幕", "可翻转触摸屏"],
            ["存储", "SD/SDHC/SDXC 卡"]
          ],
          includes: ["相机主机", "无线蓝牙自拍杆", "电池与充电器", "SD 卡", "收纳包"],
          source: "https://global.canon/zh/c-museum/product/dcc884.html"
        },
        {
          id: "compact-g12",
          name: "佳能G12卡片相机",
          full: "佳能 PowerShot G12",
          brand: "Canon",
          tags: ["专业操控", "双层转盘", "翻转屏"],
          art: "images/rental/compact-g12.svg",
          artType: "line",
          scene: "备机扫街 / 质感直出 / 摄影入门练习",
          summary: "G 系列经典机皇，双层转盘加前部拨轮，像用单反一样调参数，翻转屏取景灵活。",
          highlights: [
            "双层模式转盘 + 前部电子拨轮，参数调节像单反",
            "2.8 英寸可旋转屏，翻到 177° 便于自拍和低角度",
            "光学取景器 + 屈光度调节，强光下也能看得清",
            "28-140mm 五倍变焦，日常扫街焦段够用"
          ],
          specs: [
            ["传感器", "约 1000 万像素（HS SYSTEM）"],
            ["镜头", "5 倍变焦，等效 28-140mm，F2.8-8.0"],
            ["屏幕", "2.8 英寸可旋转 LCD（约 46.1 万点）"],
            ["取景器", "光学实像式取景器，带屈光度调节"],
            ["存储", "SD/SDHC/SDXC 卡"],
            ["视频", "1280×720 短片"],
            ["接口", "USB、HDMI 输出、模拟视频输出"],
            ["电池", "NB-7L"]
          ],
          includes: ["相机主机", "电池与充电器", "SD 卡", "手绳", "收纳包"],
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
          id: "canon-ixus-210",
          name: "IXUS 210 复古 CCD",
          full: "佳能 IXUS 210 复古 CCD",
          brand: "Canon",
          tags: ["3.5 英寸触摸屏", "广角", "复古色调"],
          art: "images/rental/canon-ixus-210.svg",
          artType: "line",
          scene: "氛围感人像 / 复古街拍 / 旅行记录",
          summary: "3.5 英寸大触摸屏取代了背面所有按键，24mm 广角加 CCD 出片自带奶油色调。",
          highlights: [
            "CCD 传感器独有的柔和色彩，直出就有复古氛围",
            "3.5 英寸全触摸屏，像用手机一样操作相机",
            "24mm 广角配 5 倍变焦，出去玩拍人多景都行",
            "机身配色经典，出片拍照都好看"
          ],
          specs: [
            ["传感器", "1/2.3 英寸 CCD，约 1410 万有效像素"],
            ["镜头", "5 倍变焦，等效 24-120mm，F2.8-5.9"],
            ["屏幕", "3.5 英寸触摸屏（约 46.1 万点）"],
            ["快门", "1/3000 秒 ~ 15 秒"],
            ["视频", "1280×720 / 640×480"],
            ["存储", "SD/SDHC/SDXC 卡"],
            ["电池", "NB-6L，约 220 张"],
            ["重量", "约 160 克（含电池与卡）"]
          ],
          includes: ["相机主机", "电池与充电器", "SD 卡", "手绳", "收纳包"],
          source: "https://global.canon/zh/c-museum/product/dcc587.html"
        },
        {
          id: "canon-ixus-130",
          name: "IXUS 130 复古 CCD",
          full: "佳能 IXUS 130 复古 CCD",
          brand: "Canon",
          tags: ["超薄机身", "滑动开机", "复古"],
          art: "images/rental/canon-ixus-130.svg",
          artType: "line",
          scene: "口袋扫街 / 复古氛围 / 随手记录",
          summary: "IXUS 系列经典卡片造型，滑动镜头盖即开机的仪式感，小巧便携、出片复古。",
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
            ["视频", "标清/高清短片（以官方为准）"],
            ["机身", "超薄卡片式设计"],
            ["电池", "专用锂电池"],
            ["说明", "具体规格以实物与官方页面为准"]
          ],
          includes: ["相机主机", "电池与充电器", "SD 卡", "手绳", "收纳包"],
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
          id: "tripod-live",
          name: "FY-830 液压云台标准版",
          full: "富图宝 FY-830 + MH-4A 液压云台三脚架",
          brand: "Fotopro",
          tags: ["液压云台", "直播", "稳定支撑"],
          art: "images/rental/tripod-live.svg",
          artType: "line",
          scene: "直播带货 / 多人合影 / 延时与长曝光",
          summary: "液压云台顺滑调节俯仰横摇，三脚架稳住画面不抖，直播、合影、延时都能固定拍。",
          highlights: [
            "液压云台阻尼顺滑，推拉摇移不生硬",
            "三脚架稳定支撑，长曝光与延时画面清晰",
            "手柄控制方向，拧紧即锁定构图",
            "适合直播、合影、产品视频固定机位"
          ],
          specs: [
            ["型号", "富图宝 FY-830 + MH-4A 液压云台"],
            ["云台类型", "液压阻尼云台"],
            ["快装", "快装板锁紧设计，装机快速"],
            ["水平", "带水平泡，便于快速调平"],
            ["接口", "1/4 英寸标准螺丝（可接相机/手机夹）"],
            ["适用", "相机、云台相机、手机"],
            ["说明", "具体承重与高度以实物随附说明为准"]
          ],
          includes: ["三脚架", "液压云台", "快装板", "收纳袋"],
          source: "https://www.fotopro.cn/"
        },
        {
          id: "tripod-cam",
          name: "FY-830 自选赠送配件",
          full: "富图宝 FY-830 可自选赠送配件",
          brand: "Fotopro",
          tags: ["免费配件", "按需选配", "扩展性强"],
          art: "images/rental/tripod-cam.svg",
          artType: "line",
          scene: "手机直播 / 云台机固定 / 桌面拍摄",
          summary: "下单可自选赠送的配件组合，手机夹、延长杆、转接器等按拍摄需求搭配。",
          highlights: [
            "手机夹、桌面小板、延长杆等配件按需选择",
            "配件大部分可免费赠送使用，具体以库存为准",
            "搭配三脚架可覆盖手机与云台机的固定需求",
            "下单前联系客服确认需要的配件即可"
          ],
          specs: [
            ["可选配件", "手机增位夹、小桌板、云台相机支架、vivo 脚架环"],
            ["可选配件", "转接器、30cm 延长杆"],
            ["适用设备", "手机、运动相机、手持云台相机"],
            ["获取方式", "下单时联系客服选择，以库存为准"],
            ["说明", "配件清单动态调整，以实际发货为准"]
          ],
          includes: ["所选配件（按客服确认的清单）", "收纳袋"],
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
          id: "recovery-sd",
          name: "SD 卡数据找回",
          full: "SD 卡误删数据找回服务",
          brand: "SanDisk · Lexar",
          tags: ["误删找回", "官方工具", "电脑操作"],
          art: "images/rental/recovery-sd.svg",
          artType: "line",
          scene: "相机素材误删 / 格式化后找回",
          summary: "照片误删或格式化别急着继续拍，用品牌官方恢复工具在电脑上尝试找回，成功率与操作时机直接相关。",
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
            ["风险提示", "非百分百找回，操作风险需自行承担"],
            ["替代方案", "不熟悉操作可前往本地数据恢复门店"]
          ],
          includes: ["操作指引", "官方工具下载入口", "售后客服跟进"],
          source: "https://www.lc-tech.com/"
        },
        {
          id: "recovery-tf",
          name: "TF 卡数据找回",
          full: "microSD（TF）卡误删数据找回服务",
          brand: "SanDisk · Lexar",
          tags: ["运动相机卡", "误删找回", "官方工具"],
          art: "images/rental/recovery-tf.svg",
          artType: "line",
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
            ["风险提示", "非百分百找回，操作风险需自行承担"],
            ["替代方案", "不熟悉操作可前往本地数据恢复门店"]
          ],
          includes: ["操作指引", "官方工具下载入口", "售后客服跟进"],
          source: "https://www.lexar.com/"
        }
      ]
    }
  ]
};
