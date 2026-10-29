/* ============================================================
 * 【逻辑层】js/app.js
 * 负责：渲染列表 / 搜索 / 分类 / 详情渲染 / 步骤折叠 / 主题 / 动效
 * 依赖：js/data.js 中的 SITE_CONFIG、HOME_CONFIG、CATEGORIES、PRODUCTS、SUBCATEGORY_CONTENT
 *
 * 版本支持：
 *   - 页面通过 <body class="variant-vN"> 区分视觉方案（样式全部在 css/style.css 中）
 *   - 首页按 HTML 中实际存在的节点渲染：statRow / heroAside / hero-tips 等可选
 *   - 目录支持三种模式：
 *       categoryBar[data-mode="tree"]  目录树（全部类目 + 子目录按钮，默认）
 *       categoryBar[data-mode="list"]  单列紧凑列表（类目展开后显示型号）
 *       categoryBar[data-mode="none"]  隐藏上方分类区，仅用下方卡片分组
 *
 * 注释标签：
 *   [状态] 页面状态    [DOM] 页面元素    [工具] 通用函数
 *   [数据] 数据展开    [目录] 分类目录    [首页] 首页视图
 *   [教程] 教程渲染    [事件] 交互绑定    [主题] 主题设置
 *   [启动] 网站初始化
 * ============================================================ */
(function () {
  "use strict";

  /* ---------------- 状态 ---------------- */
  var displayProducts = [];
  var expandedCategories = {};

  var state = {
    keyword: "",
    page: "home",
    category: "all",
    subcategory: "",
    activeId: null,
    mode: "all",
    /* tree：目录树（展开型号）；cards：卡片列表（只列类目，型号在首页卡片里选） */
    sidebarView: "tree"
  };

  /* ---------------- DOM 缓存 ---------------- */
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  var els = {
    cardList:       $("#cardList"),
    categoryBar:    $("#categoryBar"),
    detail:         $("#detail"),
    empty:          $("#empty"),
    resultCount:    $("#resultCount"),
    themeToggle:    $("#themeToggle"),
    scrollProgress: $("#scrollProgress"),
    sidebar:        $("#sidebar"),
    mask:           $("#mask"),
    menuToggle:     $("#menuToggle"),
    toast:          $("#toast"),
    toTop:          $("#toTop"),
    brandText:      $(".brand-text"),
    brandLogo:      $(".brand-logo"),
    home:           $("#home"),
    homeGrid:       $("#homeGrid"),
    homeServices:   $("#homeServices"),
    homeKicker:     $("#homeKicker"),
    homeTitle:      $("#homeTitle"),
    homeSubtitle:   $("#homeSubtitle"),
    statRow:        $("#statRow"),
    heroAside:      $("#heroAside")
  };

  var THEME_KEY = "tutorial-site-theme";
  var SIDEBAR_VIEW_KEY = "tutorial-site-sidebar-view";

  /* 目录模式：tree（目录树） / list（紧凑列表） / none（只显示下方分组卡片） */
  function readMode() {
    var bar = els.categoryBar;
    if (!bar) return "none";
    var mode = bar.getAttribute("data-mode");
    return mode === "list" || mode === "tree" || mode === "none" ? mode : "tree";
  }

  /* ---------------- 工具函数 ---------------- */

  /* HTML 转义，防止内容里的尖括号破坏结构 */
  // 功能：转义 HTML，防止内容破坏页面结构
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* 行内语法：**加粗** 与 `代码` */
  // 功能：解析加粗和代码等行内格式
  function inline(text) {
    return esc(text)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  }

  /* 轻提示 */
  var toastTimer = null;
  // 功能：显示轻提示信息
  function toast(msg) {
    if (!els.toast) return;
    var textEl = els.toast.querySelector(".toast-text");
    if (textEl) textEl.textContent = msg;
    else els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      els.toast.classList.remove("show");
    }, 1900);
  }

  /* 点击涟漪 */
  // 功能：添加点击涟漪动画
  function ripple(evt, el) {
    var rect = el.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 1.9;
    var span = document.createElement("span");
    span.className = "ripple";
    span.style.width = span.style.height = size + "px";
    span.style.left = (evt.clientX - rect.left - size / 2) + "px";
    span.style.top  = (evt.clientY - rect.top  - size / 2) + "px";
    el.appendChild(span);
    setTimeout(function () { span.remove(); }, 640);
  }

  /* 数字滚动动画 */
  // 功能：让统计数字从 0 滚动到目标值
  function countUp(el, target, duration) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || target <= 0) { el.textContent = target; return; }
    var start = null;
    var dur = duration || 900;
    function frame(now) {
      if (!start) start = now;
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- 初始化站点文案 ---------------- */
  // 功能：初始化站点名称和 Logo
  function initBrand() {
    if (typeof SITE_CONFIG === "undefined") return;
    if (SITE_CONFIG.brand && els.brandText) els.brandText.textContent = SITE_CONFIG.brand;
    /* 站点副标题：有 SITE_CONFIG.brandSub 时显示 */
    var brandSubEl = $(".brand-sub");
    if (brandSubEl && SITE_CONFIG.brandSub) brandSubEl.textContent = SITE_CONFIG.brandSub;

    if (SITE_CONFIG.logoImage && els.brandLogo) {
      var logoImage = document.createElement("img");
      /* 方形白底 Logo 可通过 logoIcon 指定裁切后的图标版本 */
      logoImage.src = SITE_CONFIG.logoIcon || SITE_CONFIG.logoImage;
      logoImage.alt = SITE_CONFIG.brand || "网站 Logo";
      els.brandLogo.textContent = "";
      els.brandLogo.appendChild(logoImage);
    } else if (SITE_CONFIG.logo && els.brandLogo) {
      els.brandLogo.textContent = SITE_CONFIG.logo;
    }
    if (SITE_CONFIG.searchPlaceholder) {
      $$(".search input").forEach(function (input) {
        input.placeholder = SITE_CONFIG.searchPlaceholder;
      });
    }
    if (SITE_CONFIG.brand) document.title = SITE_CONFIG.brand;
  }

  /* ---------------- 展开主类 / 子类数据 ---------------- */
  // 功能：复制对象基础字段
  function copyObject(source) {
    var result = {};
    if (!source) return result;
    Object.keys(source).forEach(function (key) { result[key] = source[key]; });
    return result;
  }

  /* 子类自动继承主类教程；主类教程仍只维护一份 */
  // 功能：展开主目录和子目录教程数据
  function buildDisplayProducts() {
    if (typeof PRODUCTS === "undefined") {
      displayProducts = [];
      return;
    }

    if (typeof CATEGORIES === "undefined" || !Array.isArray(CATEGORIES)) {
      displayProducts = PRODUCTS.slice();
      return;
    }

    var result = [];

    CATEGORIES.forEach(function (cat) {
      if (!cat || cat.value === "all") return;

      var templates = PRODUCTS.filter(function (p) {
        return p.category === cat.value;
      });
      var children = Array.isArray(cat.children) ? cat.children : [];

      if (!children.length) {
        templates.forEach(function (p) { result.push(p); });
        return;
      }

      children.forEach(function (child, index) {
        var childValue = child.value || child.id || child.label || ("子类 " + (index + 1));
        var template = templates.filter(function (p) {
          return p.id === child.productId;
        })[0] || templates[0] || {};
        var item = copyObject(template);
        var childContent = (typeof SUBCATEGORY_CONTENT !== "undefined" && child.id)
          ? SUBCATEGORY_CONTENT[child.id]
          : null;

        Object.keys(child).forEach(function (key) { item[key] = child[key]; });
        item.id = child.id || ((template.id || cat.value) + "-" + (index + 1));
        item.name = child.label || child.name || childValue;
        item.fullName = child.name || (template.name || "") + " · " + (child.label || childValue);
        item.category = cat.value;
        item.categoryShort = cat.short || cat.label || cat.value;
        item.brand = cat.brand || "";
        item.parentId = template.id || "";
        item.parentName = cat.label || cat.value;
        item.parentIcon = cat.icon || template.icon || "📁";
        item.parentIconImage = cat.iconImage || template.iconImage || "";
        item.icon = child.icon || template.icon || cat.icon || "📦";
        item.iconImage = child.iconImage || template.iconImage || "";
        item.color = child.color || template.color || cat.homeColor || "#2563eb";
        item.subcategory = childValue;
        item.subcategoryLabel = child.label || childValue;
        item.desc = child.desc !== undefined
          ? child.desc
          : (childContent && childContent.desc !== undefined
            ? childContent.desc
            : (template.desc || cat.homeDesc || ""));
        item.keywords = child.keywords !== undefined
          ? child.keywords
          : (childContent && childContent.keywords !== undefined
            ? childContent.keywords
            : (template.keywords || ""));
        item.steps = child.steps || (childContent && childContent.steps) || template.steps || [];

        result.push(item);
      });
    });

    displayProducts = result;
  }

  /* 统一获取可展示商品，避免多处重复判断 */
  // 功能：统一获取当前商品数据源
  function getProductSource() {
    if (displayProducts.length) return displayProducts;
    return (typeof PRODUCTS !== "undefined") ? PRODUCTS : [];
  }

  // 功能：生成分类显示文字
  /* ---------------- 教程统计 ---------------- */
  // 功能：统计类目、教程、步骤、图示视频数量
  function getStats() {
    var source = getProductSource();
    var catCount = (typeof CATEGORIES !== "undefined")
      ? CATEGORIES.filter(function (c) { return c.value !== "all"; }).length
      : 0;
    var stepCount = 0;
    var mediaCount = 0;
    source.forEach(function (p) {
      (p.steps || []).forEach(function (s) {
        stepCount++;
        (s.body || []).forEach(function (b) {
          if (b && (b.type === "img" || b.type === "video")) mediaCount++;
        });
      });
    });
    return {
      categories: catCount,
      tutorials: source.length,
      steps: stepCount,
      media: mediaCount
    };
  }

  // 功能：渲染首页/侧栏中的统计数字
  function renderStats() {
    var stats = getStats();
    var conf = (typeof HOME_CONFIG !== "undefined") ? HOME_CONFIG : {};
    var defs = conf.stats || [
      { key: "categories", label: "设备类目" },
      { key: "tutorials", label: "在线教程" },
      { key: "steps", label: "操作步骤" },
      { key: "media", label: "图示视频" }
    ];

    if (els.statRow) {
      els.statRow.innerHTML = defs.map(function (d) {
        return '<div class="stat">' +
          '<span class="stat-value" data-stat="' + d.key + '">0</span>' +
          '<span class="stat-label">' + esc(d.label) + "</span>" +
        "</div>";
      }).join("");
      $$("[data-stat]").forEach(function (el) {
        countUp(el, stats[el.getAttribute("data-stat")] || 0);
      });
    }

    if (els.heroAside) {
      els.heroAside.innerHTML =
        '<div class="aside-label">教程库概览</div>' +
        '<div class="aside-figure"><span class="aside-num" data-stat="tutorials">0</span><span class="aside-unit">篇在线教程</span></div>' +
        '<ul class="aside-list">' +
          '<li><span>设备类目</span><b data-stat-cell="categories">0</b></li>' +
          '<li><span>操作步骤</span><b data-stat-cell="steps">0</b></li>' +
          '<li><span>图示与视频</span><b data-stat-cell="media">0</b></li>' +
        "</ul>";
      var big = els.heroAside.querySelector("[data-stat]");
      if (big) countUp(big, stats.tutorials);
      $$("[data-stat-cell]").forEach(function (el) {
        countUp(el, stats[el.getAttribute("data-stat-cell")] || 0);
      });
    }
  }

  /* ---------------- 同步分类按钮状态 ---------------- */
  // 功能：同步侧边分类按钮状态
  function syncCategoryButtons() {
    if (!els.categoryBar) return;
    Array.prototype.forEach.call(els.categoryBar.querySelectorAll("[data-value]"), function (btn) {
      var isHome = btn.dataset.home === "home";
      var active = isHome
        ? state.page === "home"
        : (state.page !== "home" && state.category === btn.dataset.value && !btn.dataset.child);
      if (!isHome && btn.dataset.child) {
        active = state.page !== "home" &&
          state.category === btn.dataset.value &&
          state.subcategory === btn.dataset.child;
      }
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  /* ---------------- 主类目录展开 / 收纳 ---------------- */
  // 功能：判断目录是否包含子目录
  function hasSubcategories(cat) {
    return Array.isArray(cat.children) && cat.children.length > 0;
  }

  // 功能：同步单个目录的展开状态
  function syncGroupExpansion(group, expanded, toggleSelector, bodySelector, itemSelector) {
    group.classList.toggle("open", !!expanded);

    var toggle = group.querySelector(toggleSelector);
    var body = group.querySelector(bodySelector);
    var mainButton = group.querySelector(".card-group-main");
    if (mainButton) mainButton.setAttribute("aria-expanded", expanded ? "true" : "false");
    if (toggle) {
      var groupLabel = group.dataset.label || group.dataset.value || "";
      if (toggle.tagName === "BUTTON") {
        toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
        toggle.setAttribute("aria-label", (expanded ? "收起" : "展开") + groupLabel + "子目录");
        toggle.setAttribute("title", expanded ? "收起子目录" : "展开子目录");
        toggle.classList.toggle("is-open", !!expanded);
      }
    }

    if (body) {
      body.setAttribute("aria-hidden", expanded ? "false" : "true");
      Array.prototype.forEach.call(body.querySelectorAll(itemSelector), function (item) {
        item.tabIndex = expanded ? 0 : -1;
      });
    }
  }

  // 功能：设置单个目录展开或收纳
  function setCategoryExpanded(catValue, expanded) {
    expandedCategories[catValue] = !!expanded;

    if (els.categoryBar) {
      Array.prototype.forEach.call(els.categoryBar.querySelectorAll(".cat-group"), function (group) {
        if (group.dataset.value !== catValue) return;
        syncGroupExpansion(group, expanded, ".cat-caret", ".cat-children", ".cat-btn");
      });
    }

    if (els.cardList) {
      Array.prototype.forEach.call(els.cardList.querySelectorAll(".card-group"), function (group) {
        if (group.dataset.value !== catValue) return;
        syncGroupExpansion(group, expanded, ".card-group-toggle", ".card-group-body", ".card");
      });
    }
  }

  // 功能：设置全部目录展开或收纳
  function setAllCategoriesExpanded(expanded) {
    if (typeof CATEGORIES === "undefined") return;
    CATEGORIES.forEach(function (cat) {
      if (hasSubcategories(cat)) setCategoryExpanded(cat.value, expanded);
    });
  }

  /* ---------------- 首页与教程视图 ---------------- */
  // 功能：切换到教程内容视图
  function showTutorialView() {
    state.page = "tutorial";
    if (els.home) els.home.hidden = true;
    document.body.classList.add("is-tutorial");
  }

  // 功能：切换到首页视图
  function showHome() {
    state.page = "home";
    state.category = "all";
    state.subcategory = "";
    state.activeId = null;
    document.body.classList.remove("is-tutorial");
    syncCategoryButtons();

    /* 每次进入首页时清除教程参数，刷新后仍优先显示首页 */
    try {
      var homeUrl = new URL(location.href);
      if (homeUrl.searchParams.has("p")) {
        homeUrl.searchParams.delete("p");
        history.replaceState(null, "", homeUrl);
      }
    } catch (e) { /* 忽略 */ }
    if (els.home) els.home.hidden = false;
    if (els.empty) els.empty.hidden = true;
    if (els.detail) els.detail.hidden = true;
    renderSidebar();
    closeSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 功能：从首页打开指定目录或子目录，同时保留其他主目录
  function openHomeDirectory(categoryValue, subcategoryValue) {
    showTutorialView();

    /* 先按“全部”渲染侧栏，确保点击一个主目录后其他目录仍然显示 */
    state.category = "all";
    state.subcategory = "";
    syncCategoryButtons();
    renderSidebar();
    setCategoryExpanded(categoryValue, true);

    var targetSubcategory = subcategoryValue || "";
    var target = displayProducts.filter(function (p) {
      return p.category === categoryValue &&
        (!targetSubcategory || p.subcategory === targetSubcategory || p.subcategoryLabel === targetSubcategory);
    })[0];

    if (target) {
      selectProduct(target.id);
    } else {
      state.category = categoryValue;
      syncCategoryButtons();
      if (els.empty) els.empty.hidden = false;
      if (els.detail) els.detail.hidden = true;
    }
    closeSidebar();
  }

  /* ---------------- 二维码放大预览 ---------------- */
  var qrPreview = null;

  // 功能：创建二维码放大预览层
  function getQrPreview() {
    if (qrPreview) return qrPreview;

    qrPreview = document.createElement("div");
    qrPreview.className = "qr-preview";
    qrPreview.setAttribute("aria-hidden", "true");
    qrPreview.innerHTML =
      '<img class="qr-preview-image" src="" alt="">' +
      '<div class="qr-preview-hint">点击空白处关闭</div>';

    qrPreview.addEventListener("click", function (e) {
      if (e.target === qrPreview || e.target.closest(".qr-preview-hint")) {
        closeQrPreview();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeQrPreview();
    });

    document.body.appendChild(qrPreview);
    return qrPreview;
  }

  // 功能：打开二维码放大预览
  function openQrPreview(src, title) {
    if (!src) return;
    var preview = getQrPreview();
    var image = preview.querySelector(".qr-preview-image");
    image.src = src;
    image.alt = title || "客服二维码";
    preview.classList.add("show");
    preview.setAttribute("aria-hidden", "false");
    document.body.classList.add("qr-open");
  }

  // 功能：关闭二维码放大预览
  function closeQrPreview() {
    if (!qrPreview) return;
    qrPreview.classList.remove("show");
    qrPreview.setAttribute("aria-hidden", "true");
    document.body.classList.remove("qr-open");
  }

  /* ---------------- 首页渲染 ---------------- */
  // 功能：渲染首页客服信息和目录卡片
  function renderHome() {
    if (!els.home || !els.homeGrid) return;
    var conf = (typeof HOME_CONFIG !== "undefined") ? HOME_CONFIG : {};
    var brand = conf.brand || "视感闪租";

    if (els.homeKicker) els.homeKicker.textContent = conf.kicker || brand;
    if (els.homeTitle) els.homeTitle.textContent = conf.title || "设备使用教程中心";
    if (els.homeSubtitle) els.homeSubtitle.textContent =
      conf.subtitle || "选择目录，快速查看对应教程";

    if (els.homeServices) {
      els.homeServices.innerHTML = "";
      (conf.services || []).forEach(function (service, idx) {
        var serviceCard = document.createElement("article");
        serviceCard.className = "home-service-card";
        serviceCard.style.setProperty("--i", idx);
        serviceCard.innerHTML =
          '<span class="service-dot" aria-hidden="true"></span>' +
          '<div class="home-service-copy">' +
            '<h2 class="home-service-title">' + esc(service.title || "") + "</h2>" +
            '<p class="home-service-hours">' + esc(service.hours || "") + "</p>" +
          "</div>" +
          '<div class="home-service-qr">' +
            (service.qr
              ? '<img src="' + esc(service.qr) + '" alt="' + esc(service.title || "客服二维码") + '" loading="lazy">'
              : "") +
            '<span>' + esc(service.qrText || "扫码联系客服") + "</span>" +
          "</div>";
        var qrImage = serviceCard.querySelector(".home-service-qr img");
        if (qrImage) {
          qrImage.addEventListener("click", function () {
            openQrPreview(service.qr, service.title || "客服二维码");
          });
        }
        els.homeServices.appendChild(serviceCard);
      });
    }

    els.homeGrid.innerHTML = "";
    if (typeof CATEGORIES === "undefined") return;

    var homeLayout = document.body.classList.contains("home-layout-table") ? "table" : "grid";
    els.homeGrid.classList.toggle("as-table", homeLayout === "table");

    CATEGORIES.filter(function (cat) { return cat.value !== "all"; }).forEach(function (cat, index) {
      var template = displayProducts.filter(function (p) { return p.category === cat.value; })[0];
      var count = displayProducts.filter(function (p) { return p.category === cat.value; }).length;
      var card = document.createElement("article");
      card.className = "home-card";
      /* 型号名很长（如「佳能微单 + 100-400mm 超远摄」）时清单换单列，保证名称完整显示 */
      var longName = (cat.children || []).some(function (ch) {
        var text = String(ch.label || ch.value || "");
        return text.length >= 15 && /\d+\s*-?\s*\d*\s*mm/i.test(text);
      });
      if (longName) card.classList.add("is-long-names");
      card.style.setProperty("--home-color", cat.homeColor || (template && template.color) || "#2563eb");
      card.style.animationDelay = (index * 60) + "ms";

      var mainButton = document.createElement("button");
      mainButton.type = "button";
      mainButton.className = "home-card-main";
      var fullLabel = cat.label || cat.value;
      var shortLabel = cat.short || fullLabel;
      mainButton.innerHTML =
        '<span class="home-card-art">' +
          (cat.homeImage
            ? '<img src="' + esc(cat.homeImage) + '" alt="" loading="lazy">'
            : ((cat.homeIconImage || cat.iconImage)
              ? '<img class="home-card-icon-image" src="' + esc(cat.homeIconImage || cat.iconImage) + '" alt="" loading="lazy">'
              : '<span class="home-card-emoji" aria-hidden="true">' + esc(cat.homeIcon || cat.icon || "📷") + "</span>")) +
        "</span>" +
        '<span class="home-card-copy">' +
          '<span class="home-card-brand">' + esc(cat.brand || brand) + "</span>" +
          '<span class="home-card-title">' + esc(shortLabel) + (shortLabel !== fullLabel
            ? '<span class="home-card-title-more">' + esc(
                /* 副标题补上品牌前缀：避免出现孤立的「· Pocket 系列」 */
                (fullLabel.indexOf(shortLabel) === 0 ? fullLabel.substring(shortLabel.length) : fullLabel)
                  .replace(/^\s*·\s*/, (cat.brand ? esc(cat.brand) + " · " : ""))
              ) + "</span>"
            : "") + "</span>" +
          '<span class="home-card-desc">' + esc(cat.homeDesc || ("查看" + fullLabel + "教程")) + "</span>" +
        "</span>" +
        '<span class="home-card-meta">' +
          '<span class="home-card-count">' + count + '<i> 篇</i></span>' +
          '<span class="home-card-enter" aria-hidden="true">→</span>' +
        "</span>";

      mainButton.addEventListener("click", function () {
        openHomeDirectory(cat.value, "");
      });

      var subList = document.createElement("div");
      subList.className = "home-sub-list";
      (cat.children || []).forEach(function (child) {
        var subBtn = document.createElement("button");
        subBtn.type = "button";
        subBtn.className = "home-sub-btn";
        var value = child.value || child.id;
        subBtn.innerHTML =
          (child.iconImage
            ? '<img class="home-sub-icon-img" src="' + esc(child.iconImage) + '" alt="" loading="lazy">'
            : '<span class="home-sub-icon" aria-hidden="true">' + esc(child.icon || "📷") + "</span>") +
          '<span class="home-sub-label">' + esc(child.label || value) + "</span>" +
          '<span class="home-sub-arrow" aria-hidden="true">›</span>';
        subBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          openHomeDirectory(cat.value, value);
        });
        subList.appendChild(subBtn);
      });

      card.appendChild(mainButton);
      if (subList.children.length) card.appendChild(subList);
      els.homeGrid.appendChild(card);
    });

    // 统计 & 滚动显现
    renderStats();
    observeReveal();
  }

  /* 元素滚入视口时播放显现动画 */
  // 功能：为卡片、步骤等元素添加滚动显现
  var revealObserver = null;
  function observeReveal() {
    var targets = $$(".home-card, .home-service-card, .stat, .block-head");
    if (!("IntersectionObserver" in window)) return;
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    }
    targets.forEach(function (el) {
      if (el.classList.contains("in-view")) return;
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
  }

  /* ---------------- 搜索命中判断（目录与型号清单共用） ---------------- */
  function normText(v) { return String(v || "").toLowerCase().replace(/\s+/g, ""); }

  // 功能：该主类目自身是否命中关键词
  function catHit(cat) {
    var kw = normText(state.keyword);
    if (!kw) return true;
    return normText([cat.label, cat.value, cat.short, cat.brand].join(" ")).indexOf(kw) !== -1;
  }

  // 功能：该主类目下命中的型号列表
  function matchedItems(cat) {
    return getFiltered().filter(function (p) { return p.category === cat.value; });
  }

  /* ---------------- 侧边目录入口 ---------------- */
  // 功能：按 data-mode 渲染唯一的侧边目录
  function renderCategories() {
    if (els.categoryBar) {
      els.categoryBar.innerHTML = "";
      els.categoryBar.classList.add("mode-" + readMode());
    }
    renderSidebar();
  }

  /* 目录树工具条：全部展开 / 全部收纳（操作目录树与型号清单） */
  function renderCategoryTreeToolbar() {
    if (!els.categoryBar) return;
    var toolbar = document.createElement("div");
    toolbar.className = "cat-toolbar";

    [
      { action: "expand", label: "全部展开", icon: "⌄" },
      { action: "collapse", label: "全部收纳", icon: "⌃" }
    ].forEach(function (tool, index) {
      var toolBtn = document.createElement("button");
      toolBtn.type = "button";
      toolBtn.className = "cat-tool cat-tool-" + tool.action;
      var toolIcon = document.createElement("span");
      var toolLabel = document.createElement("span");
      toolIcon.className = "cat-tool-icon";
      toolIcon.setAttribute("aria-hidden", "true");
      toolIcon.textContent = tool.icon;
      toolLabel.textContent = tool.label;
      toolBtn.appendChild(toolIcon);
      toolBtn.appendChild(toolLabel);
      toolBtn.style.animation = "fadeUp .35s var(--ease) " + (index * 35) + "ms both";
      toolBtn.addEventListener("click", function () {
        var expand = tool.action === "expand";
        setAllCategoriesExpanded(expand);
      });
      toolbar.appendChild(toolBtn);
    });

    els.categoryBar.appendChild(toolbar);
  }

  /* 侧栏小箭头按钮：点击展开 / 收起该类的子目录 */
  // 功能：创建三角形箭头按钮，独立响应点击，并同步 aria 状态
  function createCaretToggle(cat, index, isExpanded, parentRow) {
    var caret = document.createElement("button");
    caret.type = "button";
    caret.className = "cat-caret";
    caret.dataset.value = cat.value;
    caret.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    caret.setAttribute("aria-controls", "category-children-" + index);
    caret.setAttribute("aria-label", (isExpanded ? "收起" : "展开") + (cat.short || cat.label || cat.value) + "子目录");
    caret.setAttribute("title", isExpanded ? "收起子目录" : "展开子目录");
    caret.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var nowOpen = !expandedCategories[cat.value];
      setCategoryExpanded(cat.value, nowOpen);
      caret.setAttribute("aria-expanded", nowOpen ? "true" : "false");
      caret.setAttribute("aria-label", (nowOpen ? "收起" : "展开") + (cat.short || cat.label || cat.value) + "子目录");
      caret.setAttribute("title", nowOpen ? "收起子目录" : "展开子目录");
      /* 点击箭头时始终保持当前目录可见，不跳转 */
      decorateCaret(parentRow);
    });
    return caret;
  }

  // 功能：按展开状态刷新箭头外观（CSS 只依据 .cat-group.open 旋转，这里补齐按钮自身状态）
  function decorateCaret(parentRow) {
    if (!parentRow) return;
    var group = parentRow.closest(".cat-group");
    var caret = parentRow.querySelector(".cat-caret");
    if (group && caret) {
      caret.classList.toggle("is-open", group.classList.contains("open"));
    }
  }

  /* 侧栏「教程总览」按钮：目录树与卡片列表两种模式共用，避免重复代码 */
  function createHomeButton(withAnimation) {
    var homeBtn = document.createElement("button");
    homeBtn.type = "button";
    homeBtn.className = "cat-btn cat-home-btn" + (state.page === "home" ? " active" : "");
    homeBtn.dataset.home = "home";
    homeBtn.setAttribute("aria-pressed", state.page === "home" ? "true" : "false");
    homeBtn.innerHTML = '<span class="cat-home-icon" aria-hidden="true">⌂</span><span>教程总览</span>';
    if (withAnimation) homeBtn.style.animation = "fadeUp .35s var(--ease) both";
    homeBtn.addEventListener("click", showHome);
    return homeBtn;
  }

  /* 卡片列表模式：侧栏只列类目（不展开型号），型号在首页卡片中选择 */
  function renderCategoryCards() {
    els.categoryBar.appendChild(createHomeButton(false));

    var searching = !!state.keyword.trim();
    CATEGORIES.forEach(function (cat, i) {
      if (!cat || cat.value === "all") return;
      var items = searching
        ? getFiltered().filter(function (p) { return p.category === cat.value; })
        : getProductSource().filter(function (p) { return p.category === cat.value; });
      if (!items.length) return;

      var card = document.createElement("button");
      card.type = "button";
      card.className = "cat-card" + (state.category === cat.value ? " active" : "");
      card.dataset.value = cat.value;
      card.style.animation = "fadeUp .35s var(--ease) " + (i * 35) + "ms both";
      card.innerHTML =
        '<span class="cat-card-icon" aria-hidden="true">' + lineIconFor(cat) + "</span>" +
        '<span class="cat-card-body">' +
          '<span class="cat-card-name">' + esc(cat.short || cat.label || cat.value) + "</span>" +
          '<span class="cat-card-meta">' + esc(cat.brand || "") + " · " + items.length + " 个型号</span>" +
        "</span>" +
        '<span class="cat-caret" aria-hidden="true"></span>';

      card.addEventListener("click", function () {
        var first = items[0];
        openHomeDirectory(cat.value, first.value || first.id);
        closeSidebar();
      });
      els.categoryBar.appendChild(card);
    });

    if (!els.categoryBar.children.length) {
      var empty = document.createElement("div");
      empty.className = "no-result";
      empty.innerHTML = '<span class="no-result-icon" aria-hidden="true">⌕</span>没有匹配的类目';
      els.categoryBar.appendChild(empty);
    }
  }

  /* 目录树模式：首页按钮 + 全部类目 + 子目录按钮 */
  function renderCategoryTree() {
    /* 侧边首页按钮 */
    els.categoryBar.appendChild(createHomeButton(true));

    var searching = !!state.keyword.trim();

    CATEGORIES.forEach(function (cat, i) {
      if (!cat || cat.value === "all") return;
      var allChildren = Array.isArray(cat.children) ? cat.children : [];
      var hitItems = searching ? matchedItems(cat) : [];
      if (searching && !hitItems.length && !catHit(cat)) return;
      var children = searching && hitItems.length ? hitItems : allChildren;
      var canExpand = hasSubcategories(cat);
      var isExpanded = canExpand && (searching || !!expandedCategories[cat.value]);

      var group = document.createElement("div");
      group.className = "cat-group" + (canExpand ? " has-children" : "") + (isExpanded ? " open" : "");
      group.dataset.value = cat.value;
      group.dataset.label = cat.label || cat.value;

      var parentRow = document.createElement("div");
      parentRow.className = "cat-parent-row";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cat-btn cat-parent" + (state.category === cat.value ? " active" : "");
      btn.innerHTML =
        '<span class="cat-parent-icon-wrap" aria-hidden="true">' + lineIconFor(cat) + "</span>" +
        '<span class="cat-parent-label">' + esc(cat.short || cat.label || cat.value) + "</span>" +
        '<span class="cat-parent-count">' + (searching ? children.length : allChildren.length) + "</span>";
      btn.dataset.value = cat.value;
      btn.dataset.child = "";
      btn.setAttribute("aria-pressed", state.category === cat.value ? "true" : "false");
      btn.style.animation = "fadeUp .35s var(--ease) " + (i * 40) + "ms both";

      btn.addEventListener("click", function () {
        if (canExpand) {
          setCategoryExpanded(cat.value, !expandedCategories[cat.value]);
          return;
        }
        openHomeDirectory(cat.value, "");
      });

      parentRow.appendChild(btn);

      if (canExpand) {
        /* 右侧小箭头本身就是展开 / 收起按钮，单独可点 */
        parentRow.appendChild(createCaretToggle(cat, i, isExpanded, parentRow));
      }

      group.appendChild(parentRow);

      if (canExpand) {
        var subList = document.createElement("div");
        subList.id = "category-children-" + i;
        subList.className = "cat-children";
        subList.setAttribute("role", "group");
        subList.setAttribute("aria-label", (cat.label || cat.value) + "子类目");
        subList.setAttribute("aria-hidden", isExpanded ? "false" : "true");

        children.forEach(function (child, j) {
          var childValue = child.value || child.id || child.label || ("子类 " + (j + 1));
          var childBtn = document.createElement("button");
          childBtn.type = "button";
          childBtn.className = "cat-btn cat-child" +
            (state.category === cat.value && state.subcategory === childValue ? " active" : "");
          childBtn.innerHTML =
            '<span class="cat-child-icon" aria-hidden="true">' + childIconFor(cat, child) + "</span>" +
            '<span class="cat-child-label">' + esc(child.label || childValue) + "</span>";
          childBtn.dataset.value = cat.value;
          childBtn.dataset.child = childValue;
          childBtn.tabIndex = isExpanded ? 0 : -1;
          childBtn.setAttribute(
            "aria-pressed",
            state.category === cat.value && state.subcategory === childValue ? "true" : "false"
          );
          childBtn.style.animation = "fadeUp .35s var(--ease) " + (i * 40 + j * 25 + 20) + "ms both";

          childBtn.addEventListener("click", function () {
            openHomeDirectory(cat.value, childValue);
            closeSidebar();
          });

          subList.appendChild(childBtn);
        });

        group.appendChild(subList);
      }

      els.categoryBar.appendChild(group);
    });
  }

  /* 紧凑列表模式：单列可展开式目录（类目占用空间更小，更适合侧边工作台） */
  function renderCategoryList() {
    var groupHead = document.createElement("div");
    groupHead.className = "group-label";
    groupHead.textContent = "设备类目";

    els.categoryBar.appendChild(createHomeButton(false));
    els.categoryBar.appendChild(groupHead);

    CATEGORIES.forEach(function (cat, i) {
      if (!cat || cat.value === "all") return;
      var children = Array.isArray(cat.children) ? cat.children : [];
      var canExpand = hasSubcategories(cat);
      var isExpanded = canExpand && !!expandedCategories[cat.value];

      var group = document.createElement("div");
      group.className = "cat-group" + (canExpand ? " has-children" : "") + (isExpanded ? " open" : "");
      group.dataset.value = cat.value;
      group.dataset.label = cat.label || cat.value;

      var parentRow = document.createElement("div");
      parentRow.className = "cat-parent-row";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cat-btn cat-parent" + (state.category === cat.value ? " active" : "");
      btn.innerHTML =
        '<span class="cat-parent-icon-wrap" aria-hidden="true">' + lineIconFor(cat) + "</span>" +
        '<span class="cat-parent-text">' +
          '<span class="cat-parent-label">' + esc(cat.short || cat.label || cat.value) + "</span>" +
          '<span class="cat-parent-sub">' + esc(cat.brand || "") + (children.length ? " · " + children.length + " 个型号" : "") + "</span>" +
        "</span>";
      btn.dataset.value = cat.value;
      btn.dataset.child = "";
      btn.setAttribute("aria-pressed", state.category === cat.value ? "true" : "false");
      btn.style.animation = "fadeUp .35s var(--ease) " + (i * 40) + "ms both";

      /** 整行点击：展开 / 收起该类的型号（型号本身是独立的教程入口） */
      btn.addEventListener("click", function () {
        if (canExpand) {
          setCategoryExpanded(cat.value, !expandedCategories[cat.value]);
          return;
        }
        if (children.length) {
          var first = children[0];
          openHomeDirectory(cat.value, first.value || first.id);
        }
      });

      parentRow.appendChild(btn);

      if (canExpand) {
        parentRow.appendChild(createCaretToggle(cat, i, isExpanded, parentRow));
      }

      group.appendChild(parentRow);

      if (canExpand) {
        var subList = document.createElement("div");
        subList.className = "cat-children";
        subList.setAttribute("role", "group");
        subList.setAttribute("aria-hidden", isExpanded ? "false" : "true");
        children.forEach(function (child, j) {
          var childValue = child.value || child.id;
          var childBtn = document.createElement("button");
          childBtn.type = "button";
          childBtn.className = "cat-btn cat-child" +
            (state.category === cat.value && state.subcategory === childValue ? " active" : "");
          childBtn.innerHTML =
            '<span class="cat-child-icon" aria-hidden="true">' + childIconFor(cat, child) + "</span>" +
            '<span class="cat-child-label">' + esc(child.label || childValue) + "</span>";
          childBtn.dataset.value = cat.value;
          childBtn.dataset.child = childValue;
          childBtn.tabIndex = isExpanded ? 0 : -1;
          childBtn.setAttribute(
            "aria-pressed",
            state.category === cat.value && state.subcategory === childValue ? "true" : "false"
          );
          childBtn.style.animation = "fadeUp .35s var(--ease) " + (j * 25 + 20) + "ms both";
          childBtn.addEventListener("click", function () {
            openHomeDirectory(cat.value, childValue);
            closeSidebar();
          });
          subList.appendChild(childBtn);
        });
        group.appendChild(subList);
      }

      els.categoryBar.appendChild(group);
    });
  }

  /* ---------------- 过滤逻辑 ---------------- */
  // 功能：收集教程正文，允许搜索结果匹配步骤内容
  function stepSearchText(step) {
    var parts = [step.title || ""];
    (step.body || []).forEach(function (block) {
      if (!block) return;
      if (block.text) parts.push(block.text);
      if (block.caption) parts.push(block.caption);
      if (block.alt) parts.push(block.alt);
      if (Array.isArray(block.items)) parts.push(block.items.join(" "));
      if (Array.isArray(block.head)) parts.push(block.head.join(" "));
      if (Array.isArray(block.rows)) {
        block.rows.forEach(function (row) {
          if (Array.isArray(row)) parts.push(row.join(" "));
        });
      }
    });
    return parts.join(" ");
  }

  // 功能：按分类和关键词筛选教程
  function getFiltered() {
    var source = getProductSource();
    var kw = state.keyword.trim().toLowerCase();

    return source.filter(function (p) {
      if (state.category !== "all" && p.category !== state.category) return false;
      if (state.subcategory && p.subcategory !== state.subcategory) return false;
      if (!kw) return true;

      var haystack = [
        p.name, p.fullName, p.desc, p.category, p.parentName || "", p.subcategoryLabel || "", p.keywords || ""
      ].concat((p.steps || []).map(function (s) { return stepSearchText(s); }))
       .join(" ")
       .toLowerCase();

      return haystack.indexOf(kw) !== -1;
    });
  }

  /* ---------------- 创建单个教程卡片 ---------------- */
  // 功能：创建单个教程卡片
  /* 侧边目录图标：线条型 SVG（24×24，1.6px 描边，随字体颜色着色） */
  // 功能：返回主类目对应的线条图标
  function categoryIcon(name) {
    var paths = {
      /* 手持云台：Pocket 机身 + 云台镜头 + 手柄 */
      gimbal: '<rect x="6.4" y="2.6" width="11.2" height="8.2" rx="2"/><circle cx="12" cy="6.7" r="2.2"/><path d="M12 10.8v2.1"/><path d="M12 15.1a4.2 4.2 0 0 1-4.2-4.2"/><path d="M9 13.6h1.6"/><rect x="9.8" y="15.1" width="4.4" height="6.2" rx="1.6"/><circle cx="12" cy="18.2" r=".9"/>',
      /* 运动相机：镜头 + 顶部快拆齿 + 录制点 */
      action: '<rect x="2.8" y="6.4" width="18.4" height="13" rx="3.2"/><circle cx="11.4" cy="12.9" r="3.6"/><path d="M6.6 6.4V4.8c0-.6.5-1 1-1h2.2c.5 0 1 .4 1 1v1.6M17.4 9.6h1.4"/>',
      /* 全景：球体 + 经线 + 两个镜头 */
      panorama: '<circle cx="12" cy="12" r="8.4"/><path d="M9.4 3.8c-1.2 2.3-1.8 5-1.8 8.2s.6 5.9 1.8 8.2M14.6 3.8c1.2 2.3 1.8 5 1.8 8.2s-.6 5.9-1.8 8.2"/><path d="M3.6 12h16.8"/>',
      /* 微单：方机身 + 可换镜头（镜头环） */
      mirrorless: '<rect x="2.8" y="7" width="15" height="11.4" rx="2.4"/><path d="M7.4 7l1.2-2.2h3.6L13.4 7"/><circle cx="10.3" cy="12.7" r="3.3"/><path d="M17.8 10.2l2.6-1.5a.8.8 0 0 1 1.2.7v5.8a.8.8 0 0 1-1.2.7l-2.6-1.5"/>',
      /* 卡片相机：纤薄机身 + 大镜头 + 弹出闪光 */
      compact: '<rect x="2.8" y="9.2" width="18.4" height="10.6" rx="2.2"/><path d="M7.6 9.2l1-1.6h3.6l1 1.6"/><circle cx="12" cy="14.4" r="3.1"/><path d="M7.2 6.4l1.4-1.4M17 6.6V4.4M18.6 5.6h1.6"/>',
      /* CCD：复古取景窗 + 屏幕 + 按键区 */
      ccd: '<rect x="2.8" y="5.6" width="18.4" height="13" rx="2.4"/><rect x="5.6" y="8.6" width="5.4" height="4.2" rx=".8"/><rect x="12.6" y="8.6" width="5.8" height="4.2" rx=".8" opacity=".5"/><circle cx="7" cy="16" r="1.1"/><path d="M11 16h7.4"/>',
      /* 三脚架：云台球头 + 中柱 + 三条腿 + 中置横杆 */
      tripod: '<rect x="4.6" y="3" width="14.8" height="2.8" rx="1.2"/><circle cx="12" cy="9.4" r="2.6"/><path d="M10.2 11.5L5.4 20.6M13.8 11.5l4.8 9.1M12 12v5.6M9.6 17.6h4.8"/>',
      /* 数据找回：盾牌 + 向下取回的箭头 */
      recovery: '<path d="M12 2.9l7.2 2.6v5.5c0 4.5-3 8.5-7.2 10.1-4.2-1.6-7.2-5.6-7.2-10.1V5.5z"/><path d="M12 7.8v5.4M9.7 10.9l2.3 2.3 2.3-2.3"/>'
    };
    return '<svg class="ico-line" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || paths.action) + '</svg>';
  }

  // 功能：根据类目 id 选择线条图标（不依赖 emoji 或位图）
  function lineIconFor(cat) {
    var id = String(cat.value || "") + " " + String(cat.label || "");
    if (/云台|pocket|gimbal/i.test(id)) return categoryIcon("gimbal");
    if (/全景|panorama|x ?系列/i.test(id)) return categoryIcon("panorama");
    if (/微单|mirrorless/i.test(id)) return categoryIcon("mirrorless");
    if (/卡片|compact/i.test(id)) return categoryIcon("compact");
    if (/ccd|ixus/i.test(id)) return categoryIcon("ccd");
    if (/三脚架|脚架|tripod/i.test(id)) return categoryIcon("tripod");
    if (/数据|找回|recovery/i.test(id)) return categoryIcon("recovery");
    return categoryIcon("action");
  }

  // 功能：按型号名称匹配线条图标（子目录）
  function childIconFor(cat, child) {
    var text = String(child.label || "") + " " + String(child.value || "");
    if (/数据|找回|SD|TF/i.test(text)) return categoryIcon("recovery");
    if (/三脚架|云台|配件|FY-830/i.test(text)) return categoryIcon("tripod");
    return lineIconFor(cat);
  }

  /* ---------------- 渲染侧边目录（唯一入口） ---------------- */
  // 功能：渲染侧边目录；目录树只保留一份，下方按需展开型号清单
  function renderSidebar() {
    var mode = readMode();
    var searching = !!state.keyword.trim();
    state.mode = mode;

    /* 命中数量：显示在侧栏标题旁 */
    var matched = getFiltered().length;
    if (els.resultCount) {
      els.resultCount.textContent = matched;
      els.resultCount.classList.add("pop");
      setTimeout(function () { els.resultCount.classList.remove("pop"); }, 300);
    }

    if (mode === "none") {
      renderCategoryList();
      if (els.cardList) els.cardList.innerHTML = "";
      return;
    }

    /* 目录只剩一份：首次渲染、搜索状态变化、选中项变化时重绘 */
    var sidebarKey = (searching ? "s:" + state.keyword : "all") + "|" + (state.activeId || "") + "|" + state.sidebarView;
    if (els.categoryBar && els.sidebarKey !== sidebarKey) {
      els.sidebarKey = sidebarKey;
      els.categoryBar.innerHTML = "";
      if (mode === "tree") {
        if (state.sidebarView === "cards") {
          renderCategoryCards();
        } else {
          renderCategoryTreeToolbar();
          renderCategoryTree();
        }
      } else {
        renderCategoryList();
      }
    }

    /* 无命中提示：侧栏底部给出明确反馈，避免“搜索后一片空白” */
    if (els.cardList) {
      els.cardList.innerHTML = "";
      if (matched === 0) {
        var empty = document.createElement("div");
        empty.className = "no-result";
        empty.innerHTML =
          '<span class="no-result-icon" aria-hidden="true">⌕</span>' +
          "没有匹配的型号<br><span>换个关键词试试</span>";
        els.cardList.appendChild(empty);
      }
    }
  }

  function renderBody(blocks) {
    if (!Array.isArray(blocks) || !blocks.length) return "";

    return blocks.map(function (b) {
      switch (b.type) {
        case "p":
          return "<p>" + inline(b.text) + "</p>";

        case "list":
          return "<ul>" + b.items.map(function (i) { return "<li>" + inline(i) + "</li>"; }).join("") + "</ul>";

        case "olist":
          return "<ol>" + b.items.map(function (i) { return "<li>" + inline(i) + "</li>"; }).join("") + "</ol>";

        case "tip":
          return '<div class="note note-tip"><span class="note-icon" aria-hidden="true">i</span><div class="note-body"><div class="note-label">提示</div><p>' + inline(b.text) + "</p></div></div>";

        case "warn":
          return '<div class="note note-warn"><span class="note-icon" aria-hidden="true">!</span><div class="note-body"><div class="note-label">注意</div><p>' + inline(b.text) + "</p></div></div>";

        case "code":
          return '<div class="code">' +
                   '<div class="code-bar"><span>' + esc(b.lang || "code") + "</span>" +
                   '<button class="code-copy" type="button">复制</button></div>' +
                   "<pre><code>" + esc(b.text) + "</code></pre>" +
                 "</div>";

        case "video":
          var videoClass = b.className ? " " + esc(b.className) : "";
          return '<figure class="fig video-figure' + videoClass + '">' +
                   '<video src="' + esc(b.src) + '" controls preload="metadata" playsinline></video>' +
                   (b.caption ? "<figcaption>" + esc(b.caption) + "</figcaption>" : "") +
                 "</figure>";

        case "img":
          return '<figure class="fig">' +
                   '<img src="' + esc(b.src) + '" alt="' + esc(b.alt || "") + '" loading="lazy">' +
                   (b.caption ? "<figcaption>" + esc(b.caption) + "</figcaption>" : "") +
                 "</figure>";

        case "table":
          return '<div class="table-wrap"><table><thead><tr>' +
                   b.head.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") +
                 "</tr></thead><tbody>" +
                   b.rows.map(function (r) {
                     return "<tr>" + r.map(function (c) { return "<td>" + inline(c) + "</td>"; }).join("") + "</tr>";
                   }).join("") +
                 "</tbody></table></div>";

        default:
          return "";
      }
    }).join("");
  }

  /* ---------------- 图片放大查看 ---------------- */
  var imgZoom = null;

  function getImgZoom() {
    if (imgZoom) return imgZoom;
    imgZoom = document.createElement("div");
    imgZoom.className = "img-zoom";
    imgZoom.setAttribute("aria-hidden", "true");
    imgZoom.innerHTML = '<img alt=""><div class="img-zoom-hint">点击任意位置关闭</div>';
    imgZoom.addEventListener("click", closeImgZoom);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeImgZoom();
    });
    document.body.appendChild(imgZoom);
    return imgZoom;
  }

  function openImgZoom(src, alt) {
    if (!src) return;
    var box = getImgZoom();
    var img = box.querySelector("img");
    img.src = src;
    img.alt = alt || "教程图片";
    box.classList.add("show");
    box.setAttribute("aria-hidden", "false");
    document.body.classList.add("img-zoom-open");
  }

  function closeImgZoom() {
    if (!imgZoom) return;
    imgZoom.classList.remove("show");
    imgZoom.setAttribute("aria-hidden", "true");
    document.body.classList.remove("img-zoom-open");
  }

  /* 按图片真实比例打上方向标记，供 CSS 限制高度 */
  function markImageOrientation(root) {
    if (!root) return;
    Array.prototype.forEach.call(root.querySelectorAll(".fig img"), function (img) {
      var apply = function () {
        if (!img.naturalWidth || !img.naturalHeight) return;
        var ratio = img.naturalWidth / img.naturalHeight;
        img.setAttribute("data-orient", ratio < 0.9 ? "portrait" : (ratio > 2.1 ? "wide" : "normal"));
      };
      if (img.complete) apply();
      else img.addEventListener("load", apply, { once: true });
    });
    Array.prototype.forEach.call(root.querySelectorAll(".video-figure video"), function (v) {
      var apply = function () {
        var fig = v.closest(".video-figure");
        if (!fig || !v.videoWidth) return;
        fig.classList.toggle("video-portrait", v.videoHeight > v.videoWidth);
      };
      if (v.readyState >= 1) apply();
      else v.addEventListener("loadedmetadata", apply, { once: true });
    });
  }

  /* 点击图片放大（事件委托） */
  function bindImageZoom() {
    document.addEventListener("click", function (e) {
      var img = e.target.closest(".fig img");
      if (!img) return;
      e.preventDefault();
      openImgZoom(img.getAttribute("src"), img.getAttribute("alt"));
    });
  }

  /* 点击涟漪：为按钮类元素统一添加轻量触感动画 */
  function bindClickRipple() {
    var selector = ".btn, .cat-btn, .cat-card, .home-sub-btn, .cat-tool, .pager-btn, .tree-mode-btn, .seg-btn, .icon-btn, .btn-help, .step-head";
    document.addEventListener("pointerdown", function (e) {
      var el = e.target.closest(selector);
      if (!el || el.classList.contains("cat-caret")) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      ripple(e, el);
    });
  }

  /* ---------------- 教程导航（上一篇 / 下一篇） ---------------- */
  // 功能：同分类上一篇、下一篇
  function getSiblings(p) {
    var source = getProductSource().filter(function (x) { return x.category === p.category; });
    var idx = -1;
    source.forEach(function (x, i) { if (x.id === p.id) idx = i; });
    return {
      prev: idx > 0 ? source[idx - 1] : null,
      next: idx > -1 && idx < source.length - 1 ? source[idx + 1] : null
    };
  }

  /* ---------------- 教程插图（线条型，按型号逐篇绘制） ---------------- */
  // 功能：返回该教程对应的内联线条插图；缺失时回退到子目录插图或表情
  function illustrationMarkup(p) {
    var all = window.TUTORIAL_ILLUSTRATIONS || {};
    var markup = all[p.id];
    if (!markup && p.iconImage) {
      return '<img class="hero-icon-img" src="' + esc(p.iconImage) + '" alt="" loading="eager">';
    }
    return markup || '<span class="hero-emoji">' + esc(p.icon || "📦") + "</span>";
  }

  /* ---------------- 渲染教程详情 ---------------- */
  // 功能：渲染完整教程详情
  function renderDetail(p) {
    var steps = p.steps || [];
    var siblings = getSiblings(p);

    /* 目录：当前教程下的步骤导航（桌面端用于右侧吸附） */
    var tocHTML = steps.map(function (s, i) {
      return '<a class="toc-item' + (i === 0 ? " current" : "") + '" href="#step-' + i + '" data-step="' + i + '">' +
        '<span class="toc-no">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="toc-text">' + esc(s.title) + "</span>" +
      "</a>";
    }).join("");

    var stepsHTML = steps.map(function (s, i) {
      return '<section class="step' + (i === 0 ? " open" : "") + '" id="step-' + i + '" style="animation-delay:' + (i * 60) + 'ms">' +
        '<header class="step-head" role="button" tabindex="0" aria-expanded="' + (i === 0) + '">' +
          '<span class="step-no">' + String(i + 1).padStart(2, "0") + "</span>" +
          '<span class="step-title-wrap">' +
            '<span class="step-sub">STEP ' + String(i + 1).padStart(2, "0") + "</span>" +
            '<h3 class="step-title">' + esc(s.title) + "</h3>" +
          "</span>" +
          '<span class="step-icon" aria-hidden="true">' + esc(s.icon || "▫") + "</span>" +
          '<span class="step-toggle" aria-hidden="true"></span>' +
        "</header>" +
        '<div class="step-body"><div class="step-body-inner">' + renderBody(s.body) + "</div></div>" +
      "</section>";
    }).join("");

    return '' +
      '<nav class="crumb" aria-label="面包屑">' +
        '<a href="#home" data-home-link>教程总览</a>' +
        '<span class="crumb-sep">/</span>' +
        '<span>' + esc(p.categoryShort || p.category) + "</span>" +
        '<span class="crumb-sep">/</span>' +
        '<span class="crumb-current">' + esc(p.name) + "</span>" +
      "</nav>" +
      '<div class="detail-hero" style="--accent-color:' + esc(p.color || "#2563eb") + '">' +
        '<div class="hero-icon" data-emoji="' + esc(p.icon || "📦") + '">' +
          illustrationMarkup(p) +
        "</div>" +
        '<div class="hero-text">' +
          (p.brand ? '<span class="hero-brand">' + esc(p.brand) + "</span>" : "") +
          "<h1>" + esc(p.name) + "</h1>" +
          "<p>" + esc(p.desc || "") + "</p>" +
          '<div class="hero-chips">' +
            '<span class="chip">' + esc(p.categoryShort || p.category) + "</span>" +
            (p.tag ? '<span class="chip chip-hot">' + esc(p.tag) + "</span>" : "") +
            '<span class="chip chip-plain">共 ' + steps.length + " 个步骤</span>" +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="detail-grid">' +
        '<div class="steps-col">' +
          '<div class="steps">' + stepsHTML + "</div>" +
          '<div class="detail-foot">' +
            '<button class="btn btn-ghost" type="button" data-act="expand">展开全部步骤</button>' +
            '<button class="btn btn-ghost" type="button" data-act="collapse">收起全部步骤</button>' +
            '<button class="btn btn-primary" type="button" data-act="copy">复制教程链接</button>' +
          "</div>" +
        "</div>" +
        '<aside class="onpage">' +
          '<div class="onpage-card">' +
            '<div class="onpage-head">本页目录</div>' +
            '<div class="toc">' + tocHTML + "</div>" +
            '<div class="onpage-meta">' +
              '<span>阅读约 ' + Math.max(1, Math.round(steps.length * 1.5)) + " 分钟</span>" +
            "</div>" +
          "</div>" +
        "</aside>" +
      "</div>" +
      '<nav class="pager" aria-label="同类设备切换">' +
        (siblings.prev
          ? '<button class="pager-btn pager-prev" type="button" data-goto="' + esc(siblings.prev.id) + '">' +
              '<span class="pager-dir">上一篇</span>' +
              '<span class="pager-name">' + esc(siblings.prev.name) + "</span>" +
            "</button>"
          : '<span class="pager-placeholder"></span>') +
        (siblings.next
          ? '<button class="pager-btn pager-next" type="button" data-goto="' + esc(siblings.next.id) + '">' +
              '<span class="pager-dir">下一篇</span>' +
              '<span class="pager-name">' + esc(siblings.next.name) + "</span>" +
            "</button>"
          : '<span class="pager-placeholder"></span>') +
      "</nav>";
  }

  /* ---------------- 选中某个商品 ---------------- */
  // 功能：选中并显示指定教程
  function selectProduct(id) {
    var list = getProductSource();
    var p = null;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) { p = list[i]; break; }
    }
    if (!p) return;

    state.category = p.category || "all";
    state.subcategory = p.subcategory || "";
    state.page = "tutorial";
    syncCategoryButtons();
    if (els.home) els.home.hidden = true;
    if (!document.body.classList.contains("is-tutorial")) showTutorialView();
    state.activeId = id;

    /* 打开教程所属的主类目录，保持上下层级状态一致 */
    if (p.category && typeof CATEGORIES !== "undefined") {
      var currentCategory = CATEGORIES.filter(function (cat) {
        return cat.value === p.category;
      })[0];
      if (currentCategory && hasSubcategories(currentCategory)) {
        setCategoryExpanded(p.category, true);
      }
    }

    /* 高亮左侧卡片 */
    if (els.cardList) {
      Array.prototype.forEach.call(els.cardList.querySelectorAll(".side-item"), function (c) {
        c.classList.toggle("active", c.dataset.id === id);
        c.setAttribute("aria-current", c.dataset.id === id ? "true" : "false");
      });
      Array.prototype.forEach.call(els.cardList.querySelectorAll(".card-group, .side-list-group"), function (group) {
        group.classList.toggle("active", group.dataset.value === p.category);
      });
      if (els.categoryBar) {
        Array.prototype.forEach.call(els.categoryBar.querySelectorAll(".cat-card"), function (card) {
          card.classList.toggle("active", card.dataset.value === p.category);
        });
      }
    }

    if (els.empty) els.empty.hidden = true;
    els.detail.hidden = false;
    els.detail.innerHTML = renderDetail(p);

    /* 重放进入动画 */
    els.detail.classList.remove("enter");
    void els.detail.offsetWidth;
    els.detail.classList.add("enter");

    /* 更新地址栏，方便分享 */
    try {
      var url = new URL(location.href);
      url.searchParams.set("p", id);
      history.replaceState(null, "", url);
    } catch (err) { /* 忽略 */ }

    bindToc();
    markImageOrientation(els.detail);

    /* 侧栏目录同步选中态：重绘一次，保证进入的型号被高亮 */
    if (els.categoryBar) {
      els.categoryBar.innerHTML = "";
      var sidebarMode = readMode();
      if (sidebarMode === "tree") {
        if (state.sidebarView === "cards") {
          renderCategoryCards();
        } else {
          renderCategoryTreeToolbar();
          renderCategoryTree();
        }
      } else if (sidebarMode === "list") {
        renderCategoryList();
      }
      els.sidebarKey = (state.keyword.trim() ? "s:" + state.keyword : "all") + "|" + (state.activeId || "");
    }
    syncCategoryButtons();

    /* 移动端滚动到内容区 */
    if (window.innerWidth <= 900) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  /* 右侧本页目录：跟随滚动高亮 + 点击定位 */
  // 功能：绑定教程页内目录
  var tocTicking = false;
  function bindToc() {
    var tocItems = $$(".toc-item");
    if (!tocItems.length) return;

    tocItems.forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        var idx = item.getAttribute("data-step");
        var step = document.getElementById("step-" + idx);
        if (!step) return;
        if (!step.classList.contains("open")) {
          step.classList.add("open");
          step.querySelector(".step-head").setAttribute("aria-expanded", "true");
        }
        var top = step.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });

    window.removeEventListener("scroll", highlightToc);
    window.addEventListener("scroll", highlightToc, { passive: true });
  }

  function highlightToc() {
    if (tocTicking) return;
    tocTicking = true;
    requestAnimationFrame(function () {
      var steps = $$(".step");
      var current = 0;
      steps.forEach(function (s, i) {
        if (s.getBoundingClientRect().top < 180) current = i;
      });
      $$(".toc-item").forEach(function (item, i) {
        item.classList.toggle("current", i === current);
      });
      tocTicking = false;
    });
  }

  /* ---------------- 复制文本（带降级方案） ---------------- */
  // 功能：复制文本并提供降级方案
  function copyText(text, btn, normalLabel, doneLabel) {
    function done() {
      if (btn) {
        btn.textContent = doneLabel;
        setTimeout(function () { btn.textContent = normalLabel; }, 1400);
      }
      toast(doneLabel);
    }

    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        if (document.execCommand("copy")) done();
        else toast("复制失败，请手动复制");
      } catch (err) {
        toast("复制失败，请手动复制");
      }
      ta.remove();
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else {
      fallback();
    }
  }

  /* ---------------- 详情区事件委托 ---------------- */
  // 功能：绑定教程展开、复制等事件
  function bindDetailEvents() {
    /* 点击步骤头：折叠 / 展开；点击代码复制；点击底部按钮；上一篇下一篇；面包屑 */
    els.detail.addEventListener("click", function (e) {
      var homeLink = e.target.closest("[data-home-link]");
      if (homeLink) {
        e.preventDefault();
        showHome();
        return;
      }

      var gotoBtn = e.target.closest("[data-goto]");
      if (gotoBtn) {
        selectProduct(gotoBtn.getAttribute("data-goto"));
        return;
      }

      var head = e.target.closest(".step-head");
      if (head) {
        var step = head.parentElement;
        var isOpen = step.classList.toggle("open");
        head.setAttribute("aria-expanded", String(isOpen));
        return;
      }

      var copyBtn = e.target.closest(".code-copy");
      if (copyBtn) {
        var codeEl = copyBtn.closest(".code").querySelector("code");
        copyText(codeEl.textContent, copyBtn, "复制", "已复制");
        return;
      }

      var actBtn = e.target.closest("[data-act]");
      if (actBtn) {
        var act = actBtn.dataset.act;
        var steps = els.detail.querySelectorAll(".step");

        if (act === "expand") {
          Array.prototype.forEach.call(steps, function (s) {
            s.classList.add("open");
            s.querySelector(".step-head").setAttribute("aria-expanded", "true");
          });
          toast("已展开全部步骤");
        } else if (act === "collapse") {
          Array.prototype.forEach.call(steps, function (s) {
            s.classList.remove("open");
            s.querySelector(".step-head").setAttribute("aria-expanded", "false");
          });
          toast("已收起全部步骤");
        } else if (act === "copy") {
          copyText(location.href, actBtn, "复制教程链接", "链接已复制");
        }
      }
    });

    /* 键盘可访问性：回车 / 空格折叠步骤 */
    els.detail.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var head = e.target.closest(".step-head");
      if (!head) return;
      e.preventDefault();
      head.click();
    });
  }

  /* ---------------- 搜索 ---------------- */
  // 功能：搜索无结果时显示「没有找到」提示，避免页面一片空白
  function syncEmptyState() {
    if (!els.empty) return;
    var hasResult = getFiltered().length > 0;
    els.empty.hidden = hasResult;
    if (hasResult) return;
    /* 文案随场景变化，指引用户下一步操作 */
    var title = els.empty.querySelector("h2");
    var desc = els.empty.querySelector("p");
    if (state.keyword.trim()) {
      if (title) title.textContent = "没有找到匹配的教程";
      if (desc) desc.textContent = "换个关键词试试，或清空搜索框查看全部设备";
    } else {
      if (title) title.textContent = "请从左侧选择设备";
      if (desc) desc.textContent = "左侧目录已按设备类型分类，点击任意型号即可查看教程";
    }
  }

  // 功能：绑定所有搜索框（顶部 / 首页），输入即筛选
  function bindSearch() {
    var timer = null;
    var inputs = $$(".search input");
    inputs.forEach(function (input) {
      input.addEventListener("input", function (e) {
        clearTimeout(timer);
        var val = e.target.value;
        inputs.forEach(function (other) {
          if (other !== input) other.value = val;
        });
        timer = setTimeout(function () {
          state.keyword = val;
          if (val.trim()) {
            /* 有搜索词：切到教程视图展示结果（首页视图没有结果区，会看起来毫无反应） */
            if (state.page === "home") {
              showTutorialView();
              state.category = "all";
              state.subcategory = "";
              syncCategoryButtons();
            }
            if (els.detail) els.detail.hidden = true;
            syncEmptyState();
          } else {
            /* 清空搜索词：清掉空状态；若停留在教程视图则回到首页 */
            if (els.empty) els.empty.hidden = true;
            if (state.page === "tutorial") {
              showHome();
            }
          }
          renderSidebar();
        }, 180);
      });
    });

    /* 快捷键 "/" 聚焦搜索 */
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement && document.activeElement.tagName !== "INPUT" &&
          document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        if (inputs[0]) inputs[0].focus();
      }
      if (e.key === "Escape" && state.keyword) {
        state.keyword = "";
        inputs.forEach(function (i) { i.value = ""; });
        renderSidebar();
      }
    });
  }

  /* ---------------- 顶部导航跳转 ---------------- */
  // 功能：平滑滚动到首页某个区块（教程页会先回到首页再滚动）
  function goToSection(selector) {
    /* 先瞬时回到首页顶部：CSS 里 html { scroll-behavior: smooth } 会让
       showHome() 的平滑滚动与随后的定位互相打断，导致停在半路 */
    var root = document.documentElement;
    var prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    showHome();
    window.scrollTo(0, 0);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var target = document.querySelector(selector);
        if (target) {
          var top = target.getBoundingClientRect().top + window.scrollY - 84;
          window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
          highlightSection(target);
          /* 同步历史记录，刷新或分享链接时能回到同一区块 */
          try {
            if (history.replaceState) history.replaceState(null, "", selector);
          } catch (err) { /* file:// 下可能受限，忽略 */ }
        }
        root.style.scrollBehavior = prevBehavior;
      });
    });
  }

  // 功能：跳转后短暂高亮目标区块，避免用户找不到落点
  var sectionTimer = null;
  function highlightSection(target) {
    target.classList.remove("section-flash");
    void target.offsetWidth;
    target.classList.add("section-flash");
    clearTimeout(sectionTimer);
    sectionTimer = setTimeout(function () {
      target.classList.remove("section-flash");
    }, 1600);
  }

  // 功能：根据 href / data-scroll 找到目标区块的选择器
  function sectionSelector(el) {
    var direct = el.getAttribute("data-scroll");
    if (direct) return direct;
    var href = el.getAttribute("href") || "";
    /* 只认纯锚点（#section）；带路径的链接（file://、/子目录/）一律不拦截 */
    if (href.charAt(0) !== "#" || href.length < 2) return "";
    return href.indexOf("#") === 0 && href.charAt(1) !== "/" ? href : "";
  }

  /* ---------------- 导航按钮 ---------------- */
  // 功能：绑定顶栏导航（教程总览 / 设备目录 / 客服支持）、目录显示方式与首页布局切换
  function bindNav() {
    /* 顶栏所有跳转入口：首页、设备目录、客服支持（含“联系客服”按钮）
       统一委托处理，教程页里也能正常回到首页并滚动到对应区块 */
    var header = document.querySelector(".topbar");
    if (header) {
      header.addEventListener("click", function (e) {
        var el = e.target.closest("[data-home-link], [data-scroll], a[href^='#']");
        if (!el || !header.contains(el)) return;
        if (el.hasAttribute("data-home-link")) {
          e.preventDefault();
          showHome();
          return;
        }
        var sel = sectionSelector(el);
        if (!sel || sel === "#") return;
        e.preventDefault();
        goToSection(sel);
      });
    }

    /* 首页内的锚点按钮（如 Hero 里的“浏览设备目录 / 联系客服支持”） */
    $$(".hero-actions a[href^='#']").forEach(function (link) {
      link.addEventListener("click", function (e) {
        var sel = sectionSelector(link);
        if (!sel || sel === "#") return;
        e.preventDefault();
        goToSection(sel);
      });
    });

    $$("[data-view]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var view = btn.getAttribute("data-view");
        state.sidebarView = view === "list" ? "cards" : "tree";
        $$("[data-view]").forEach(function (b) {
          var active = b === btn;
          b.classList.toggle("active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
        });
        document.body.classList.toggle("view-list", view === "list");
        try { localStorage.setItem(SIDEBAR_VIEW_KEY, state.sidebarView); } catch (e) { /* 忽略 */ }
        renderSidebar();
      });
    });

    $$("[data-home-layout]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var layout = btn.getAttribute("data-home-layout");
        $$("[data-home-layout]").forEach(function (b) {
          b.classList.toggle("active", b === btn);
        });
        document.body.classList.toggle("home-layout-table", layout === "table");
        if (els.homeGrid) els.homeGrid.classList.toggle("as-table", layout === "table");
      });
    });
  }

  /* ---------------- 主题切换 ---------------- */
  // 功能：应用深浅主题
  function applyTheme(theme) {
    /* data-theme 写在 <html> 上，深色变量同时支持写在 body 上（见 css/style.css） */
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme === "dark" ? "dark" : "light";
    if (document.body) document.body.dataset.theme = theme;
    if (els.themeToggle) {
      els.themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      els.themeToggle.setAttribute("title", theme === "dark" ? "切换为浅色模式" : "切换为深色模式");
    }
  }

  // 功能：初始化主题和主题切换
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* 忽略 */ }

    var prefersDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    var theme = saved || (prefersDark ? "dark" : "light");
    applyTheme(theme);

    if (els.themeToggle) {
      els.themeToggle.addEventListener("click", function () {
        var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* 忽略 */ }
      });
    }

    /* 跟随系统主题：用户未手动选择时，系统切换后自动同步 */
    if (window.matchMedia) {
      var query = window.matchMedia("(prefers-color-scheme: dark)");
      var onSchemeChange = function (e) {
        var manual = null;
        try { manual = localStorage.getItem(THEME_KEY); } catch (err) { /* 忽略 */ }
        if (!manual) applyTheme(e.matches ? "dark" : "light");
      };
      if (query.addEventListener) query.addEventListener("change", onSchemeChange);
      else if (query.addListener) query.addListener(onSchemeChange);
    }
  }

  /* ---------------- 滚动进度 + 回顶按钮 + 顶栏状态 ---------------- */
  // 功能：绑定滚动进度和回顶按钮
  function bindScroll() {
    var ticking = false;

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var doc = document.documentElement;
        var max = doc.scrollHeight - doc.clientHeight;
        var pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
        if (els.scrollProgress) els.scrollProgress.style.width = pct + "%";
        if (els.toTop) {
          // 自适应阈值：内容较短时（可滚动距离小）也能出现按钮
          var threshold = Math.min(420, max * 0.33);
          els.toTop.classList.toggle("show", doc.scrollTop > threshold);
        }
        document.body.classList.toggle("is-scrolled", doc.scrollTop > 8);
        ticking = false;
      });
    }, { passive: true });

    if (els.toTop) {
      els.toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* ---------------- 移动端侧栏 ---------------- */
  // 功能：打开移动端侧栏
  function openSidebar() {
    els.sidebar.classList.add("open");
    els.mask.classList.add("show");
  }
  // 功能：关闭移动端侧栏
  function closeSidebar() {
    if (!els.sidebar) return;
    els.sidebar.classList.remove("open");
    if (els.mask) els.mask.classList.remove("show");
  }
  // 功能：绑定移动端侧栏事件
  function bindSidebar() {
    if (els.menuToggle) {
      els.menuToggle.addEventListener("click", function () {
        if (els.sidebar.classList.contains("open")) { closeSidebar(); }
        else { openSidebar(); }
      });
    }
    if (els.mask) els.mask.addEventListener("click", closeSidebar);

    /* 移动端目录抽屉的关闭按钮 */
    $$("#sidebarClose").forEach(function (btn) {
      btn.addEventListener("click", closeSidebar);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSidebar();
    });
  }

  /* ---------------- 启动 ---------------- */
  // 功能：初始化网站所有模块
  function init() {
    var loader = document.getElementById("pageLoader");
    if (loader) {
      setTimeout(function () { loader.classList.add("done"); }, 260);
      setTimeout(function () { loader.remove(); }, 900);
    }

    /* 恢复目录显示方式偏好（tree 目录树 / cards 卡片列表） */
    try {
      if (localStorage.getItem(SIDEBAR_VIEW_KEY) === "cards" && document.querySelector('[data-view="list"]')) {
        state.sidebarView = "cards";
        document.body.classList.add("view-list");
        $$("[data-view]").forEach(function (b) {
          var active = b.getAttribute("data-view") === "list";
          b.classList.toggle("active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
        });
      }
    } catch (e) { /* 忽略 */ }

    initBrand();
    buildDisplayProducts();
    renderHome();
    renderCategories();
    renderSidebar();
    bindSearch();
    bindDetailEvents();
    bindNav();
    bindImageZoom();
    bindClickRipple();
    initTheme();
    bindScroll();
    bindSidebar();

    /* 每次打开网站优先显示首页，只有选择分类后才进入教程 */
    showHome();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
