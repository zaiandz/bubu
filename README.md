# 商品教程中心

一个纯静态的相机租赁教程网站。左侧是分类与商品列表，右侧展示对应教程，首页提供主目录和子目录快捷入口。
无需框架和构建工具，双击 `index.html` 即可运行。

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

## 修改分类与教程

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

当前共有 22 个子目录，其中 18 个相机子目录包含“如何导出照片和视频”完整教程。

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

- 顶部 Logo 在 `SITE_CONFIG.logoImage` 中修改。
- 主目录图标位于 `images/category-icons`，可在 `CATEGORIES[].iconImage` 中替换。
- 子目录图标位于 `images/category-icons/children`，可在 `CATEGORIES[].children[].iconImage` 中替换。
- `logoImage` 有路径时优先显示图片，留空时显示 `logo` 中的 Emoji。
- 相机租赁主题位于 `css/rental-theme.css`，基础样式位于 `css/style.css`。
- 主目录和子目录支持展开、收纳和一键全部展开/收纳。
- 教程步骤支持逐步折叠，也可使用“展开全部”和“收起全部”。
- 搜索栏会匹配子目录名称、简介、关键词以及教程正文。
- 深浅主题会保存在浏览器 `localStorage` 中。
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


