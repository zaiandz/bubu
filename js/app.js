/* ============================================================
 * 【逻辑层】js/app.js
 * 负责：渲染列表 / 搜索 / 分类 / 详情渲染 / 步骤折叠 / 主题 / 动效
 * 依赖：js/data.js 中的 SITE_CONFIG、CATEGORIES、PRODUCTS
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
    activeId: null
  };

  /* ---------------- DOM 缓存 ---------------- */
  function $(sel) { return document.querySelector(sel); }

  var els = {
    cardList:       $("#cardList"),
    categoryBar:    $("#categoryBar"),
    detail:         $("#detail"),
    empty:          $("#empty"),
    resultCount:    $("#resultCount"),
    searchInput:    $("#searchInput"),
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
    homeSubtitle:   $("#homeSubtitle")
  };

  var THEME_KEY = "tutorial-site-theme";

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
    els.toast.textContent = msg;
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

  /* ---------------- 初始化站点文案 ---------------- */
  // 功能：初始化站点名称和 Logo
  function initBrand() {
    if (typeof SITE_CONFIG === "undefined") return;
    if (SITE_CONFIG.brand) els.brandText.textContent = SITE_CONFIG.brand;
    if (SITE_CONFIG.logoImage) {
      var logoImage = document.createElement("img");
      logoImage.src = SITE_CONFIG.logoImage;
      logoImage.alt = SITE_CONFIG.brand || "网站 Logo";
      els.brandLogo.textContent = "";
      els.brandLogo.appendChild(logoImage);
    } else if (SITE_CONFIG.logo) {
      els.brandLogo.textContent = SITE_CONFIG.logo;
    }
    if (SITE_CONFIG.searchPlaceholder) els.searchInput.placeholder = SITE_CONFIG.searchPlaceholder;
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

      if (!children.length || !templates.length) {
        templates.forEach(function (p) { result.push(p); });
        return;
      }

      children.forEach(function (child, index) {
        var childValue = child.value || child.id || child.label || ("子类 " + (index + 1));
        var template = templates.filter(function (p) {
          return p.id === child.productId;
        })[0] || templates[0];
        var item = copyObject(template);
        var childContent = (typeof SUBCATEGORY_CONTENT !== "undefined" && child.id)
          ? SUBCATEGORY_CONTENT[child.id]
          : null;

        Object.keys(child).forEach(function (key) { item[key] = child[key]; });
        item.id = child.id || (template.id + "-" + (index + 1));
        item.name = child.name || (template.name + " · " + (child.label || childValue));
        item.category = cat.value;
        item.parentId = template.id;
        item.parentName = cat.label || cat.value;
        item.parentIcon = cat.icon || template.icon || "📁";
        item.subcategory = childValue;
        item.subcategoryLabel = child.label || childValue;
        item.desc = child.desc !== undefined
          ? child.desc
          : (childContent && childContent.desc !== undefined ? childContent.desc : template.desc);
        item.keywords = child.keywords !== undefined
          ? child.keywords
          : (childContent && childContent.keywords !== undefined ? childContent.keywords : template.keywords);
        item.steps = child.steps || (childContent && childContent.steps) || template.steps;

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
  function categoryLabel(p) {
    var category = p.category || "未分类";
    return p.subcategoryLabel ? category + " › " + p.subcategoryLabel : category;
  }

  /* ---------------- 同步分类按钮状态 ---------------- */
  // 功能：同步侧边分类按钮状态
  function syncCategoryButtons() {
    Array.prototype.forEach.call(els.categoryBar.querySelectorAll(".cat-btn"), function (btn) {
      var isHome = btn.dataset.home === "home";
      var active = isHome
        ? state.page === "home"
        : (state.page !== "home" && state.category === btn.dataset.value);
      if (!isHome && btn.dataset.child) {
        active = active && state.subcategory === btn.dataset.child;
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
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      toggle.setAttribute("aria-label", (expanded ? "收纳" : "展开") + groupLabel + "子类目");
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

    Array.prototype.forEach.call(els.categoryBar.querySelectorAll(".cat-group"), function (group) {
      if (group.dataset.value !== catValue) return;
      syncGroupExpansion(group, expanded, ".cat-toggle", ".cat-children", ".cat-btn");
    });

    Array.prototype.forEach.call(els.cardList.querySelectorAll(".card-group"), function (group) {
      if (group.dataset.value !== catValue) return;
      syncGroupExpansion(group, expanded, ".card-group-toggle", ".card-group-body", ".card");
    });
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
  }

  // 功能：切换到首页视图
  function showHome() {
    state.page = "home";
    state.category = "all";
    state.subcategory = "";
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
    els.empty.hidden = true;
    els.detail.hidden = true;
    renderCards();
    closeSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 功能：从首页打开指定目录或子目录
  function openHomeDirectory(categoryValue, subcategoryValue) {
    showTutorialView();
    state.category = categoryValue;
    state.subcategory = subcategoryValue || "";
    syncCategoryButtons();
    renderCards();
    setCategoryExpanded(categoryValue, true);

    var target = displayProducts.filter(function (p) {
      return p.category === categoryValue &&
        (!state.subcategory || p.subcategory === state.subcategory);
    })[0];

    if (target) {
      selectProduct(target.id);
    } else {
      els.empty.hidden = false;
      els.detail.hidden = true;
    }
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
  // 功能：渲染首页客服信息和目录卡片
  function renderHome() {
    if (!els.home || !els.homeGrid) return;
    var conf = (typeof HOME_CONFIG !== "undefined") ? HOME_CONFIG : {};
    var brand = conf.brand || "武汉租相机";

    if (els.homeKicker) els.homeKicker.textContent = brand;
    if (els.homeTitle) els.homeTitle.textContent = conf.title || "相机使用教程";
    if (els.homeSubtitle) els.homeSubtitle.textContent =
      conf.subtitle || "选择目录，快速查看对应教程";

    if (els.homeServices) {
      els.homeServices.innerHTML = "";
      (conf.services || []).forEach(function (service) {
        var serviceCard = document.createElement("article");
        serviceCard.className = "home-service-card";
        serviceCard.innerHTML =
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

    CATEGORIES.filter(function (cat) { return cat.value !== "all"; }).forEach(function (cat, index) {
      var template = displayProducts.filter(function (p) { return p.category === cat.value; })[0];
      var card = document.createElement("article");
      card.className = "home-card";
      card.style.setProperty("--home-color", cat.homeColor || (template && template.color) || "#4f46e5");
      card.style.animationDelay = (index * 55) + "ms";

      var mainButton = document.createElement("button");
      mainButton.type = "button";
      mainButton.className = "home-card-main";
      mainButton.innerHTML =
        '<span class="home-card-art">' +
          (cat.homeImage
            ? '<img src="' + esc(cat.homeImage) + '" alt="" loading="lazy">'
            : '<span class="home-card-emoji" aria-hidden="true">' + esc(cat.homeIcon || cat.icon || "📷") + "</span>") +
        "</span>" +
        '<span class="home-card-copy">' +
          '<span class="home-card-brand">' + esc(brand) + "</span>" +
          '<span class="home-card-title">' + esc(cat.label || cat.value) + "</span>" +
          '<span class="home-card-desc">' + esc(cat.homeDesc || ("查看" + (cat.label || cat.value) + "教程")) + "</span>" +
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
        subBtn.textContent = child.label || child.value;
        subBtn.addEventListener("click", function () {
          openHomeDirectory(cat.value, child.value || child.label || child.id);
        });
        subList.appendChild(subBtn);
      });

      card.appendChild(mainButton);
      if (subList.children.length) card.appendChild(subList);
      els.homeGrid.appendChild(card);
    });
  }

  /* ---------------- 渲染分类按钮 ---------------- */
  // 功能：渲染侧边首页与分类按钮
  function renderCategories() {
    if (typeof CATEGORIES === "undefined") return;
    els.categoryBar.innerHTML = "";

    /* 侧边首页按钮：只显示“首页”，不改变原有分类按钮 */
    var homeBtn = document.createElement("button");
    homeBtn.type = "button";
    homeBtn.className = "cat-btn cat-home-btn" + (state.page === "home" ? " active" : "");
    homeBtn.textContent = "首页";
    homeBtn.dataset.home = "home";
    homeBtn.setAttribute("aria-pressed", state.page === "home" ? "true" : "false");
    homeBtn.style.animation = "fadeUp .35s var(--ease) both";
    homeBtn.addEventListener("click", showHome);
    els.categoryBar.appendChild(homeBtn);

    /* 顶部“全部展开 / 全部收纳”按钮 */
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
        setAllCategoriesExpanded(tool.action === "expand");
      });
      toolbar.appendChild(toolBtn);
    });

    els.categoryBar.appendChild(toolbar);

    CATEGORIES.forEach(function (cat, i) {
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
      btn.textContent = cat.label || cat.value;
      btn.dataset.value = cat.value;
      btn.dataset.child = "";
      btn.setAttribute("aria-pressed", state.category === cat.value ? "true" : "false");
      btn.style.animation = "fadeUp .35s var(--ease) " + (i * 40) + "ms both";

      btn.addEventListener("click", function () {
        openHomeDirectory(cat.value, "");
      });

      parentRow.appendChild(btn);

      if (canExpand) {
        var toggle = document.createElement("button");
        var subListId = "category-children-" + i;
        toggle.type = "button";
        toggle.className = "cat-toggle";
        toggle.textContent = "⌄";
        toggle.setAttribute("aria-expanded", isExpanded ? "true" : "false");
        toggle.setAttribute("aria-controls", subListId);
        toggle.setAttribute(
          "aria-label",
          (isExpanded ? "收纳" : "展开") + (cat.label || cat.value) + "子类目"
        );
        toggle.addEventListener("click", function (e) {
          e.stopPropagation();
          setCategoryExpanded(cat.value, !expandedCategories[cat.value]);
        });
        parentRow.appendChild(toggle);
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
          childBtn.textContent = child.label || childValue;
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

  /* ---------------- 过滤逻辑 ---------------- */
  // 功能：按分类和关键词筛选教程
  function getFiltered() {
    var source = getProductSource();
    var kw = state.keyword.trim().toLowerCase();

    return source.filter(function (p) {
      if (state.category !== "all" && p.category !== state.category) return false;
      if (state.subcategory && p.subcategory !== state.subcategory) return false;
      if (!kw) return true;

      var haystack = [
        p.name, p.desc, p.category, p.parentName || "", p.subcategoryLabel || "", p.keywords || ""
      ].concat((p.steps || []).map(function (s) { return s.title; }))
       .join(" ")
       .toLowerCase();

      return haystack.indexOf(kw) !== -1;
    });
  }

  /* ---------------- 创建单个教程卡片 ---------------- */
  // 功能：创建单个教程卡片
  function createProductCard(p, index) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "card" + (state.activeId === p.id ? " active" : "");
    card.dataset.id = p.id;
    card.style.setProperty("--accent-color", p.color || "#4f46e5");
    card.style.animationDelay = (index * 45) + "ms";

    card.innerHTML =
      '<span class="card-icon">' + esc(p.icon || "📦") + "</span>" +
      '<span class="card-main">' +
        '<span class="card-name">' + esc(p.name) + "</span>" +
        '<span class="card-desc">' + esc(p.desc || "") + "</span>" +
        '<span class="card-meta">' +
          '<span class="chip">' + esc(categoryLabel(p)) + "</span>" +
          (p.tag ? '<span class="chip chip-hot">' + esc(p.tag) + "</span>" : "") +
          '<span class="chip chip-plain">' + (p.steps ? p.steps.length : 0) + " 步</span>" +
        "</span>" +
      "</span>" +
      '<span class="card-arrow">›</span>';

    card.addEventListener("click", function (e) {
      ripple(e, card);
      selectProduct(p.id);
      closeSidebar();
    });

    return card;
  }

  /* ---------------- 渲染商品卡片列表 ---------------- */
  // 功能：渲染按主目录分组的卡片列表
  function renderCards() {
    var list = getFiltered();

    els.resultCount.textContent = list.length;
    els.resultCount.classList.add("pop");
    setTimeout(function () { els.resultCount.classList.remove("pop"); }, 300);

    els.cardList.innerHTML = "";

    if (!list.length) {
      els.cardList.innerHTML =
        '<div class="no-result">😕 没有找到匹配的商品<br><span>换个关键词或分类试试</span></div>';
      return;
    }

    var groups = [];
    var groupMap = {};
    var searching = !!state.keyword.trim();

    list.forEach(function (p) {
      var key = p.category || "未分类";
      if (!groupMap[key]) {
        groupMap[key] = {
          value: key,
          label: p.parentName || key,
          icon: p.parentIcon || p.icon || "📁",
          color: p.color || "#4f46e5",
          items: []
        };
        groups.push(groupMap[key]);
      }
      groupMap[key].items.push(p);
    });

    groups.forEach(function (groupData, groupIndex) {
      var isExpanded = !!expandedCategories[groupData.value] || searching;
      var group = document.createElement("section");
      group.className = "card-group" + (isExpanded ? " open" : "") +
        (state.category === groupData.value ? " active" : "");
      group.dataset.value = groupData.value;
      group.dataset.label = groupData.label;
      group.style.setProperty("--group-color", groupData.color);

      var head = document.createElement("div");
      head.className = "card-group-head";

      var main = document.createElement("button");
      main.type = "button";
      main.className = "card-group-main" +
        (state.category === groupData.value ? " active" : "");
      main.dataset.value = groupData.value;
      main.dataset.child = "";
      main.setAttribute("aria-expanded", isExpanded ? "true" : "false");
      main.style.animation = "fadeUp .35s var(--ease) " + (groupIndex * 45) + "ms both";
      main.innerHTML =
        '<span class="card-group-name">' +
          '<span class="card-group-icon" aria-hidden="true">' + esc(groupData.icon) + '</span>' +
          "<span>" + esc(groupData.label) + "</span>" +
        "</span>" +
        '<span class="card-group-count">' + groupData.items.length + " 项</span>";

      main.addEventListener("click", function () {
        setCategoryExpanded(groupData.value, !expandedCategories[groupData.value]);
      });

      var toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "card-group-toggle";
      toggle.textContent = "⌄";
      toggle.setAttribute("aria-expanded", isExpanded ? "true" : "false");
      toggle.setAttribute("aria-label", (isExpanded ? "收纳" : "展开") + groupData.label + "子类目");
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        setCategoryExpanded(groupData.value, !expandedCategories[groupData.value]);
      });

      var body = document.createElement("div");
      body.className = "card-group-body";
      body.setAttribute("aria-hidden", isExpanded ? "false" : "true");

      var inner = document.createElement("div");
      inner.className = "card-group-inner";

      groupData.items.forEach(function (p, index) {
        var card = createProductCard(p, index);
        card.tabIndex = isExpanded ? 0 : -1;
        inner.appendChild(card);
      });

      head.appendChild(main);
      head.appendChild(toggle);
      body.appendChild(inner);
      group.appendChild(head);
      group.appendChild(body);
      els.cardList.appendChild(group);
    });
  }

  /* ---------------- 内容块渲染 ---------------- */
  // 功能：渲染教程正文内容块
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
          return '<div class="note note-tip"><span>💡</span><p>' + inline(b.text) + "</p></div>";

        case "warn":
          return '<div class="note note-warn"><span>⚠️</span><p>' + inline(b.text) + "</p></div>";

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

  /* ---------------- 渲染教程详情 ---------------- */
  // 功能：渲染完整教程详情
  function renderDetail(p) {
    var stepsHTML = (p.steps || []).map(function (s, i) {
      return '<section class="step' + (i === 0 ? " open" : "") + '" style="animation-delay:' + (i * 70) + 'ms">' +
        '<header class="step-head" role="button" tabindex="0" aria-expanded="' + (i === 0) + '">' +
          '<span class="step-no">' + (i + 1) + "</span>" +
          '<span class="step-icon">' + esc(s.icon || "📌") + "</span>" +
          '<h3 class="step-title">' + esc(s.title) + "</h3>" +
          '<span class="step-toggle">＋</span>' +
        "</header>" +
        '<div class="step-body"><div class="step-body-inner">' + renderBody(s.body) + "</div></div>" +
      "</section>";
    }).join("");

    return '' +
      '<div class="detail-hero" style="--accent-color:' + esc(p.color || "#4f46e5") + '">' +
        '<div class="hero-icon">' + esc(p.icon || "📦") + "</div>" +
        '<div class="hero-text">' +
          "<h1>" + esc(p.name) + "</h1>" +
          "<p>" + esc(p.desc || "") + "</p>" +
          '<div class="hero-chips">' +
            '<span class="chip">' + esc(categoryLabel(p)) + "</span>" +
            (p.tag ? '<span class="chip chip-hot">' + esc(p.tag) + "</span>" : "") +
            '<span class="chip chip-plain">共 ' + (p.steps ? p.steps.length : 0) + " 个步骤</span>" +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="steps">' + stepsHTML + "</div>" +
      '<div class="detail-foot">' +
        '<button class="btn btn-ghost" type="button" data-act="expand">展开全部</button>' +
        '<button class="btn btn-ghost" type="button" data-act="collapse">收起全部</button>' +
        '<button class="btn btn-primary" type="button" data-act="copy">复制教程链接</button>' +
      "</div>";
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

    state.page = "tutorial";
    if (els.home) els.home.hidden = true;
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
    Array.prototype.forEach.call(els.cardList.querySelectorAll(".card"), function (c) {
      c.classList.toggle("active", c.dataset.id === id);
    });

    els.empty.hidden = true;
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

    /* 移动端滚动到内容区 */
    if (window.innerWidth <= 820) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
      try { document.execCommand("copy"); done(); }
      catch (err) { toast("复制失败，请手动复制"); }
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
    /* 点击步骤头：折叠 / 展开；点击代码复制；点击底部按钮 */
    els.detail.addEventListener("click", function (e) {

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
  // 功能：绑定搜索输入事件
  function bindSearch() {
    var timer = null;
    els.searchInput.addEventListener("input", function (e) {
      clearTimeout(timer);
      var val = e.target.value;
      timer = setTimeout(function () {
        state.keyword = val;
        renderCards();
      }, 180);
    });
  }

  /* ---------------- 主题切换 ---------------- */
  // 功能：应用深浅主题
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    els.themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  // 功能：初始化主题和主题切换
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* 忽略 */ }

    var prefersDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    var theme = saved || (prefersDark ? "dark" : "light");
    applyTheme(theme);

    els.themeToggle.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* 忽略 */ }
    });
  }

  /* ---------------- 滚动进度 + 回顶按钮 ---------------- */
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
        els.scrollProgress.style.width = pct + "%";
        els.toTop.classList.toggle("show", doc.scrollTop > 420);
        ticking = false;
      });
    }, { passive: true });

    els.toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- 移动端侧栏 ---------------- */
  // 功能：打开移动端侧栏
  function openSidebar() {
    els.sidebar.classList.add("open");
    els.mask.classList.add("show");
  }
  // 功能：关闭移动端侧栏
  function closeSidebar() {
    els.sidebar.classList.remove("open");
    els.mask.classList.remove("show");
  }
  // 功能：绑定移动端侧栏事件
  function bindSidebar() {
    els.menuToggle.addEventListener("click", function () {
      if (els.sidebar.classList.contains("open")) { closeSidebar(); }
      else { openSidebar(); }
    });
    els.mask.addEventListener("click", closeSidebar);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSidebar();
    });
  }

  /* ---------------- 启动 ---------------- */
  // 功能：初始化网站所有模块
  function init() {
    initBrand();
    buildDisplayProducts();
    renderHome();
    renderCategories();
    renderCards();
    bindSearch();
    bindDetailEvents();
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
