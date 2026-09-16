# 商品教程中心

一个纯静态的商品图文教程网站。左侧是商品列表，右侧展示该商品对应的教程步骤。
无需任何框架、无需构建、无需服务器，双击 `index.html` 即可运行。

## 目录结构

    tutorial-site/
    ├── index.html          页面结构（HTML）
    ├── css/
    │   └── style.css       全站样式 + 动画（CSS）
    ├── js/
    │   ├── data.js         商品与教程数据（改内容只动这里）
    │   └── app.js          交互逻辑（JS）
    └── README.md           说明文档

## 怎么改成自己的内容

1. 打开 `js/data.js`
2. 修改 `CATEGORIES` 数组：主类目写在最外层，子类目写在该主类的 `children` 中
3. 修改 `PRODUCTS` 数组，每个对象就是该主类的教程模板；子类会自动继承同 `category` 的教程说明：

    {
      id: "唯一ID",              // 用于生成分享链接 ?p=xxx
      name: "商品名称",
      icon: "🔊",                 // 用 emoji 即可
      category: "分类名",         // 必须出现在 CATEGORIES 里
      tag: "热门",                // 可选，会显示成橙色小标签
      color: "#6366f1",           // 该商品的主题色
      desc: "一句话简介",
      keywords: "搜索关键词 空格分隔",
      steps: [
        {
          title: "步骤标题",
          icon: "📦",
          body: [
            { type: "p", text: "段落文字，支持 **加粗** 和 `代码`" },
            { type: "list",  items: ["无序列表项"] },
            { type: "olist", items: ["有序列表项"] },
            { type: "tip",   text: "蓝色提示框" },
            { type: "warn",  text: "黄色警告框" },
            { type: "code",  lang: "bash", text: "代码内容" },
            { type: "img",   src: "图片地址", caption: "图注" },

            { type: "table", head: ["列1","列2"], rows: [["值1","值2"]] }
          ]
        }
      ]
    }

## 新增、修改、删除子类目

子类目只在 `js/data.js` 的 `CATEGORIES[].children` 中维护，例如：

    {
      value: "手持云台相机",
      label: "手持云台相机",
      icon: "🎥", // 下方大目录图标
      children: [
        { id: "gimbal-phone", value: "手机云台版", label: "手机云台版", icon: "📱" },
        { id: "gimbal-pro",   value: "专业跟拍版", label: "专业跟拍版", icon: "🎬" }
      ]
    }

- 新增：向对应 `children` 数组增加一个对象
- 改名：修改子类对象的 `label`（页面显示名称）
- 删除：从对应 `children` 数组移除该对象
- 删除整个主类：从 `CATEGORIES` 移除该主类对象（对应的 `PRODUCTS` 模板也可一并删除）
- 下方大目录图标由 `CATEGORIES[].icon` 控制，可按类目名称自行替换
- 子类会自动继承对应 `PRODUCTS.category` 的 `desc`、`keywords` 和 `steps`
- 如需子类单独显示不同说明，可在子类对象中填写 `desc`、`keywords` 或 `steps`
- `id` 用于分享链接，创建后建议不要再随意修改

### 首页维护

- 侧边新增“首页”按钮，原有分类按钮保持不变
- 首页卡片按 `CATEGORIES` 中的主类目自动生成
- 主类目下的 `children` 会自动生成首页子目录小按钮
- `HOME_CONFIG` 控制首页品牌、标题和说明文字
- `homeDesc` 控制首页主类卡片说明
- `homeIcon` 可单独设置首页图标，未填写时使用主类 `icon`
- `homeImage` 可填写图片路径，例如 `images/home-camera.png`
- `homeColor` 可单独设置首页卡片主题色

新增或删除主类目、子类目后，首页会自动同步更新，不需要单独修改首页。
首页客服与二维码通过 `HOME_CONFIG.services` 修改：

    services: [
      {
        title: "在线租赁客服",
        hours: "早9:20—晚11:30",
        qr: "images/rental-service-qr.svg",
        qrText: "扫码联系租赁客服"
      }
    ]

- `title`：客服名称
- `hours`：客服时间
- `qr`：二维码图片路径
- `qrText`：二维码下方说明
- 可直接用真实二维码覆盖 `images/rental-service-qr.svg` 和 `images/after-sales-service-qr.svg`
### 子类独立教程内容

18 个子类都有各自独立的 `desc`、`keywords` 和 `steps`，集中位于 `js/data.js` 底部的 `SUBCATEGORY_CONTENT`：

    const SUBCATEGORY_CONTENT = {
      "gimbal-phone": {
        desc: "该子类说明",
        keywords: "该子类搜索关键词",
        steps: [ /* 该子类教程步骤 */ ]
      }
    }

- 修改对应 `id` 下的内容，只会影响该子类，不会影响同主类其他子类
- 点击上方任意子类按钮，右侧会直接切换到该子类的独立教程
- 点击下方子类教程卡片，同样打开该子类的独立教程
- 保持每个子类原有 `id` 不变，分享链接才能继续使用

### 目录展开与收纳

- 点击主类名称：筛选该主类，并自动展开它下面的子类
- 点击主类右侧箭头：只展开或收纳该主类，不改变当前筛选
- 点击「全部展开」：展开所有主类的子类
- 点击「全部收纳」：收起所有主类的子类，只保留主类按钮
- 下方教程列表按主类分组，子类教程卡片收纳在对应主类中
- 上方分类开关与下方主目录开关状态同步
- 点击教程或搜索结果时，对应主目录会自动展开

## 替换顶部 Logo 图片

1. 将 Logo 图片放到 `images` 文件夹
2. 打开 `js/data.js`
3. 修改 `SITE_CONFIG.logoImage`

    const SITE_CONFIG = {
      logo: "📘",
      logoImage: "images/你的Logo.png"
    };

- `logoImage` 有路径时优先显示图片
- `logoImage` 留空时继续显示 `logo` 中的 emoji
- 推荐使用透明背景 PNG、WebP 或 SVG
- 图片会自动适应顶部 Logo 方框，不会改变布局
## 相机租赁主题

- 主题覆盖文件：`css/rental-theme.css`
- 原基础样式：`css/style.css`
- 主题只调整颜色、阴影、圆角、卡片和布局，不修改教程数据
- 如需恢复原画风，删除两份 `index.html` 中的主题样式引用即可
- 如需继续调整主题，只修改 `css/rental-theme.css`
## 已有功能

- 商品列表 + 主类/子类折叠筛选 + 关键词搜索
- 点击商品查看教程，卡片有涟漪与上浮动画
- 教程步骤可折叠展开，带过渡动画
- 代码块一键复制
- 深浅主题切换（记忆在 localStorage）
- 顶部滚动进度条、回到顶部按钮
- 移动端抽屉式侧栏
- 支持 ?p=商品id 直接分享某个教程

## 部署

直接把整个 tutorial-site 文件夹上传到任意静态托管即可：
GitHub Pages、Vercel、Netlify、对象存储、虚拟主机等均可。

## 关于 index.html 里的 </script>

打包时，内嵌的 index.html 中原本的 script 结束标签被写成了 </script>，
下载时会自动还原成正常标签。如果你手动复制 index.html 内容，请把这两处
</script> 改回标准的 script 结束标签即可。

## 素材与版权说明

- 相机操作示意图为本项目原创 SVG 图，不使用官方说明书截图直接再分发。
- Insta360、佳能、Fotopro 等官方内容仅通过公开页面链接引用。
- 官方网站、品牌名称和商标归各自权利人所有。
- 用户自行上传的 Logo、二维码、图片和视频需确认拥有使用和公开传播权限。
- 如后续添加第三方素材，应优先使用明确允许免费使用和再分发的来源。
