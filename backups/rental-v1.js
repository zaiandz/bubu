/* ============================================================
 * 【租赁页】js/rental.js —— 纯前端渲染与交互（无任何后端依赖）
 * 数据：js/rental-data.js（window.RENTAL_DATA）
 * 功能：类目筛选 / 搜索 / 机型网格 / 参数弹窗 / 客服二维码 / 主题 / 滚动进度
 * ============================================================ */
(function () {
  "use strict";

  var DATA = window.RENTAL_DATA || { categories: [], services: [] };
  var THEME_KEY = "tutorial-site-theme";

  var state = {
    category: "all",
    keyword: "",
    activeId: null
  };

  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  var els = {
    body: document.body,
    stats: $("#rentalStats"),
    filter: $("#rentalFilter"),
    count: $("#rentalCount"),
    clear: $("#rentalClear"),
    sections: $("#rentalSections"),
    empty: $("#rentalEmpty"),
    services: $("#rentalServices"),
    search: $("#rentalSearch"),
    modal: $("#rentalModal"),
    modalBody: $("#rentalModalBody"),
    toast: $("#rentalToast"),
    top: $("#rentalTop"),
    progress: $("#scrollProgress"),
    menu: $("#rentalMenu"),
    theme: $("#themeToggle"),
    brandLogo: $(".brand-logo")
  };

  /* ---------------- 工具 ---------------- */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function normalize(v) {
    return String(v || "").toLowerCase().replace(/\s+/g, "");
  }

  /* 展平所有机型，便于搜索与统计 */
  function allItems() {
    var list = [];
    DATA.categories.forEach(function (cat) {
      cat.items.forEach(function (item) {
        list.push({ cat: cat, item: item });
      });
    });
    return list;
  }

  function matchKeyword(entry) {
    var kw = normalize(state.keyword);
    if (!kw) return true;
    var item = entry.item;
    var hay = normalize([
      item.name, item.full, item.brand, item.scene,
      (item.tags || []).join(" "), (item.highlights || []).join(" "),
      entry.cat.title, entry.cat.brand,
      (item.specs || []).map(function (row) { return row.join(" "); }).join(" ")
    ].join(" "));
    return hay.indexOf(kw) !== -1;
  }

  /* ---------------- 首屏统计 ---------------- */
  function renderStats() {
    var all = allItems();
    var catCount = DATA.categories.length;
    var brandCount = Object.keys(all.reduce(function (m, e) { m[e.item.brand] = 1; return m; }, {})).length;
    var hot = all.filter(function (e) { return e.item.hot; }).length;
    var stats = [
      { value: catCount, label: "设备类目" },
      { value: all.length, label: "可租型号" },
      { value: brandCount, label: "合作品牌" },
      { value: hot, label: "热门推荐" }
    ];
    els.stats.innerHTML = stats.map(function (s) {
      return '<div class="rt-stat"><b data-num="' + s.value + '">0</b><span>' + esc(s.label) + "</span></div>";
    }).join("");
    $$(".rt-stat b", els.stats).forEach(function (b) {
      countUp(b, Number(b.getAttribute("data-num")));
    });
  }

  function countUp(el, target) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.textContent = target; return; }
    var start = null;
    function frame(now) {
      if (!start) start = now;
      var p = Math.min(1, (now - start) / 800);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- 类目筛选条 ---------------- */
  function renderFilter() {
    var chips = [{ key: "all", title: "全部", count: allItems().length }].concat(
      DATA.categories.map(function (c) { return { key: c.key, title: c.title, count: c.items.length }; })
    );
    els.filter.innerHTML = chips.map(function (c) {
      var active = state.category === c.key ? " active" : "";
      return '<button class="rt-chip' + active + '" type="button" data-cat="' + esc(c.key) + '" aria-pressed="' +
        (state.category === c.key) + '">' + esc(c.title) +
        '<i>' + c.count + "</i></button>";
    }).join("");
  }

  /* ---------------- 机型网格 ---------------- */
  function cardHtml(entry, index) {
    var item = entry.item;
    var tags = (item.tags || []).slice(0, 3).map(function (t) {
      return '<span class="rt-tag">' + esc(t) + "</span>";
    }).join("");
    return (
      '<article class="rt-card' + (item.hot ? " is-hot" : "") + '" data-id="' + esc(item.id) + '" tabindex="0" ' +
        'role="button" aria-label="' + esc(item.full) + '，点击查看参数" style="--i:' + index + '">' +
        '<div class="rt-card-media">' +
          (item.hot ? '<span class="rt-flag">热门</span>' : "") +
          (item.artType === "line"
            ? '<img class="rt-art" src="' + esc(item.art) + '" alt="' + esc(item.name) + ' 线条示意图" loading="lazy">'
            : '<img class="rt-shot" src="' + esc(item.art) + '" alt="' + esc(item.name) + '" loading="lazy">') +
        "</div>" +
        '<div class="rt-card-body">' +
          '<div class="rt-card-brand">' + esc(item.brand) + "</div>" +
          '<h3 class="rt-card-title">' + esc(item.name) + "</h3>" +
          '<p class="rt-card-summary">' + esc(item.summary) + "</p>" +
          '<div class="rt-tags">' + tags + "</div>" +
          '<ul class="rt-points">' + (item.highlights || []).slice(0, 2).map(function (h) {
            return "<li>" + esc(h) + "</li>";
          }).join("") + "</ul>" +
          '<div class="rt-card-foot">' +
            '<span class="rt-scene">' + esc(item.scene || "") + "</span>" +
            '<span class="rt-more">查看参数 <i aria-hidden="true">→</i></span>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function renderSections() {
    var kw = state.keyword.trim();
    var groups = DATA.categories.map(function (cat) {
      if (state.category !== "all" && state.category !== cat.key) return null;
      var items = cat.items.filter(function (item) { return matchKeyword({ cat: cat, item: item }); });
      if (!items.length) return null;
      return { cat: cat, items: items };
    }).filter(Boolean);

    var total = groups.reduce(function (n, g) { return n + g.items.length; }, 0);
    els.count.textContent = kw ? "搜索到 " + total + " 个型号" : total + " 个型号";
    els.clear.hidden = !(kw || state.category !== "all");

    if (!total) {
      els.sections.innerHTML = "";
      els.empty.hidden = false;
      return;
    }
    els.empty.hidden = true;

    els.sections.innerHTML = groups.map(function (g) {
      return (
        '<section class="rt-group" id="rt-' + esc(g.cat.key) + '" style="--accent:' + esc(g.cat.accent) + '">' +
          '<div class="rt-group-head">' +
            '<h2 class="rt-group-title">' + esc(g.cat.title) + "<span>" + esc(g.cat.brand) + "</span></h2>" +
            '<p class="rt-group-desc">' + esc(g.cat.desc) + "</p>" +
            '<span class="rt-group-count">' + g.items.length + " 个型号</span>" +
          "</div>" +
          '<div class="rt-grid">' + g.items.map(function (item, idx) {
            return cardHtml({ cat: g.cat, item: item }, idx);
          }).join("") + "</div>" +
        "</section>"
      );
    }).join("");

    observeCards();
  }

  /* 卡片进入视口时淡入 */
  var io = null;
  function observeCards() {
    if (!("IntersectionObserver" in window)) return;
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in-view");
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    }
    $$(".rt-card").forEach(function (card) {
      card.classList.add("rt-reveal");
      io.observe(card);
    });
  }

  /* ---------------- 参数弹窗 ---------------- */
  var lastFocus = null;

  function openModal(id) {
    var entry = allItems().filter(function (e) { return e.item.id === id; })[0];
    if (!entry) return;
    var item = entry.item;
    var cat = entry.cat;
    state.activeId = id;
    lastFocus = document.activeElement;

    els.modalBody.innerHTML = (
      '<div class="rt-modal-head" style="--accent:' + esc(cat.accent) + '">' +
        '<div class="rt-modal-media">' +
          '<img src="' + esc(item.art) + '" alt="' + esc(item.name) + '" />' +
        "</div>" +
        '<div class="rt-modal-title">' +
          '<span class="rt-card-brand">' + esc(item.brand) + " · " + esc(cat.title) + "</span>" +
          '<h2 id="modalTitle">' + esc(item.name) + "</h2>" +
          '<p>' + esc(item.full) + "</p>" +
          '<div class="rt-tags">' + (item.tags || []).map(function (t) {
            return '<span class="rt-tag">' + esc(t) + "</span>";
          }).join("") + "</div>" +
        "</div>" +
      "</div>" +
      '<div class="rt-modal-grid">' +
        '<div class="rt-modal-col">' +
          '<h3 class="rt-modal-sub">核心参数</h3>' +
          '<dl class="rt-spec-list">' + (item.specs || []).map(function (row) {
            return "<div><dt>" + esc(row[0]) + "</dt><dd>" + esc(row[1]) + "</dd></div>";
          }).join("") + "</dl>" +
        "</div>" +
        '<div class="rt-modal-col">' +
          '<h3 class="rt-modal-sub">这台适合做什么</h3>' +
          '<p class="rt-modal-scene">' + esc(item.scene || "") + "</p>" +
          '<h3 class="rt-modal-sub">产品优点</h3>' +
          '<ul class="rt-modal-points">' + (item.highlights || []).map(function (h) {
            return "<li>" + esc(h) + "</li>";
          }).join("") + "</ul>" +
          '<h3 class="rt-modal-sub">租赁包含</h3>' +
          '<div class="rt-includes">' + (item.includes || []).map(function (x) {
            return '<span class="rt-include">✓ ' + esc(x) + "</span>";
          }).join("") + "</div>" +
        "</div>" +
      "</div>" +
      '<div class="rt-modal-foot">' +
        '<p class="rt-source">参数来源：<a href="' + esc(item.source) + '" target="_blank" rel="noopener noreferrer">品牌官方页面</a>' +
          "（以实物为准，租赁前可向客服确认）</p>" +
        '<div class="rt-modal-actions">' +
          '<button class="btn btn-primary" type="button" data-support>咨询这台</button>' +
          '<a class="btn btn-ghost" href="index.html?p=' + esc(item.id) + '">查看使用教程</a>' +
        "</div>" +
      "</div>"
    );

    els.modal.classList.add("show");
    els.modal.setAttribute("aria-hidden", "false");
    els.body.classList.add("rt-modal-open");
    var closeBtn = els.modal.querySelector(".rt-modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!els.modal.classList.contains("show")) return;
    els.modal.classList.remove("show");
    els.modal.setAttribute("aria-hidden", "true");
    els.body.classList.remove("rt-modal-open");
    state.activeId = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------------- 客服二维码 ---------------- */
  function renderServices() {
    els.services.innerHTML = (DATA.services || []).map(function (s) {
      return (
        '<article class="home-service-card">' +
          '<span class="service-dot" aria-hidden="true"></span>' +
          '<div class="home-service-copy">' +
            '<h3 class="home-service-title">' + esc(s.title) + "</h3>" +
            '<p class="home-service-hours">' + esc(s.hours) + "</p>" +
            '<p class="rt-service-tip">扫码后说明想租的机型与使用日期</p>' +
          "</div>" +
          '<div class="home-service-qr">' +
            '<img src="' + esc(s.qr) + '" alt="' + esc(s.title) + '二维码" loading="lazy" data-qr="' + esc(s.title) + '">' +
            "<span>" + esc(s.qrText) + "</span>" +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  /* 二维码放大（复用教程页的交互习惯） */
  var qrBox = null;
  function openQr(src, title) {
    if (!qrBox) {
      qrBox = document.createElement("div");
      qrBox.className = "qr-preview";
      qrBox.setAttribute("aria-hidden", "true");
      qrBox.innerHTML = '<img class="qr-preview-image" alt=""><div class="qr-preview-hint">点击任意位置关闭</div>';
      qrBox.addEventListener("click", closeQr);
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeQr();
      });
      document.body.appendChild(qrBox);
    }
    var img = qrBox.querySelector("img");
    img.src = src;
    img.alt = title || "客服二维码";
    qrBox.classList.add("show");
    qrBox.setAttribute("aria-hidden", "false");
    document.body.classList.add("qr-open");
  }

  function closeQr() {
    if (!qrBox) return;
    qrBox.classList.remove("show");
    qrBox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("qr-open");
  }

  /* ---------------- 轻提示 ---------------- */
  var toastTimer = null;
  function toast(msg) {
    if (!els.toast) return;
    els.toast.querySelector(".toast-text").textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.classList.remove("show"); }, 1800);
  }

  /* ---------------- 点按涟漪 ---------------- */
  function ripple(e, el) {
    var rect = el.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 1.6;
    var span = document.createElement("span");
    span.className = "rt-ripple";
    span.style.width = span.style.height = size + "px";
    span.style.left = (e.clientX - rect.left - size / 2) + "px";
    span.style.top = (e.clientY - rect.top - size / 2) + "px";
    el.appendChild(span);
    setTimeout(function () { span.remove(); }, 620);
  }

  /* ---------------- 主题 ---------------- */
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";
    if (document.body) document.body.dataset.theme = theme;
    if (els.theme) {
      els.theme.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      els.theme.setAttribute("title", theme === "dark" ? "切换为浅色模式" : "切换为深色模式");
    }
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* 忽略 */ }
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));
    if (els.theme) {
      els.theme.addEventListener("click", function () {
        var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* 忽略 */ }
      });
    }
  }

  /* ---------------- 事件绑定 ---------------- */
  function bindEvents() {
    /* 类目筛选 */
    els.filter.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-cat]");
      if (!chip) return;
      state.category = chip.getAttribute("data-cat");
      renderFilter();
      renderSections();
      var target = document.getElementById("lineup");
      if (target) {
        var top = target.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    });

    /* 清除筛选 */
    els.clear.addEventListener("click", function () {
      state.category = "all";
      state.keyword = "";
      els.search.value = "";
      renderFilter();
      renderSections();
    });

    /* 搜索 */
    var timer = null;
    els.search.addEventListener("input", function (e) {
      clearTimeout(timer);
      var val = e.target.value;
      timer = setTimeout(function () {
        state.keyword = val;
        renderSections();
      }, 160);
    });

    /* 卡片点击 / 键盘打开弹窗 */
    els.sections.addEventListener("click", function (e) {
      var card = e.target.closest(".rt-card");
      if (!card) return;
      ripple(e, card);
      openModal(card.getAttribute("data-id"));
    });
    els.sections.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var card = e.target.closest(".rt-card");
      if (!card) return;
      e.preventDefault();
      openModal(card.getAttribute("data-id"));
    });

    /* 弹窗关闭：遮罩、按钮、Esc、点「咨询」 */
    els.modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) { closeModal(); return; }
      if (e.target.closest("[data-support]")) {
        var id = state.activeId;
        closeModal();
        var msg = id ? "已定位到客服区，请扫码说明型号与日期" : "请扫码联系客服";
        goSupport();
        toast(msg);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
      if (e.key === "/" && document.activeElement && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
        e.preventDefault();
        els.search.focus();
      }
    });

    /* 客服按钮 / 链接 / 二维码放大（弹窗内的「咨询这台」由弹窗自身处理，避免重复提示） */
    document.addEventListener("click", function (e) {
      if (e.target.closest(".rt-modal-panel")) return;
      var btn = e.target.closest("[data-support]");
      if (btn) { goSupport(); return; }
      var qr = e.target.closest("[data-qr]");
      if (qr) { openQr(qr.getAttribute("src"), qr.getAttribute("data-qr")); }
    });

    /* 顶部回顶与进度条 */
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var doc = document.documentElement;
        var max = doc.scrollHeight - doc.clientHeight;
        els.progress.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + "%";
        els.top.classList.toggle("show", doc.scrollTop > 420);
        document.body.classList.toggle("is-scrolled", doc.scrollTop > 8);
        ticking = false;
      });
    }, { passive: true });
    els.top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* 移动端菜单：跳到筛选条 */
    if (els.menu) {
      els.menu.addEventListener("click", function () {
        var target = document.getElementById("lineup");
        if (target) {
          var top = target.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
      });
    }
  }

  function goSupport() {
    var target = document.getElementById("support");
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    target.classList.remove("section-flash");
    void target.offsetWidth;
    target.classList.add("section-flash");
  }

  /* ---------------- 初始化 ---------------- */
  function init() {
    try {
      var logo = (window.SITE_LOGO || "images/logo-mark.png");
      var img = document.createElement("img");
      img.src = logo;
      img.alt = "视感闪租";
      if (els.brandLogo) {
        els.brandLogo.textContent = "";
        els.brandLogo.appendChild(img);
      }
    } catch (e) { /* 忽略 */ }

    renderStats();
    renderFilter();
    renderSections();
    renderServices();
    initTheme();
    bindEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
