# 商品教程中心（企业级 UI 改版）

一个纯静态的相机租赁教程网站。左侧是分类与目录，右侧展示对应教程，首页提供设备类目入口、教程数据与客服支持。
无需框架和构建工具，双击 `index.html` 即可运行。

## 三个 UI 方案

| 方案 | 目录 | 风格 |
| --- | --- | --- |
| 方案一 企业专业蓝（根目录默认） | `variants/v1-professional/` | 白色顶栏 + 深蓝主色，目录树 + 数据总览，最贴近企业官网 / 内网 |
| 方案二 深色精简工作台 | `variants/v2-dark-lite/` | 深色顶栏 + 墨绿强调，搜索优先、紧凑目录，适合店员 / 客服高频查询 |
| 方案三 资料库编辑风 | `variants/v3-editorial/` | 品牌蓝顶栏 + 暖白底色，双栏大卡片目录，接近企业知识库与操作手册 |

- 方案选择页：打开根目录 `preview.html`（含三个方案的截图与入口）。
- 三个方案共用 `css/style.css` 与 `js/app.js`，各自只带一份 `index.html` 与 `js/data.js`；
  视觉差异全部由 `index.html` 的 `<body class="variant-v1|v2|v3">` 和 CSS 变量控制。
- 修改 `variants/*/js/data.js` 或根目录的数据后，运行 `python tools/build-variants.py` 可一次性重新生成三个方案。

## 目录结构

    hbkmjweb/
    ├── index.html                 页面结构
    ├── css/
    │   ├── style.css              基础样式与动画
    │   └── rental-theme.css       相机租赁主题覆盖样式
    ├── js/
    │   ├── data.js                分类、教程与图片路径数据
    │   └── app.js                 渲染、搜索、折叠、主题等交互逻辑
    ├── images/                    图片和本地视频
    ├── videos/                    预留视频目录
    └── backups/                   网站备份、恢复说明和校验清单

## 教程内容（2026 重写版）

25 篇教程已按各品牌官方资料（DJI 支持中心、Insta360 在线手册、佳能官方手册）重新编写，
统一为「开箱核对 → 开机与充电 → 按键与屏幕 → 拍摄模式与技巧 → 导出素材 → 收纳保养」的结构，
共 184 个步骤、94 张插图、14 段演示视频。特征：

- 每篇第一步都有「租赁设备爱护」提醒，可自由修改；
- 不写未核实的参数（分辨率上限、续航小时数等），Pocket 4 Pro 等资料较少的机型提示以随机说明书为准；
- 全程无破解、盗版、刷机类指引，外链仅指向品牌官方页面；
- 内容源文件：`tools/newcontent/<教程 id>.json`，改完运行 `python tools/merge-tutorials.py` 合并进 `js/data.js`
  （脚本会校验字段、块类型与图片路径是否存在，避免破图），再运行 `python tools/build-variants.py` 同步三套方案。


## 设备租赁页（rental.html）

首页顶栏「设备目录」指向 `rental.html`，是按首页 25 个型号构建的相机租赁展示页：

- 文件：`rental.html` + `css/rental.css` + `js/rental-data.js`（数据）+ `js/rental.js`（交互）+ `images/rental/`（按类目配色的产品线条图）
- 交互：类目筛选、搜索、点击卡片弹出参数详情（Esc / 遮罩 / × 关闭）、客服二维码放大
- 维护与素材来源说明见 [docs/rental-page.md](docs/rental-page.md)
- 型号 id 与 `js/data.js` 一一对应，增删机型时两边同步修改

## 修改分类与教程

### 0. 目录调整与生成脚本

当前目录已按「品牌 + 系列」重组为 8 个主类目 / 25 个子目录（教程正文与 id 均未改动）：

| 主类目 | 子目录（型号） |
| --- | --- |
| 手持云台 · Pocket 系列（DJI） | Pocket 3 标准版 / 长续航版 / 全能套装、Pocket 4 Pro 标准套装 / 全能套装 |
| 运动相机 · Insta360 Ace 系列 | Ace Pro 2 标准版 / 街拍套装 / 挂脖套装 / 手持 Vlog 套装 |
| 全景相机 · Insta360 X 系列 | Insta360 X6 标准版 / 全能版 / 旅拍套装 |
| 微单相机 · 佳能 RF 卡口 | 18-45mm 入门套机 / 18-150mm 风光变焦 / F1.8 人像镜头 / 100-400mm 超远摄 |
| 卡片相机 · 佳能 G 系列 | G7 X Mark III 标准版 / 蓝牙自拍杆版 / 佳能 G12 |
| 复古 CCD 相机 · 佳能 IXUS 系列 | IXUS 210 / IXUS 130 |
| 三脚架 · 云台与配件（Fotopro） | FY-830 液压云台标准版 / 自选赠送配件 |
| 内存卡数据找回（SanDisk · Lexar） | SD 卡 / TF 卡 |

- 目录结构、显示简称、品牌名与首页文案统一在 `tools/build-variants.py` 顶部的配置里维护。
- 教程正文仍在 `js/data.js` 的 `SUBCATEGORY_CONTENT` 中，按 id 对应，增删子目录不受影响。

### 1. 修改主类目和子类目

打开 `js/data.js`，在 `CATEGORIES` 中维护目录：

    {
      value: "手持云台相机",
      label: "手持云台相机",
      icon: "🎥",
      homeDesc: "稳定跟拍，适合 Vlog 和日常记录",
      children: [
        { id: "gimbal-phone", value: "大疆pocket3标准版", label: "大疆pocket3标准版", icon: "📱" }
      ]
    }

- 新增子类目：向对应 `children` 数组增加对象。
- 删除子类目：从 `children` 数组删除对象，并同步删除不再使用的 `SUBCATEGORY_CONTENT` 内容。
- `id` 用于程序定位教程，创建后建议保持不变。
- `label` 是页面显示名称，可以随时修改。

### 2. 主类公共信息

`PRODUCTS` 只保存主类名称、图标、颜色、标签和搜索关键词等公共信息：

    {
      id: "sp-x1",
      name: "手持云台相机",
      icon: "🎥",
      category: "手持云台相机",
      tag: "热门",
      color: "#6366f1",
      desc: "手持云台系列简易说明教程",
      keywords: "大疆 Pocket 3 手持云台 相机 导出"
    }

每个子目录的教程正文集中在 `SUBCATEGORY_CONTENT` 中，互不影响：

    const SUBCATEGORY_CONTENT = {
      "gimbal-phone": {
        desc: "该子目录说明",
        keywords: "该子目录搜索关键词",
        steps: [
          {
            title: "步骤标题",
            icon: "📦",
            body: [
              { type: "p", text: "段落，支持 **加粗** 和 `代码`" },
              { type: "list", items: ["无序列表项"] },
              { type: "olist", items: ["有序列表项"] },
              { type: "tip", text: "提示框" },
              { type: "warn", text: "警告框" },
              { type: "img", src: "images/图片.jpg", alt: "图片说明", caption: "图注" },
              { type: "video", src: "images/视频.mp4", caption: "视频说明" },
              { type: "table", head: ["列1", "列2"], rows: [["值1", "值2"]] }
            ]
          }
        ]
      }
    };

当前共有 24 个子目录，其中 20 个相机子目录包含“如何导出照片和视频”完整教程。

## 首页与客服二维码

- 首页内容由 `HOME_CONFIG` 控制。
- 首页分类卡片根据 `CATEGORIES` 自动生成。
- 客服二维码在 `HOME_CONFIG.services` 中修改：

    services: [
      {
        title: "在线租赁客服",
        hours: "早9:20—晚11:30",
        qr: "images/客服售后二维码.jpg",
        qrText: "扫码联系租赁客服"
      }
    ]

- `qr` 填写实际二维码图片路径；点击首页二维码可以放大查看，点击空白处或按 Esc 关闭。

## Logo、主题与交互

- 顶部 Logo 在 `SITE_CONFIG.logoIcon`（裁切后的图形标记 `images/logo-mark.png`）中修改，
  如需使用整张方形 Logo，可改回 `SITE_CONFIG.logoImage`。
- 主目录图标位于 `images/category-icons`，可在 `CATEGORIES[].iconImage` 中替换。
- 子目录图标位于 `images/category-icons/children`，可在 `CATEGORIES[].children[].iconImage` 中替换。
- **教程插图**：每篇教程顶部配一张线条型设备插图（24 篇各一张，按机型和配件区分，
  例如 Pocket 3 标准/长续航/全能、Ace Pro 2 街拍/挂脖/Vlog、微单 18-45 / 18-150 / F1.8 / 100-400、
  X6 旅拍、三脚架云台/配件、SD/TF 卡找回）。
  插图以**内联 SVG** 直接写入页面（`js/illustrations.js`），不走图片请求，不会再出现破图；
  颜色自动跟随类目主色。生成脚本：`python tools/gen-illustrations.py`；输出同时保留为
  `images/illustrations/<教程 id>.svg`，可直接用设计软件编辑。
- **侧边目录图标**：已统一替换为内置的线条型 SVG 图标（24×24、1.6px 描边、跟随主题着色），
  定义在 `js/app.js` 的 `categoryIcon()` / `lineIconFor()` 中，按类目自动匹配：
  手持云台 / 运动相机 / 全景 / 微单 / 卡片机 / 复古 CCD / 三脚架 / 数据找回。
  修改类目名称时若关键字仍能匹配（如“云台”“全景”“三脚架”），图标会自动对应；否则回退为相机图标。
- 侧边栏宽度随屏幕分档：≥1440px 为 344px，常规为 320px（版本二 300px、版本三 330px），≤1280px 收窄到 286px，
  目录行高 44px、子目录行高 36px，大屏下不再拥挤。
- 方案一顶部「目录树 / 卡片列表」可切换并记住选择：目录树展开显示型号；卡片列表只列 8 个类目（点击进入该类教程）。
- **侧边栏只有一条目录**：全部展开 / 全部收纳 → 教程总览 → 8 个设备类目（点击整行就地展开型号）。
  一个型号对应一篇教程，点型号即打开并高亮，不再在下方重复渲染第二套列表。
- 搜索时目录会自动过滤为命中的类目和型号，右侧数字为命中数量；搜索框清空后恢复完整目录。
- `logoImage` 有路径时优先显示图片，留空时显示 `logo` 中的 Emoji。
- 三套主题变量与全部组件样式集中在 `css/style.css`（文件顶部按方案分组），原 `css/rental-theme.css` 已合并进该文件。
- 主目录和子目录支持展开、收纳和一键全部展开/收纳。
- 教程步骤支持逐步折叠，也可使用“展开全部”和“收起全部”。
- 搜索栏会匹配子目录名称、简介、关键词以及教程正文。
- 深浅主题会保存在浏览器 `localStorage` 中；未手动选择时跟随系统主题。
  主题开关写在 `<html data-theme>`（同时同步到 `<body>`），三套方案的深色变量在 `css/style.css` 顶部，选择器同时匹配 `<html>` 与 `<body>` 两种挂载位置。
- 移动端自动收起为抽屉目录，并提供关闭按钮。
- **手机端适配**（≤900px / ≤600px / ≤380px 三档）：
  - 顶栏收起为「菜单 + 品牌 + 搜索 + 主题」，搜索框自适应占满剩余宽度，输入框字号 16px（iOS 不会放大页面）；
  - 首页首屏按钮并排等宽，统计保持两列，类目卡片单列紧凑排版；
  - 目录抽屉宽度为屏幕的 88%（最大 360px），分类行 46px、型号行 40px，适合手指点击；
  - 教程页头部改为「插图 + 标题」横排，步骤标题、字号与按钮同步加大；
  - 方案三的「教程库概览」在手机上改为横向统计条，不再被挤成竖条。
- 顶栏的「教程总览 / 设备目录 / 客服支持（联系客服）」在**任意教程页**都能使用：
  点击会先回到首页，再定位到对应区块并短暂高亮；面包屑里的「教程总览」同样可用。
- 页面地址栏会保留当前教程 `id`，方便复制记录；按照当前需求，每次重新打开网站仍优先显示首页。

## 部署

将除 `backups` 外的网站文件完整上传到静态托管即可：GitHub Pages、Vercel、Netlify、对象存储或虚拟主机均可。

## 素材与版权说明

- 相机操作示意图为本项目自行整理的 SVG 图，不复制官方说明书截图。
- DJI、Insta360、佳能、Fotopro、Lexar 等官方内容仅通过公开页面或官方下载链接引用。
- 官方网站、品牌名称和商标归各自权利人所有。
- 用户自行上传的 Logo、二维码、图片和视频需确认拥有使用和公开传播权限。
- 添加第三方素材时，应优先使用明确允许免费使用和再分发的来源。

## 备份

`backups/恢复说明.txt` 记录最新备份文件；`backups/hbkmjweb-final-manifest_*.txt` 可用于核对各文件大小和 SHA256。



