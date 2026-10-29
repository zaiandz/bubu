# 设备租赁页（rental.html）交付说明

> 纯静态页面：HTML + CSS + 原生 JavaScript，无后端、无框架、无构建步骤。
> 部署时把 `rental.html`、`css/rental.css`、`js/rental-data.js`、`js/rental.js`、`images/rental/` 一起上传即可。

## 一、页面结构

| 区域 | 位置 | 说明 |
| --- | --- | --- |
| 顶栏 | 顶部固定 | 品牌 Logo、教程总览 / 设备目录（当前页）/ 客服支持、搜索框（`/` 聚焦）、深浅主题切换、联系客服按钮 |
| 首屏 Hero | 第 1 屏 | 标题 + 一句话卖点 + 两个转化按钮（立即咨询 / 浏览全部机型）+ 3 项数据背书（设备类目 / 在租型号 / 可选套餐）+ 右侧租赁流程卡（移动端隐藏） |
| 类目筛选条 | 吸顶 | 「全部 + 8 个类目」胶囊按钮，带型号数量；右侧显示当前结果数，筛选时出现「清除筛选」 |
| 机型列表 | 主体 | 按类目分组，每个型号一张**横板卡片**：左侧白底产品图，右侧品牌、型号、卖点、标签、2 条优点、「N 种套餐可选」与「选择套餐」按钮 |
| 客服支持 | 底部 | 两张客服卡（在线租赁客服 / 售后客服），二维码可点击放大 |
| 套餐弹窗 | 浮层 | 点击卡片弹出：白底产品图、型号、标签、**套餐切换标签（选中即显示该套餐的说明 / 适合场景 / 包含清单）**、核心参数表、产品优点、官方参数来源、咨询按钮 |

## 二、型号与品牌对应（12 个型号 / 25 个套餐）

每个型号只出现一次，套餐在弹窗内切换。下表列出套餐与首页 25 个型号的对应关系：

| 类目 | 型号卡片 | 可选套餐 | 对应首页型号 id |
| --- | --- | --- | --- |
| 手持云台 | Osmo Pocket 3（DJI） | 标准版 / 长续航版 / 全能套装 | gimbal-phone / gimbal-one / gimbal-two |
| 手持云台 | Osmo Pocket 4 Pro（DJI） | 标准套装 / 全能套装 | gimbal-pocket4pro-standard / gimbal-pocket4pro-combo |
| 运动相机 | Ace Pro 2（Insta360） | 标准版 / 街拍套装 / 挂脖套装 / 手持 Vlog 套装 | action-standard / action-street / action-neck / action-vlog |
| 全景相机 | Insta360 X6（Insta360） | 标准版 / 全能版 / 旅拍套装 | insta360-x6-standard / insta360-x6-allround / insta360-x6-travel |
| 微单相机 | 佳能 EOS R50（Canon） | 18-45mm / 18-150mm / F1.8 / 100-400mm | mirrorless-entry / mirrorless-plus / mirrorless-pro / mirrorless-one |
| 卡片相机 | G7 X Mark III（Canon） | 标准版 / 蓝牙自拍杆版 | compact-entry / compact-vlog |
| 卡片相机 | 佳能 G12（Canon） | 标准配置 | compact-g12 |
| 复古 CCD | IXUS 210（Canon） | 标准配置 | canon-ixus-210 |
| 复古 CCD | IXUS 130（Canon） | 标准配置 | canon-ixus-130 |
| 三脚架与配件 | 富图宝 FY-830（Fotopro） | 液压云台标准版 / 自选赠送配件 | tripod-live / tripod-cam |
| 数据找回 | SD 卡数据找回（SanDisk · Lexar） | 远程指导 | recovery-sd |
| 数据找回 | TF 卡数据找回（SanDisk · Lexar） | 远程指导 | recovery-tf |

合计：8 个类目、12 个基础型号、25 个可选套餐，覆盖首页全部 25 个型号，不多不少。

## 三、素材来源与合规

| 素材 | 来源 | 使用方式 |
| --- | --- | --- |
| 产品图（9 张） | 用户提供，位于 `images/products/<型号id>.png` | 统一处理为 **900×900 纯白背景**：清理原图浅灰分隔线/底色 → 按产品轮廓裁切 → 产品长边统一占画布 72%，页面中按 1:1 画框显示 |
| 产品图（3 张） | 本站自绘矢量图 `images/rental/` | 三脚架、SD 卡、TF 卡暂无实拍图，沿用自绘白底图（`python tools/gen-rental-art.py` 生成） |
| 客服二维码 | 站点既有 `images/客服售后二维码.jpg` | 与首页同源，点击放大 |
| 品牌 Logo 标记 | 站点既有 `images/logo-mark.png` | 自有素材 |

参数来源均为**品牌官方页面**，弹窗底部可点击跳转原文核对：

- DJI Osmo Pocket 3 技术参数：<https://www.dji.com/cn/osmo-pocket-3/specs>
- Insta360 Ace Pro 2 官方商城页：<https://store.insta360.com/cn/product/ace-pro-2>
- Insta360 X6 官方产品页：<https://www.insta360.com/cn/product/insta360-x6>
- 佳能 PowerShot G7 X Mark III（相机博物馆）：<https://global.canon/zh/c-museum/product/dcc884.html>
- 佳能 PowerShot G12（相机博物馆）：<https://global.canon/zh/c-museum/product/dcc596.html>
- 佳能 IXUS 210（相机博物馆）：<https://global.canon/zh/c-museum/product/dcc587.html>
- 佳能 EOS R50（佳能中国）：<https://www.canon.com.cn/product/eosr50/specification.html>
- 富图宝三脚架：<https://www.fotopro.cn/>
- SanDisk 官方恢复工具：<https://www.lc-tech.com/> ；Lexar：<https://www.lexar.com/>

合规说明：

1. 页面不复制品牌官方图片与文案，产品图为本站自绘线条图，参数为事实性数据并标注来源链接；
2. 未使用任何破解、盗版、序列号等违规内容；数据找回只给官方工具入口；
3. 页面底部注明「参数以品牌官方页面与实物为准」，避免误导；
4. 品牌名称与商标归各自权利人所有。

## 四、弹窗交互逻辑

1. 点击卡片（或键盘 Enter / 空格）→ 读取该卡片的 `data-id`；
2. `openModal(id)` 从 `RENTAL_DATA` 中查出对应型号，渲染弹窗内容（参数表 / 优点 / 包含 / 来源）；
3. 打开时给 `<body>` 加 `rt-modal-open` 锁定滚动，焦点移到关闭按钮；
4. 关闭方式：右上角 ×、点击遮罩、按 `Esc`、点击「咨询这台」后自动关闭并滚动到客服区；
5. 关闭后焦点回到触发卡片，保持键盘可访问；
6. 弹窗内「查看使用教程」跳到首页对应教程 `index.html?p=<id>`。

## 五、客服二维码嵌入方式

- 数据在 `js/rental-data.js` 的 `services` 数组，与首页 `HOME_CONFIG.services` 一致；
- 每张客服卡显示：服务名、在线时段、提示语、二维码图；
- 点击二维码弹出放大层（`.qr-preview`，复用站点样式），点任意处或按 Esc 关闭；
- 替换二维码只需替换 `images/客服售后二维码.jpg`，或修改 `services[].qr` 路径。

## 六、维护方式

- **加/减机型**：编辑 `js/rental-data.js` 中对应类目的 `items` 数组，`id` 必须与首页 `js/data.js` 一致；
- **背景不干净时**：`tools/process-product-images.py` 会自动清除浅灰分隔线与灰底，并把产品以外的区域刷成纯白，
  同时按“产品轮廓”而非“非白像素”裁切，因此原图带边线、淡阴影也不会影响成图；
- **换产品图**：把新图放进任意文件夹，改 `tools/process-product-images.py` 顶部的 `MAP`（源文件名 → 型号 id），
  运行 `python tools/process-product-images.py <图片目录>`，图片会自动统一成 900×900 白底并写入 `images/products/`；
- **改套餐**：型号对象的 `variants` 数组，每项含 `name`（套餐名）、`tag`、`hint`、`desc`、`suitable`、`includes`；
- **改参数/优点**：型号对象的 `specs`、`highlights`、`scene`、`art` 字段；
- **改客服信息**：`services` 数组；
- **改配色**：类目 `accent` 字段同时控制该组卡片的点缀色与弹窗主题色；
- 修改后无需构建，刷新页面即生效。

## 七、自检清单

- [x] 纯静态：无后端请求、无框架依赖，仅 2 个本地 JS 文件 + 2 个本地 CSS 文件
- [x] 型号品牌与首页一致：12 个型号的 25 个套餐完整覆盖首页 25 个型号
- [x] 每个型号只出现一次，套餐在弹窗内切换
- [x] 产品图统一白底
- [x] 每个型号有图、有优点、有参数
- [x] 点击弹出参数详情，仅前端实现；支持键盘与 Esc
- [x] 客服二维码模块在位，并能放大查看
- [x] 响应式：1440 / 1100 / 900 / 600 四档，移动端弹窗为底部抽屉式
- [x] 深浅主题与教程页共用 localStorage，切换一致
- [x] 首页顶栏「设备目录」已指向 `rental.html`
- [x] 无控制台报错、无破图

## 八、微信加好友（咨询这台）

### 需求前提
微信没有提供「一键打开添加好友页面」的公开链接，纯静态网站无法直接跳转到好友页。
所以采用业界通用做法：**点击后在页面内展示微信二维码，手机长按识别、电脑直接扫码添加**。

### 交互流程
1. 点击卡片 → 选择套餐 → 点击「咨询这台」；
2. 弹窗原地切换为「加微信，聊租赁」视图（不关闭、不跳页）：
   - 顶部：微信加好友徽标 + 「‹ 返回参数」；
   - 中部：200×200 二维码卡片（`-webkit-touch-callout: default`，允许手机长按识别），点击可全屏放大；
   - **联系方式行**：微信号 `z310sr`、手机号 `13671963506`，每行右侧「复制」按钮，点击即复制并提示；
   - 步骤：① 打开微信扫一扫 ② 手机长按识别 / 电脑扫码 ③ 也可直接搜索微信号或拨打电话；
   - 底部：自动生成咨询话术（含已选型号 + 套餐），可一键复制；
3. 「返回参数」回到原弹窗，且保留刚才选中的套餐；
4. Esc / × / 点击遮罩均可关闭。

### 替换成你的个人微信二维码
编辑 `js/rental-data.js` 顶部的 `wechat` 字段：

```js
wechat: {
  name: "视感闪租 · 租赁顾问",      // 显示在二维码下方的名称
  wechatId: "z310sr",              // 微信号（不填则不显示这一行）
  phone: "13671963506",            // 手机号（不填则不显示这一行）
  qr: "images/客服售后二维码.jpg",  // 改成你的二维码路径
  tip: "长按二维码识别，或在微信里扫码添加好友"
}
```

把二维码图片（建议 600×600 白底正方形）放进 `images/`，再把 `qr` 指过去即可，无需改 JS。

### 复制功能的兼容处理
- 优先使用 `document.execCommand('copy')`，同步返回结果，点击后立即提示「已复制」；
- 若浏览器禁用复制（部分 HTTP 环境 / 沙箱预览），自动**选中咨询文字**并提示「按 Ctrl+C 或长按复制」；
- 同时后台尝试 `navigator.clipboard`，成功则补一次「已复制」提示。

微信号、手机号同样走这套逻辑：复制成功提示「微信号已复制：z310sr」，失败则自动选中该号码并提示手动复制。
所有可复制内容都由 `data-copy` 属性驱动，新增条目只需改 `wechat` 配置，无需改 JS。

## 九、首页教程总览排版（2026-10 改版）

### 改动内容
- **两列大卡片**：原来是三列（卡片仅 291px 宽，标题折行、型号名截断）；现改为两列（约 440px），信息更舒展。
- **卡片结构**：左侧 60px 类目色图标（淡色底 + 描边）→ 中间品牌 / 主标题 19px / 副标题（自动补品牌前缀）/ 一句话描述 → 右侧大号篇数与圆形进入按钮。
- **型号清单**：改为带分隔线的双列网格，悬停显示类目色箭头；名称较长的类目（如微单四支镜头）自动切换单列，保证完整可读。
- **顶部类目色条**：悬停时从 28% 展开到 100%，卡片上浮并加深阴影。
- **清单模式**：重写为「图标 + 标题/副标题 + 描述 + 篇数」单行布局，小屏自动隐藏描述。

### 副标题修复
原来主标题取 `cat.short`、副标题取 `fullLabel` 剩余部分，导致出现孤立的「· Pocket 系列」。
现在副标题会自动补上品牌前缀，显示为「DJI · Pocket 系列」。

### 相关文件
- 样式：`css/style.css` 中 `.home-grid` / `.home-card` / `.home-sub-*` / `.home-grid.as-table` 段
- 渲染：`js/app.js` 的 `renderHome()`
- 改完执行 `python tools/build-variants.py --data-only` 同步到三个方案

## 十、首页入口按钮与设备目录页的衔接

### 改动
首页首屏「浏览设备目录」按钮原先只是滚动到本页 `#categories` 区块（首页自己的类目速览），
现在改为**直接打开设备目录页 `rental.html`**，与顶栏「设备目录」保持一致。

| 位置 | 链接 |
| --- | --- |
| 首页 `index.html` 顶栏「设备目录」 | `rental.html` |
| 首页 `index.html` 首屏「浏览设备目录」 | `rental.html` |
| 方案页 `variants/*/index.html` 顶栏与首屏按钮 | `../../rental.html` |

设备目录页的返回入口：左上角 Logo 与顶栏「教程总览」都指向 `index.html`。

### 构建脚本处理
`tools/build-variants.py` 的 `page()` 新增 `rental` 参数（默认 `rental.html`），
`v1() / v2() / v3()` 内定义 `rental = "../../rental.html"`，顶栏与首屏按钮统一使用该变量，
重新生成不会把链接改回锚点。注意 `home_sections` 需为 f-string 才能解析变量。

## 十一、2026-10 细节调整

### 1. 移除「合作品牌」统计项
首屏数据背书由 4 项改为 3 项：设备类目 / 在租型号 / 可选套餐。
改动位置：`js/rental.js` 的 `renderStats()`（同时删除了不再需要的 brands 统计代码）。

### 2. 「咨询这台」不再引起页面滚动
之前点击会触发页面级兜底监听的 `goSupport()`，把页面滚到客服区，与「弹窗内切换微信视图」的设计冲突。

现在：
- 移除页面级 `data-support` 兜底监听（该按钮只存在于弹窗内）；
- 打开弹窗、关闭弹窗时聚焦按钮均使用 `focus({ preventScroll: true })`，避免浏览器为聚焦而滚动页面；
- 实测：打开弹窗、切到微信视图、点「返回参数」、关闭弹窗，滚动位置全程不变（900 / 1500 等位置均验证）。
