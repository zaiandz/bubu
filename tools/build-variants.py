# -*- coding: utf-8 -*-
"""
生成三个企业级 UI 版本：
  variants/v1-professional  （方案一 · 企业专业蓝：顶部导航 + 深色侧边目录 + 数据总览首页）
  variants/v2-dark-lite     （方案二 · 深色精简工作台：深色顶栏 + 搜索优先首页 + 紧凑列表）
  variants/v3-editorial     （方案三 · 资料库编辑风：品牌色顶栏 + 大卡片首页 + 双栏阅读）

三个版本共用：
  - 同一份数据层 js/data.js（只优化目录树，不改教程正文）
  - 同一份交互层 js/app.js（渲染逻辑与首页变体）
只替换 index.html 与 css/style.css。

运行：python tools/build-variants.py
"""
import os
import sys
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DATA = os.path.join(ROOT, "js", "data.js")

# ---------------------------------------------------------------- 目录整理
# 旧分类值 -> 新分类（None 表示该旧分类下的内容按子目录逐项迁入新树）
CATEGORY_RULES = [
    # ---- 新主分类（用新值替换旧值） ----
    ("手持云台相机", "手持云台 · Pocket 系列"),
    ("全景相机", "全景相机 · Insta360 X 系列"),
    ("微单相机", "微单相机 · 佳能 RF 卡口"),
    ("落地三脚架", "三脚架 · 云台与配件"),
    ("内存卡数据找回", "内存卡数据找回"),
    ("运动相机", "运动相机 · Insta360 Ace 系列"),
    ("卡片相机", "卡片相机 · 佳能 G 系列"),
    ("CCD相机", "复古 CCD 相机 · 佳能 IXUS 系列"),
]

FLAT_GROUP_RENAME = {
    "手持云台相机": "手持云台相机",
    "运动相机": "运动相机",
    "微单相机": "微单相机",
    "卡片相机": "卡片相机",
    "落地三脚架": "落地三脚架",
    "CCD相机": "CCD相机",
}

CHILD_RENAME = {
    "gimbal-phone": "Osmo Pocket 3 标准版",
    "gimbal-one": "Osmo Pocket 3 长续航版",
    "gimbal-two": "Osmo Pocket 3 全能套装",
    "gimbal-pocket4pro-standard": "Osmo Pocket 4 Pro 标准套装",
    "gimbal-pocket4pro-combo": "Osmo Pocket 4 Pro 全能套装",
    "action-standard": "Ace Pro 2 标准版",
    "action-street": "Ace Pro 2 街拍套装",
    "action-neck": "Ace Pro 2 挂脖套装",
    "action-vlog": "Ace Pro 2 手持 Vlog 套装",
    "insta360-x6-standard": "Insta360 X6 标准版",
    "insta360-x6-allround": "Insta360 X6 全能版",
    "insta360-x6-travel": "Insta360 X6 旅拍套装",
    "mirrorless-entry": "佳能微单 + 18-45mm 入门套机",
    "mirrorless-plus": "佳能微单 + 18-150mm 风光变焦",
    "mirrorless-pro": "佳能微单 + F1.8 人像镜头",
    "mirrorless-one": "佳能微单 + 100-400mm 超远摄",
    "compact-entry": "佳能 G7 X Mark III 标准版",
    "compact-vlog": "佳能 G7 X Mark III 蓝牙自拍杆版",
    "canon-ixus-210": "佳能 IXUS 210 复古 CCD",
    "canon-ixus-130": "佳能 IXUS 130 复古 CCD",
    "tripod-live": "富图宝 FY-830 + MH-4A 液压云台版",
    "tripod-cam": "富图宝 FY-830 可自选赠送配件",
    "recovery-sd": "SD 卡数据找回",
    "recovery-tf": "TF 卡数据找回",
}

NEW_CATEGORIES = '''const CATEGORIES = [
  { value: "all", label: "全部教程" },
  {
    value: "手持云台 · Pocket 系列",
    label: "手持云台 · Pocket 系列",
    short: "手持云台",
    brand: "DJI",
    homeDesc: "三轴机械防抖，Vlog 与旅拍随身影视机",
    icon: "🎥",
    iconImage: "images/category-icons/gimbal-camera.svg",
    children: [
      { id: "gimbal-phone",  value: "大疆pocket3标准版",   label: "大疆pocket3标准版",   icon: "📱", iconImage: "images/category-icons/children/pocket3-standard.svg" },
      { id: "gimbal-one",  value: "大疆pocket3长续航版",   label: "大疆pocket3长续航版",   icon: "📱", iconImage: "images/category-icons/children/pocket3-long-battery.svg" },
      { id: "gimbal-two",  value: "大疆pocket3全能版",   label: "大疆pocket3全能版",   icon: "📱", iconImage: "images/category-icons/children/pocket3-creator.svg" },
      { id: "gimbal-pocket4pro-standard", value: "大疆Pocket 4 Pro标准套装", label: "大疆Pocket 4 Pro标准套装", icon: "📱", iconImage: "images/category-icons/children/pocket4pro-standard.svg" },
      { id: "gimbal-pocket4pro-combo", value: "大疆Pocket 4 Pro全能套装", label: "大疆Pocket 4 Pro全能套装", icon: "📱", iconImage: "images/category-icons/children/pocket4pro-combo.svg" }
    ]
  },
  {
    value: "运动相机 · Insta360 Ace 系列",
    label: "运动相机 · Insta360 Ace 系列",
    short: "运动相机",
    brand: "Insta360",
    homeDesc: "防水耐摔，第一视角记录户外与运动瞬间",
    icon: "🎿",
    iconImage: "images/category-icons/action-camera.svg",
    children: [
      { id: "action-standard", value: "影石ACEPro2",       label: "影石ACEpro2",       icon: "🎿", iconImage: "images/category-icons/children/acepro2-standard.svg" },
      { id: "action-street", value: "影石ACEPro2街拍套装",       label: "影石ACEpro2街拍套装",       icon: "🎿", iconImage: "images/category-icons/children/acepro2-street.svg" },
      { id: "action-neck", value: "影石ACEPro2挂脖套装",       label: "影石ACEpro2挂脖套装",       icon: "🎿", iconImage: "images/category-icons/children/acepro2-neck.svg" },
      { id: "action-vlog", value: "影石ACEPro2手持vlog套装",       label: "影石ACEpro2手持vlog套装",       icon: "🎿", iconImage: "images/category-icons/children/acepro2-vlog.svg" }
    ]
  },
  {
    value: "全景相机 · Insta360 X 系列",
    label: "全景相机 · Insta360 X 系列",
    short: "全景相机",
    brand: "Insta360",
    homeDesc: "360° 全景记录，旅行、运动与创意拍摄",
    icon: "🌐",
    iconImage: "images/category-icons/panorama-camera.svg",
    children: [
      { id: "insta360-x6-standard", value: "影石Insta360 X6标准版", label: "影石Insta360 X6标准版", icon: "🌐", iconImage: "images/category-icons/children/x6-standard.svg" },
      { id: "insta360-x6-allround", value: "影石Insta360 X6全能版", label: "影石Insta360 X6全能版", icon: "🎒", iconImage: "images/category-icons/children/x6-allround.svg" },
      { id: "insta360-x6-travel", value: "影石Insta360 X6旅拍套装", label: "影石Insta360 X6旅拍套装", icon: "✈️", iconImage: "images/category-icons/children/x6-travel.svg" }
    ]
  },
  {
    value: "微单相机 · 佳能 RF 卡口",
    label: "微单相机 · 佳能 RF 卡口",
    short: "微单相机",
    brand: "Canon",
    homeDesc: "APS-C 画质机身搭配可换镜头，人像旅拍通用",
    icon: "📷",
    iconImage: "images/category-icons/mirrorless-camera.svg",
    children: [
      { id: "mirrorless-entry", value: "佳能微单+18-45mm入门套镜头", label: "佳能微单+18-45mm入门套镜头", icon: "🎬", iconImage: "images/category-icons/children/mirrorless-18-45.svg" },
      { id: "mirrorless-plus",  value: "佳能微单+18-150mm风光变焦镜头", label: "佳能微单+18-150mm风光变焦镜头", icon: "📷", iconImage: "images/category-icons/children/mirrorless-18-150.svg" },
      { id: "mirrorless-pro",   value: "佳能微单+F1.8人像大光圈镜头", label: "佳能微单+F1.8人像大光圈镜头", icon: "🎞️", iconImage: "images/category-icons/children/mirrorless-f18.svg" },
      { id: "mirrorless-one",   value: "佳能微单+超远摄100-400mm", label: "佳能微单+超远摄100-400mm", icon: "🔍", iconImage: "images/category-icons/children/mirrorless-100-400.svg" }
    ]
  },
  {
    value: "卡片相机 · 佳能 G 系列",
    label: "卡片相机 · 佳能 G 系列",
    short: "卡片相机",
    brand: "Canon",
    homeDesc: "口袋机身即开即拍，旅行与日常随手记录",
    icon: "📸",
    iconImage: "images/category-icons/compact-camera.svg",
    children: [
      { id: "compact-entry", value: "佳能卡片相机标准版", label: "佳能卡片相机标准版", icon: "📸", iconImage: "images/category-icons/children/compact-standard.svg" },
      { id: "compact-vlog",  value: "佳能无线蓝牙自拍杆版", label: "佳能无线蓝牙自拍杆版", icon: "🎥", iconImage: "images/category-icons/children/compact-selfie.svg" },
      { id: "compact-g12",   value: "佳能G12卡片相机", label: "佳能G12卡片相机", icon: "📷", iconImage: "images/category-icons/children/compact-standard.svg" }
    ]
  },
  {
    value: "复古 CCD 相机 · 佳能 IXUS 系列",
    label: "复古 CCD 相机 · 佳能 IXUS 系列",
    short: "复古 CCD",
    brand: "Canon",
    homeDesc: "千禧年复古色彩，氛围感照片与胶片质感",
    icon: "📻",
    iconImage: "images/category-icons/ccd-camera.svg",
    children: [
      { id: "canon-ixus-210", value: "佳能IXU210复古CCD相机", label: "佳能IXU210复古CCD相机", icon: "📸", iconImage: "images/category-icons/children/ccd-210.svg" },
      { id: "canon-ixus-130", value: "佳能IXU130复古CCD相机", label: "佳能IXU130复古CCD相机", icon: "📷", iconImage: "images/category-icons/children/ccd-130.svg" }
    ]
  },
  {
    value: "三脚架 · 云台与配件",
    label: "三脚架 · 云台与配件",
    short: "脚架配件",
    brand: "Fotopro",
    homeDesc: "液压云台稳定支撑，直播、合影与长曝光必备",
    icon: "🔭",
    iconImage: "images/category-icons/tripod.svg",
    children: [
      { id: "tripod-live",  value: "富宝图FY-830-MH-4A液压云台标准版",   label: "富宝图FY-830-MH-4A液压云台标准版",   icon: "📱", iconImage: "images/category-icons/children/tripod-hydraulic.svg" },
      { id: "tripod-cam",   value: "富宝图FY-830-MH-4A所含配件可自选赠送使用",   label: "富宝图FY-830-MH-4A所含配件可自选赠送使用",   icon: "📷", iconImage: "images/category-icons/children/tripod-accessories.svg" }
    ]
  },
  {
    value: "内存卡数据找回",
    label: "内存卡数据找回",
    short: "数据找回",
    brand: "SanDisk · Lexar",
    homeDesc: "误删或格式化后，按官方工具流程尝试找回",
    icon: "💾",
    iconImage: "images/category-icons/memory-recovery.svg",
    children: [
      { id: "recovery-sd",   value: "SD 卡",       label: "SD 卡",       icon: "💾", iconImage: "images/category-icons/children/recovery-sd.svg" },
      { id: "recovery-tf",   value: "TF 卡",       label: "TF 卡",       icon: "📱", iconImage: "images/category-icons/children/recovery-tf.svg" }
    ]
  }
];
'''

# 在首页/侧栏中展示的短标题（只改显示，不改 id 与教程内容）
CHILD_LABEL_OVERRIDE = {
    "gimbal-phone": "Pocket 3 标准版",
    "gimbal-one": "Pocket 3 长续航版",
    "gimbal-two": "Pocket 3 全能套装",
    "gimbal-pocket4pro-standard": "Pocket 4 Pro 标准套装",
    "gimbal-pocket4pro-combo": "Pocket 4 Pro 全能套装",
    "action-standard": "Ace Pro 2 标准版",
    "action-street": "Ace Pro 2 街拍套装",
    "action-neck": "Ace Pro 2 挂脖套装",
    "action-vlog": "Ace Pro 2 手持 Vlog 套装",
    "insta360-x6-standard": "Insta360 X6 标准版",
    "insta360-x6-allround": "Insta360 X6 全能版",
    "insta360-x6-travel": "Insta360 X6 旅拍套装",
    "mirrorless-entry": "佳能微单 + 18-45mm 入门套机",
    "mirrorless-plus": "佳能微单 + 18-150mm 风光变焦",
    "mirrorless-pro": "佳能微单 + F1.8 人像镜头",
    "mirrorless-one": "佳能微单 + 100-400mm 超远摄",
    "compact-entry": "G7 X Mark III 标准版",
    "compact-vlog": "G7 X Mark III 蓝牙自拍杆版",
    "canon-ixus-210": "IXUS 210 复古 CCD",
    "canon-ixus-130": "IXUS 130 复古 CCD",
    "tripod-live": "FY-830 液压云台标准版",
    "tripod-cam": "FY-830 自选赠送配件",
    "recovery-sd": "SD 卡数据找回",
    "recovery-tf": "TF 卡数据找回",
}


def transform_data(src):
    """按结构改写 js/data.js。

    可重复执行：先移除本脚本之前写入的配置行，再按块写入，
    因此对已经生成过的文件再跑一次也不会重复。
    """
    out = src

    # 0) 清理上一次生成时写入的行，保证脚本可重复执行
    out = re.sub(r"\n  // logo-mark 为从方形 Logo 中裁出的图形标记[^\n]*", "", out)
    out = re.sub(r"\n  logoIcon: \"images/logo-mark\.png\",", "", out)
    out = re.sub(r"\n  brandSub: \"[^\"]*\",", "", out)
    out = re.sub(r"\n  kicker: \"[^\"]*\",", "", out)
    out = re.sub(r"\n  stats: \[.*?\n  \],", "", out, count=1, flags=re.S)

    # 1) 站点基础配置：品牌、副标题、Logo 图标、搜索提示
    out = re.sub(
        r'(?<!\nconst HOME_CONFIG = \{\n)(\n  brand: ")[^"]*(",)',
        lambda m: m.group(1) + "视感闪租" + m.group(2) + '\n  brandSub: "设备使用教程中心",',
        out,
        count=1,
    )
    out = re.sub(
        r'(\n  logoImage: ")',
        '\n  // logo-mark 为从方形 Logo 中裁出的图形标记；如需整张图可改回 images/视感闪租 LOGO-02.jpg'
        '\n  logoIcon: "images/logo-mark.png",\\1',
        out,
        count=1,
    )
    out = re.sub(r'(\n  searchPlaceholder: ")[^"]*(",)', r"\1搜索设备、型号或教程关键词…\2", out, count=1)

    # 2) 首页配置：品牌、眉标、主副标题与统计项
    out = re.sub(r'(\nconst HOME_CONFIG = \{\n  brand: ")[^"]*(",)', r"\1视感闪租\2", out, count=1)
    out = re.sub(
        r'(\nconst HOME_CONFIG = \{\n  brand: "[^"]*",\n)(  title: ")[^"]*(",\n  subtitle: ")[^"]*(",)',
        lambda m: m.group(1)
        + '  kicker: "视感闪租 · 设备使用教程中心",\n'
        + m.group(2) + "设备使用教程中心" + m.group(3)
        + "按设备类目检索图文与视频教程，覆盖开箱、开机、拍摄模式、素材导出与售后排查全流程。" + m.group(4)
        + "[HOME_STATS]",
        out,
        count=1,
    )
    stats = (
        "\n  stats: [\n"
        '    { key: "categories", label: "设备类目" },\n'
        '    { key: "tutorials", label: "在线教程" },\n'
        '    { key: "steps", label: "操作步骤" },\n'
        '    { key: "media", label: "图示视频" }\n'
        "  ],"
    )
    out = out.replace("[HOME_STATS]", stats)

    # 3) 替换分类树：从 const CATEGORIES 开始，到紧随其后的第一个独立 "];" 为止
    out = re.sub(
        r"const CATEGORIES = \[.*?\n\];",
        lambda m: NEW_CATEGORIES.rstrip("\n"),
        out,
        count=1,
        flags=re.S,
    )

    # 0.1) 子目录不再引用位图图标：侧栏与卡片已使用内置线条图标
    #      （lineIconFor / childIconFor），删除 children 中的 iconImage 字段
    out = re.sub(r',\s*iconImage: "[^"]*/children/[^"]*"', "", out)

    # 4) 主类名称同步为新分类
    for old, new in CATEGORY_RULES:
        if new == old:
            continue
        out = re.sub(r'(\n    name: ")' + re.escape(old) + r'",', r"\1" + new + '",', out)
        out = out.replace('category: "%s"' % old, 'category: "%s"' % new)
        out = out.replace('keywords: "%s' % old, 'keywords: "%s' % new)

    # 5) 子目录显示名（label）改为精简名称；name 字段保持不变，作为教程完整标题
    for cid, label in CHILD_LABEL_OVERRIDE.items():
        out = re.sub(
            r'(\{ id: "' + re.escape(cid) + r'",\s*value: "[^"]*",\s*label: ")[^"]*(")',
            lambda m: m.group(1) + label + m.group(2),
            out,
        )

    return out


# ---------------------------------------------------------------- 页面：
# 单个模式（单选目录树 / 卡片列表）、导航、首页变体

HTML_COMMENT_STYLE = "  <!-- 此页面由 tools/build-variants.py 生成；数据与交互统一来自 js/data.js、js/app.js -->\n"


def page(head_title, body_class, header, layout, home_sections, modal_head, css, rental="rental.html"):
    return f'''<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>{head_title}</title>
  <meta name="description" content="视感闪租设备使用教程中心：按设备类目检索相机、云台、运动相机、脚架与数据找回教程。" />
  <link rel="stylesheet" href="{css}" />
</head>
<body class="{body_class}">
{HTML_COMMENT_STYLE}
{header}

  <div class="layout">

    <aside class="sidebar" id="sidebar">
      {modal_head}
    </aside>

    <main class="content" id="content">
      <section class="home" id="home" hidden>
{home_sections}
      </section>

      <div class="empty" id="empty">
        <div class="empty-icon">◎</div>
        <h2>请从左侧选择设备</h2>
        <p>选中任意设备即可查看对应的完整使用教程</p>
      </div>
      <article class="detail" id="detail" hidden></article>

      <footer class="site-foot">
        <span>© 视感闪租 · 设备使用教程中心</span>
        <span>教程内容持续更新，如有疑问请联系客服</span>
      </footer>
    </main>

  </div>

  <div class="mask" id="mask"></div>
  <div class="toast" id="toast"><span class="toast-dot"></span><span class="toast-text"></span></div>
  <button class="to-top" id="toTop" aria-label="回到顶部" title="回到顶部">
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 19V5m0 0l-6 6m6-6l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>
  <div class="page-loader" id="pageLoader"><span></span></div>

  <script>
    /* 首帧主题：避免深浅主题闪烁 */
    (function () {{
      try {{
        var t = localStorage.getItem("tutorial-site-theme");
        var d = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.dataset.theme = t || (d ? "dark" : "light");
      }} catch (e) {{}}
    }})();
  </script>
  <script src="js/illustrations.js"></script>
  <script src="js/data.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
'''


SEARCH_INPUT = '<input id="searchInput" type="search" placeholder="搜索设备、型号或教程关键词…" autocomplete="off" />'

ICON_SEARCH = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
ICON_MOON = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>'
ICON_SUN = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
ICON_MENU = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>'


# ------------------------------- V1 企业专业蓝
def v1():
    # 设备目录页位于站点根目录，方案页需回退两级
    rental = "../../rental.html"
    header = f'''  <header class="topbar">
    <div class="topbar-inner">
      <button class="icon-btn menu-btn" id="menuToggle" aria-label="打开设备目录">{ICON_MENU}</button>

      <div class="brand" aria-label="视感闪租">
        <span class="brand-logo"></span>
        <span class="brand-text">视感闪租</span>
        <span class="brand-sub">设备使用教程中心</span>
      </div>

      <nav class="topnav" aria-label="主导航">
        <a class="topnav-link" href="#home" data-home-link>教程总览</a>
        <a class="topnav-link" href="{rental}">设备目录</a>
        <a class="topnav-link" href="#services">客服支持</a>
      </nav>

      <label class="search search-top">
        <span class="search-icon">{ICON_SEARCH}</span>
        {SEARCH_INPUT}
        <kbd class="search-kbd">/</kbd>
      </label>

      <div class="topbar-actions">
        <button class="icon-btn theme-toggle" id="themeToggle" aria-label="切换深浅主题" title="切换主题">
          <span class="theme-icon-light">{ICON_MOON}</span>
          <span class="theme-icon-dark">{ICON_SUN}</span>
        </button>
        <button class="btn-help" type="button" data-scroll="#services">联系客服</button>
      </div>
    </div>
    <div class="scroll-progress" id="scrollProgress"></div>
  </header>'''

    modal_head = '''<div class="sidebar-mobile-head">
        <span>设备目录</span>
        <button type="button" class="sidebar-close" id="sidebarClose" aria-label="关闭目录">×</button>
      </div>
      <div class="sidebar-head">
        <div class="tree-mode-switch" role="tablist" aria-label="目录显示方式">
          <button class="tree-mode-btn active" type="button" data-view="tree" role="tab" aria-selected="true">目录树</button>
          <button class="tree-mode-btn" type="button" data-view="list" role="tab" aria-selected="false">卡片列表</button>
        </div>
        <span class="badge" id="resultCount">0</span>
      </div>
      <div class="category-bar" id="categoryBar" data-mode="tree"></div>
      <div class="card-list" id="cardList"></div>'''

    home_sections = f'''        <section class="hero">
          <div class="hero-main">
            <span class="eyebrow" id="homeKicker">视感闪租</span>
            <h1 class="home-title" id="homeTitle">设备使用教程中心</h1>
            <p class="home-subtitle" id="homeSubtitle">选择下方目录，快速查看对应设备的使用教程</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="{rental}">浏览设备目录</a>
              <a class="btn btn-outline" href="#services">联系客服支持</a>
            </div>
          </div>
          <div class="hero-panel" aria-label="教程数据概览">
            <div class="hero-panel-title">常见操作指引</div>
            <ol class="hero-tips">
              <li>开箱先核对配件，再开机</li>
              <li>导出素材优先使用官方 App</li>
              <li>收纳前请先完整关机</li>
              <li>异常情况第一时间联系售后</li>
            </ol>
          </div>
        </section>

        <section class="stat-row" id="statRow" aria-label="教程数据统计"></section>

        <section class="block" id="services">
          <div class="block-head">
            <h2 class="block-title">客服支持</h2>
            <p class="block-desc">租前咨询与售后处理通道，扫码即可接入</p>
          </div>
          <div class="home-services" id="homeServices"></div>
        </section>

        <section class="block" id="categories">
          <div class="block-head">
            <h2 class="block-title">设备目录</h2>
            <p class="block-desc">按设备类型进入，找到对应型号的教程</p>
            <div class="block-tools">
              <button class="seg-btn active" type="button" data-home-layout="grid">网格</button>
              <button class="seg-btn" type="button" data-home-layout="table">清单</button>
            </div>
          </div>
          <div class="home-grid" id="homeGrid"></div>
        </section>'''

    return page(
        "视感闪租 · 设备使用教程中心",
        "variant-v1",
        header,
        None,
        home_sections,
        modal_head,
        "css/style.css",
        "../../rental.html",
    )


# ------------------------------- V2 深色精简工作台
def v2():
    # 设备目录页位于站点根目录，方案页需回退两级
    rental = "../../rental.html"
    header = f'''  <header class="topbar">
    <div class="topbar-inner">
      <button class="icon-btn menu-btn" id="menuToggle" aria-label="打开设备目录">{ICON_MENU}</button>

      <div class="brand" aria-label="视感闪租">
        <span class="brand-logo"></span>
        <span class="brand-text">视感闪租</span>
        <span class="brand-sub">教程工作台</span>
      </div>

      <nav class="topnav" aria-label="主导航">
        <a class="topnav-link" href="#home" data-home-link>首页</a>
        <a class="topnav-link" href="{rental}">设备目录</a>
        <a class="topnav-link" href="#services">客服</a>
      </nav>

      <div class="topbar-actions">
        <button class="icon-btn theme-toggle" id="themeToggle" aria-label="切换深浅主题" title="切换主题">
          <span class="theme-icon-light">{ICON_MOON}</span>
          <span class="theme-icon-dark">{ICON_SUN}</span>
        </button>
      </div>
    </div>
    <div class="scroll-progress" id="scrollProgress"></div>
  </header>'''

    modal_head = '''<div class="sidebar-mobile-head">
        <span>设备目录</span>
        <button type="button" class="sidebar-close" id="sidebarClose" aria-label="关闭目录">×</button>
      </div>
      <div class="sidebar-head">
        <span class="sidebar-title">设备目录</span>
        <span class="badge" id="resultCount">0</span>
      </div>
      <div class="category-bar" id="categoryBar" data-mode="list"></div>
      <div class="card-list" id="cardList"></div>'''

    home_sections = '''        <section class="hero">
          <div class="hero-brand" id="homeKicker">视感闪租</div>
          <h1 class="home-title" id="homeTitle">搜索你的设备</h1>
          <p class="home-subtitle" id="homeSubtitle">输入型号或关键词，直接定位教程</p>
          <label class="search search-hero">
            <span class="search-icon">{SEARCH_ICON}</span>
            {SEARCH_INPUT_HERO}
          </label>
          <div class="hero-meta" id="statRow"></div>
        </section>

        <section class="block" id="categories">
          <div class="block-head">
            <h2 class="block-title">按设备类型浏览</h2>
          </div>
          <div class="home-grid" id="homeGrid"></div>
        </section>

        <section class="block" id="services">
          <div class="block-head">
            <h2 class="block-title">客服支持</h2>
          </div>
          <div class="home-services" id="homeServices"></div>
        </section>'''

    home_sections = home_sections.replace("{SEARCH_ICON}", ICON_SEARCH).replace(
        "{SEARCH_INPUT_HERO}",
        '<input id="searchInput" type="search" placeholder="搜索设备、型号或教程关键词…" autocomplete="off" />',
    )

    return page(
        "视感闪租 · 教程工作台",
        "variant-v2",
        header,
        None,
        home_sections,
        modal_head,
        "css/style.css",
        "../../rental.html",
    )


# ------------------------------- V3 资料库编辑风
def v3():
    # 设备目录页位于站点根目录，方案页需回退两级
    rental = "../../rental.html"
    header = f'''  <header class="topbar">
    <div class="topbar-inner">
      <button class="icon-btn menu-btn" id="menuToggle" aria-label="打开设备目录">{ICON_MENU}</button>

      <div class="brand" aria-label="视感闪租">
        <span class="brand-logo"></span>
        <span class="brand-lockup">
          <span class="brand-text">视感闪租</span>
          <span class="brand-sub">设备使用教程库</span>
        </span>
      </div>

      <nav class="topnav" aria-label="主导航">
        <a class="topnav-link" href="#home" data-home-link>教程库首页</a>
        <a class="topnav-link" href="{rental}">设备目录</a>
        <a class="topnav-link" href="#services">客服</a>
      </nav>

      <label class="search search-top">
        <span class="search-icon">{ICON_SEARCH}</span>
        {SEARCH_INPUT}
      </label>

      <div class="topbar-actions">
        <button class="icon-btn theme-toggle" id="themeToggle" aria-label="切换深浅主题" title="切换主题">
          <span class="theme-icon-light">{ICON_MOON}</span>
          <span class="theme-icon-dark">{ICON_SUN}</span>
        </button>
      </div>
    </div>
    <div class="scroll-progress" id="scrollProgress"></div>
  </header>'''

    modal_head = '''<div class="sidebar-mobile-head">
        <span>教程目录</span>
        <button type="button" class="sidebar-close" id="sidebarClose" aria-label="关闭目录">×</button>
      </div>
      <div class="sidebar-head">
        <span class="sidebar-title">教程目录</span>
        <span class="badge" id="resultCount">0</span>
      </div>
      <div class="category-bar" id="categoryBar" data-mode="tree"></div>
      <div class="card-list" id="cardList"></div>'''

    home_sections = '''        <section class="hero">
          <div class="hero-main">
            <span class="eyebrow" id="homeKicker">视感闪租</span>
            <h1 class="home-title" id="homeTitle">设备使用教程库</h1>
            <p class="home-subtitle" id="homeSubtitle">选择下方目录，快速查看对应设备的使用教程</p>
          </div>
          <aside class="hero-aside" id="heroAside" aria-label="教程数据"></aside>
        </section>

        <section class="block" id="categories">
          <div class="block-head">
            <span class="block-index">01</span>
            <div>
              <h2 class="block-title">设备类目</h2>
              <p class="block-desc">共 8 个类目，按品牌与系列划分</p>
            </div>
          </div>
          <div class="home-grid" id="homeGrid"></div>
        </section>

        <section class="block" id="services">
          <div class="block-head">
            <span class="block-index">02</span>
            <div>
              <h2 class="block-title">客服支持</h2>
              <p class="block-desc">租前咨询与售后处理</p>
            </div>
          </div>
          <div class="home-services" id="homeServices"></div>
        </section>'''

    return page(
        "视感闪租 · 设备使用教程库",
        "variant-v3",
        header,
        None,
        home_sections,
        modal_head,
        "css/style.css",
        "../../rental.html",
    )


def prefix_images(content):
    """方案页面位于 variants/<方案名>/，图片在站点根目录 images/。
    生成时统一把 "images/" 前缀改为 "../../images/"，避免子目录页面图片全部 404。"""
    return content.replace('"images/', '"../../images/').replace("'images/", "'../../images/")


def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print("wrote", os.path.relpath(path, ROOT), len(content), "bytes")


def main():
    data_only = "--data-only" in sys.argv
    # 根目录 js/data.js 是唯一数据源：既包含分类/主类信息，也包含已合并的新教程正文。
    # 之前误从 tools/newcontent 之外的旧快照读取，会覆盖已合并的内容。
    with open(SRC_DATA, encoding="utf-8") as f:
        src = f.read()
    data = transform_data(src)

    variants = {
        "v1-professional": v1(),
        "v2-dark-lite": v2(),
        "v3-editorial": v3(),
    }
    for name, html in variants.items():
        base = os.path.join(ROOT, "variants", name)
        if not data_only:
            write(os.path.join(base, "index.html"), html)
        write(os.path.join(base, "js", "data.js"), prefix_images(data))

        with open(os.path.join(ROOT, "js", "app.js"), encoding="utf-8") as f:
            write(os.path.join(base, "js", "app.js"), prefix_images(f.read()))

        with open(os.path.join(ROOT, "js", "illustrations.js"), encoding="utf-8") as f:
            write(os.path.join(base, "js", "illustrations.js"), prefix_images(f.read()))

        # 样式表：三套方案共用根目录 css/style.css（此前漏拷，导致子方案页面无样式）
        # 按字节原样复制，避免换行符被改写导致三份样式表不一致
        css_src = os.path.join(ROOT, "css", "style.css")
        css_dst = os.path.join(base, "css", "style.css")
        os.makedirs(os.path.dirname(css_dst), exist_ok=True)
        with open(css_src, "rb") as f:
            css_bytes = f.read()
        with open(css_dst, "wb") as f:
            f.write(css_bytes)
        print("copied", os.path.relpath(css_dst, ROOT), len(css_bytes), "bytes")


if __name__ == "__main__":
    main()
