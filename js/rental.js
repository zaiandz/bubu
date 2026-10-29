/* ============================================================
 * 【租赁页】js/rental.js —— 纯前端渲染与交互（无任何后端依赖）
 * 数据：js/rental-data.js（window.RENTAL_DATA）
 * 结构：每个型号一张横向卡片；点击后在弹窗中切换 / 查看套餐内容
 * ============================================================ */
(function () {
  "use strict";

  var DATA = window.RENTAL_DATA || { categories: [], services: [] };
  var THEME_KEY = "tutorial-site-theme";
  var state = { category: "all", keyword: "", activeId: null, activeVariant: 0 };

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  var els = {
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
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function norm(v) { return String(v || "").toLowerCase().replace(/\s+/g, ""); }

  function allItems() {
    var out = [];
    DATA.categories.forEach(function (cat) {
      cat.items.forEach(function (item) { out.push({ cat: cat, item: item }); });
    });
    return out;
  }

  function variantCount() {
    return allItems().reduce(function (n, e) { return n + ((e.item.variants || []).length || 1); }, 0);
  }

  function matchKeyword(entry) {
    var kw = norm(state.keyword);
    if (!kw) return true;
    var it = entry.item;
    var hay = norm([
      it.name, it.full, it.brand, it.scene,
      (it.tags || []).join(" "), (it.highlights || []).join(" "),
      entry.cat.title, entry.cat.brand,
      (it.variants || []).map(function (v) { return [v.name, v.tag, v.suitable, v.desc].join(" "); }).join(" "),
      (it.specs || []).map(function (r) { return r.join(" "); }).join(" ")
    ].join(" "));
    return hay.indexOf(kw) !== -1;
  }

  /* ---------------- 首屏统计 ---------------- */
  function renderStats() {
    var all = allItems();
    /* 统计项：已移除「合作品牌」，保留类目 / 型号 / 套餐三项 */
    var stats = [
      { v: DATA.categories.length, l: "设备类目" },
      { v: all.length, l: "在租型号" },
      { v: variantCount(), l: "可选套餐" }
    ];
    els.stats.innerHTML = stats.map(function (s) {
      return '<div class="rt-stat"><b data-num="' + s.v + '">0</b><span>' + esc(s.l) + "</span></div>";
    }).join("");
    $$("[data-num]", els.stats).forEach(function (b) { countUp(b, Number(b.getAttribute("data-num"))); });
  }

  function countUp(el, target) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = target; return;
    }
    var start = null;
    function frame(now) {
      if (!start) start = now;
      var p = Math.min(1, (now - start) / 800);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- 类目筛选 ---------------- */
  function renderFilter() {
    var chips = [{ key: "all", title: "全部", n: allItems().length }].concat(
      DATA.categories.map(function (c) { return { key: c.key, title: c.title, n: c.items.length }; })
    );
    els.filter.innerHTML = chips.map(function (c) {
      return '<button class="rt-chip' + (state.category === c.key ? " active" : "") + '" type="button" data-cat="' +
        esc(c.key) + '" aria-pressed="' + (state.category === c.key) + '">' + esc(c.title) +
        "<i>" + c.n + "</i></button>";
    }).join("");
  }

  /* ---------------- 横向型号卡片 ---------------- */
  function cardHtml(entry, idx) {
    var it = entry.item;
    var cat = entry.cat;
    var variants = it.variants || [];
    var variantLabel = variants.length > 1
      ? variants.length + " 种套餐可选"
      : (variants[0] ? variants[0].name : "标准配置");

    return (
      '<article class="rt-card' + (it.hot ? " is-hot" : "") + '" data-id="' + esc(it.id) + '" tabindex="0" ' +
        'role="button" aria-label="' + esc(it.full) + '，点击选择套餐" style="--i:' + idx + ';--accent:' + esc(cat.accent) + '">' +
        '<div class="rt-card-media">' +
          (it.hot ? '<span class="rt-flag">热门</span>' : "") +
          '<img class="rt-shot" src="' + esc(it.art) + '" alt="' + esc(it.name) + ' 白底产品图" loading="lazy">' +
        "</div>" +
        '<div class="rt-card-body">' +
          '<div class="rt-card-top">' +
            '<span class="rt-card-brand">' + esc(it.brand) + "</span>" +
            '<div class="rt-tags">' + (it.tags || []).slice(0, 3).map(function (t) {
              return '<span class="rt-tag">' + esc(t) + "</span>";
            }).join("") + "</div>" +
          "</div>" +
          '<h3 class="rt-card-title">' + esc(it.name) + "</h3>" +
          '<p class="rt-card-summary">' + esc(it.summary) + "</p>" +
          '<ul class="rt-points">' + (it.highlights || []).slice(0, 2).map(function (h) {
            return "<li>" + esc(h) + "</li>";
          }).join("") + "</ul>" +
          '<div class="rt-card-foot">' +
            '<span class="rt-variant-badge">' +
              '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
              esc(variantLabel) +
            "</span>" +
            '<span class="rt-scene">' + esc(it.scene || "") + "</span>" +
            '<span class="rt-more">选择套餐 <i aria-hidden="true">→</i></span>' +
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
      return items.length ? { cat: cat, items: items } : null;
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
          '<div class="rt-list">' + g.items.map(function (item, i) {
            return cardHtml({ cat: g.cat, item: item }, i);
          }).join("") + "</div>" +
        "</section>"
      );
    }).join("");

    observeCards();
  }

  var io = null;
  function observeCards() {
    if (!("IntersectionObserver" in window)) return;
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    }
    $$(".rt-card").forEach(function (c) { c.classList.add("rt-reveal"); io.observe(c); });
  }

  /* ---------------- 套餐弹窗 ---------------- */
  var lastFocus = null;

  function mkVariantTabs(item, active) {
    return (item.variants || []).map(function (v, i) {
      return '<button class="rt-vt' + (i === active ? " active" : "") + '" type="button" data-variant="' + i + '" ' +
        'role="tab" aria-selected="' + (i === active) + '">' +
        '<span class="rt-vt-name">' + esc(v.name) + "</span>" +
        (v.tag ? '<span class="rt-vt-tag">' + esc(v.tag) + "</span>" : "") +
        "</button>";
    }).join("");
  }

  function renderVariantPanel(item, idx) {
    var v = (item.variants || [])[idx] || { name: "标准配置", includes: [] };
    return (
      '<div class="rt-vpanel">' +
        '<div class="rt-vpanel-head">' +
          '<h3 class="rt-vpanel-title">' + esc(v.name) + "</h3>" +
          (v.priceHint ? '<span class="rt-vpanel-hint">' + esc(v.priceHint) + "</span>" : "") +
        "</div>" +
        (v.desc ? '<p class="rt-vpanel-desc">' + esc(v.desc) + "</p>" : "") +
        (v.suitable ? '<p class="rt-vpanel-suit"><b>适合</b>' + esc(v.suitable) + "</p>" : "") +
        '<div class="rt-includes">' + (v.includes || []).map(function (x) {
          return '<span class="rt-include">✓ ' + esc(x) + "</span>";
        }).join("") + "</div>" +
      "</div>"
    );
  }

  function openModal(id) {
    var entry = allItems().filter(function (e) { return e.item.id === id; })[0];
    if (!entry) return;
    var it = entry.item;
    var cat = entry.cat;
    state.activeId = id;
    state.activeVariant = 0;
    lastFocus = document.activeElement;
    var variants = it.variants || [];

    els.modalBody.innerHTML = (
      '<div class="rt-modal-head" style="--accent:' + esc(cat.accent) + '">' +
        '<div class="rt-modal-media"><img src="' + esc(it.art) + '" alt="' + esc(it.name) + '"></div>' +
        '<div class="rt-modal-title">' +
          '<span class="rt-card-brand">' + esc(it.brand) + " · " + esc(cat.title) + "</span>" +
          '<h2 id="modalTitle">' + esc(it.name) + "</h2>" +
          "<p>" + esc(it.full) + "</p>" +
          '<div class="rt-tags">' + (it.tags || []).map(function (t) {
            return '<span class="rt-tag">' + esc(t) + "</span>";
          }).join("") + "</div>" +
        "</div>" +
      "</div>" +

      '<div class="rt-modal-variants">' +
        '<div class="rt-modal-sub-row">' +
          '<h3 class="rt-modal-sub">选择套餐</h3>' +
          '<span class="rt-variant-count">共 ' + variants.length + " 种可选</span>" +
        "</div>" +
        '<div class="rt-vtabs" role="tablist">' + mkVariantTabs(it, 0) + "</div>" +
        '<div class="rt-vcontainer" id="rtVariantPanel">' + renderVariantPanel(it, 0) + "</div>" +
      "</div>" +

      '<div class="rt-modal-grid">' +
        '<div class="rt-modal-col">' +
          '<h3 class="rt-modal-sub">核心参数</h3>' +
          '<dl class="rt-spec-list">' + (it.specs || []).map(function (r) {
            return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>";
          }).join("") + "</dl>" +
        "</div>" +
        '<div class="rt-modal-col">' +
          '<h3 class="rt-modal-sub">这台适合做什么</h3>' +
          '<p class="rt-modal-scene">' + esc(it.scene || "") + "</p>" +
          '<h3 class="rt-modal-sub">产品优点</h3>' +
          '<ul class="rt-modal-points">' + (it.highlights || []).map(function (h) {
            return "<li>" + esc(h) + "</li>";
          }).join("") + "</ul>" +
        "</div>" +
      "</div>" +

      '<div class="rt-modal-foot">' +
        '<p class="rt-source">参数来源：<a href="' + esc(it.source) + '" target="_blank" rel="noopener noreferrer">品牌官方页面</a>' +
          "（以实物为准，租赁前可向客服确认）</p>" +
        '<div class="rt-modal-actions">' +
          '<button class="btn btn-primary" type="button" data-support>咨询这台</button>' +
          '<a class="btn btn-ghost" href="index.html">查看使用教程</a>' +
        "</div>" +
      "</div>"
    );

    els.modal.classList.add("show");
    els.modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("rt-modal-open");
    var closeBtn = els.modal.querySelector(".rt-modal-close");
    if (closeBtn) {
      try { closeBtn.focus({ preventScroll: true }); } catch (err) { closeBtn.focus(); }
    }
  }

  function currentSelection() {
    var entry = allItems().filter(function (e) { return e.item.id === state.activeId; })[0];
    if (!entry) return null;
    return { entry: entry, variant: (entry.item.variants || [])[state.activeVariant] || null };
  }

  /* 把弹窗切换成“微信加好友”引导页：展示二维码 + 已选机型套餐 */
  function renderWechatView() {
    var sel = currentSelection();
    var wx = DATA.wechat || {};
    var item = sel ? sel.entry.item : null;
    var variant = sel ? sel.variant : null;
    var panel = els.modalBody;
    panel.innerHTML = (
      '<div class="rt-wx" style="--accent:' + esc(sel ? sel.entry.cat.accent : "#07c160") + '">' +
        '<div class="rt-wx-head">' +
          '<span class="rt-wx-badge">' +
            '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9.6 5.4c-3.6 0-6.6 2.4-6.6 5.4 0 1.7.9 3.2 2.4 4.2l-.6 1.8 2.1-1.1c.8.2 1.7.4 2.7.4h.6a5.6 5.6 0 0 1-.3-1.8c0-3 3-5.4 6.6-5.4h.5c-.8-2-3.6-3.5-6.7-3.5z" fill="currentColor"/><path d="M21.4 15.6c0-2.4-2.4-4.4-5.4-4.4s-5.4 2-5.4 4.4 2.4 4.4 5.4 4.4c.7 0 1.3-.1 1.9-.3l1.7.9-.5-1.5c1.4-.8 2.3-2.1 2.3-3.5z" fill="currentColor" opacity=".75"/></svg>' +
            "微信加好友" +
          "</span>" +
          (item ? '<button class="rt-wx-back" type="button" data-wx-back>‹ 返回参数</button>' : "") +
        "</div>" +

        '<h2 class="rt-wx-title">加微信，聊租赁</h2>' +
        '<p class="rt-wx-sub">' + esc(wx.tip || "扫码添加好友，咨询档期与价格") + "</p>" +

        '<div class="rt-wx-qr">' +
          '<img src="' + esc(wx.qr) + '" alt="' + esc(wx.name || "微信二维码") + '" class="rt-wx-img" data-qr="' + esc(wx.name || "微信好友") + '">' +
          '<span class="rt-wx-name">' + esc(wx.name || "租赁顾问") + "</span>" +
        "</div>" +

        /* 微信号 / 手机号：可直接复制，手机端手机号可一点拨号 */
        '<div class="rt-wx-contact">' +
          (wx.wechatId
            ? '<button class="rt-wx-item" type="button" data-copy="' + esc(wx.wechatId) + '" data-copy-label="微信号">' +
                '<span class="rt-wx-item-icon" aria-hidden="true">' +
                  '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M9.6 5.4c-3.6 0-6.6 2.4-6.6 5.4 0 1.7.9 3.2 2.4 4.2l-.6 1.8 2.1-1.1c.8.2 1.7.4 2.7.4h.6a5.6 5.6 0 0 1-.3-1.8c0-3 3-5.4 6.6-5.4h.5c-.8-2-3.6-3.5-6.7-3.5z" fill="currentColor" opacity=".55"/><path d="M21.4 15.6c0-2.4-2.4-4.4-5.4-4.4s-5.4 2-5.4 4.4 2.4 4.4 5.4 4.4c.7 0 1.3-.1 1.9-.3l1.7.9-.5-1.5c1.4-.8 2.3-2.1 2.3-3.5z" fill="currentColor"/></svg>' +
                "</span>" +
                '<span class="rt-wx-item-label">微信号</span>' +
                '<b class="rt-wx-item-value">' + esc(wx.wechatId) + "</b>" +
                '<span class="rt-wx-item-act">复制</span>' +
              "</button>"
            : "") +
          (wx.phone
            ? '<button class="rt-wx-item" type="button" data-copy="' + esc(wx.phone) + '" data-copy-label="手机号">' +
                '<span class="rt-wx-item-icon" aria-hidden="true">' +
                  '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M6.5 3.5h3l1.6 4-2 1.4a12 12 0 0 0 5.9 5.9l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" fill="currentColor"/></svg>' +
                "</span>" +
                '<span class="rt-wx-item-label">手机号</span>' +
                '<b class="rt-wx-item-value">' + esc(wx.phone) + "</b>" +
                '<span class="rt-wx-item-act">复制</span>' +
              "</button>"
            : "") +
        "</div>" +

        '<div class="rt-wx-steps">' +
          '<div class="rt-wx-step"><i>1</i>打开微信，点右上角「＋」选扫一扫</div>' +
          '<div class="rt-wx-step"><i>2</i>手机上长按下方二维码识别（电脑可直接扫）</div>' +
          '<div class="rt-wx-step"><i>3</i>也可直接搜索微信号或拨打电话联系</div>' +
        "</div>" +

        (item
          ? '<div class="rt-wx-msg">' +
              '<div class="rt-wx-msg-head">可直接复制发给客服</div>' +
              '<p class="rt-wx-msg-text">你好，我想租「' + esc(item.name) + "」" +
                (variant ? "，套餐选「" + esc(variant.name) + "」" : "") +
                "，想了解档期和价格，谢谢！</p>" +
              '<button class="btn btn-ghost rt-wx-copy" type="button" data-wx-copy>复制这句话</button>' +
            "</div>"
          : "") +
      "</div>"
    );
    // 截图/长按识别都方便：点击二维码可放大
    var qrImg = panel.querySelector(".rt-wx-img");
    if (qrImg) {
      qrImg.addEventListener("click", function () {
        openQr(qrImg.getAttribute("src"), qrImg.getAttribute("alt"));
      });
    }
  }

  function copyConsultText(btn) {
    var text = els.modalBody.querySelector(".rt-wx-msg-text");
    if (!text) return;
    var val = text.textContent.trim();
    var done = function () {
      toast("已复制，去微信发给客服吧");
      if (btn) {
        btn.textContent = "已复制";
        setTimeout(function () { btn.textContent = "复制这句话"; }, 1800);
      }
    };
    /* 同步执行本地复制，保证点击后立即有反馈；剪贴板 API 在部分环境会挂起，不再阻塞 */
    var ok = fallbackCopy(val);
    if (ok) { done(); return; }

    /* 兜底：复制不可用时自动选中文字并提示，用户手动 Ctrl+C / 长按复制 */
    try {
      var range = document.createRange();
      range.selectNodeContents(text);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) { /* 忽略 */ }
    toast("已选中文字，按 Ctrl+C 或长按复制");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(val).then(done).catch(function () {});
    }
  }

  /* 复制任意文本（微信号 / 手机号），失败时选中并提示 */
  function copyValue(el, val, label) {
    if (!val) return;
    var ok = fallbackCopy(val);
    if (ok) {
      toast(label + "已复制：" + val);
    } else {
      toast("已选中" + label + "，按 Ctrl+C 或长按复制");
      try {
        var range = document.createRange();
        range.selectNodeContents(el.querySelector(".rt-wx-item-value") || el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } catch (err) { /* 忽略 */ }
    }
  }

  function fallbackCopy(val) {
    var ta = document.createElement("textarea");
    ta.value = val;
    ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  function switchVariant(idx) {
    var entry = allItems().filter(function (e) { return e.item.id === state.activeId; })[0];
    if (!entry) return;
    state.activeVariant = idx;
    $$(".rt-vt", els.modalBody).forEach(function (btn, i) {
      btn.classList.toggle("active", i === idx);
      btn.setAttribute("aria-selected", String(i === idx));
    });
    var panel = $("#rtVariantPanel");
    if (panel) {
      panel.innerHTML = renderVariantPanel(entry.item, idx);
      panel.classList.remove("rt-swap");
      void panel.offsetWidth;
      panel.classList.add("rt-swap");
      var inner = panel.querySelector(".rt-vpanel");
      if (inner) {
        inner.classList.remove("rt-swap");
        void inner.offsetWidth;
        inner.classList.add("rt-swap");
      }
    }
  }

  function closeModal() {
    if (!els.modal.classList.contains("show")) return;
    els.modal.classList.remove("show");
    els.modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("rt-modal-open");
    state.activeId = null;
    /* 关闭后把焦点还给触发卡片，但不让它改变页面滚动位置 */
    if (lastFocus && lastFocus.focus) {
      try {
        lastFocus.focus({ preventScroll: true });
      } catch (err) {
        lastFocus.focus();
      }
    }
  }

  /* ---------------- 客服 ---------------- */
  function renderServices() {
    els.services.innerHTML = (DATA.services || []).map(function (s) {
      return (
        '<article class="home-service-card">' +
          '<span class="service-dot" aria-hidden="true"></span>' +
          '<div class="home-service-copy">' +
            '<h3 class="home-service-title">' + esc(s.title) + "</h3>" +
            '<p class="home-service-hours">' + esc(s.hours) + "</p>" +
            '<p class="rt-service-tip">扫码后说明想租的型号、套餐与使用日期</p>' +
          "</div>" +
          '<div class="home-service-qr">' +
            '<img src="' + esc(s.qr) + '" alt="' + esc(s.title) + '二维码" loading="lazy" data-qr="' + esc(s.title) + '">' +
            "<span>" + esc(s.qrText) + "</span>" +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  var qrBox = null;
  function openQr(src, title) {
    if (!qrBox) {
      qrBox = document.createElement("div");
      qrBox.className = "qr-preview";
      qrBox.setAttribute("aria-hidden", "true");
      qrBox.innerHTML = '<img class="qr-preview-image" alt=""><div class="qr-preview-hint">点击任意位置关闭</div>';
      qrBox.addEventListener("click", closeQr);
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeQr(); });
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

  var toastTimer = null;
  function toast(msg) {
    if (!els.toast) return;
    els.toast.querySelector(".toast-text").textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.classList.remove("show"); }, 1800);
  }

  function goSupport() {
    var t = document.getElementById("support");
    if (!t) return;
    window.scrollTo({ top: Math.max(0, t.getBoundingClientRect().top + window.scrollY - 90), behavior: "smooth" });
    t.classList.remove("section-flash");
    void t.offsetWidth;
    t.classList.add("section-flash");
  }

  function ripple(e, el) {
    var r = el.getBoundingClientRect();
    var size = Math.max(r.width, r.height) * 1.6;
    var s = document.createElement("span");
    s.className = "rt-ripple";
    s.style.width = s.style.height = size + "px";
    s.style.left = (e.clientX - r.left - size / 2) + "px";
    s.style.top = (e.clientY - r.top - size / 2) + "px";
    el.appendChild(s);
    setTimeout(function () { s.remove(); }, 620);
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

  /* ---------------- 事件 ---------------- */
  function bindEvents() {
    els.filter.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-cat]");
      if (!chip) return;
      state.category = chip.getAttribute("data-cat");
      renderFilter();
      renderSections();
      var t = document.getElementById("lineup");
      if (t) window.scrollTo({ top: Math.max(0, t.getBoundingClientRect().top + window.scrollY - 120), behavior: "smooth" });
    });

    els.clear.addEventListener("click", function () {
      state.category = "all";
      state.keyword = "";
      els.search.value = "";
      renderFilter();
      renderSections();
    });

    var timer = null;
    els.search.addEventListener("input", function (e) {
      clearTimeout(timer);
      var val = e.target.value;
      timer = setTimeout(function () { state.keyword = val; renderSections(); }, 160);
    });

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

    /* 弹窗：套餐切换 / 关闭 / 咨询 */
    els.modal.addEventListener("click", function (e) {
      var tab = e.target.closest("[data-variant]");
      if (tab) { switchVariant(Number(tab.getAttribute("data-variant"))); return; }
      if (e.target.closest("[data-close]")) { closeModal(); return; }
      if (e.target.closest("[data-wx-copy]")) {
        copyConsultText(e.target.closest("[data-wx-copy]"));
        return;
      }
      var copyEl = e.target.closest("[data-copy]");
      if (copyEl) {
        copyValue(copyEl, copyEl.getAttribute("data-copy"), copyEl.getAttribute("data-copy-label") || "内容");
        return;
      }
      if (e.target.closest("[data-wx-back]")) {
        var saved = state.activeVariant;
        var reopenId = state.activeId;
        openModal(reopenId);
        if (saved > 0) switchVariant(saved);
        return;
      }
      if (e.target.closest("[data-support]")) {
        renderWechatView();
        return;
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
      if (e.key === "/" && document.activeElement && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
        e.preventDefault();
        els.search.focus();
      }
    });

    /* 页面级兜底：仅处理二维码放大。
       注意：「咨询这台」在弹窗内部，由弹窗自身切换为微信视图，
       这里不能再绑定 data-support，否则会额外滚动到客服区。 */
    document.addEventListener("click", function (e) {
      if (e.target.closest(".rt-modal-panel")) return;
      if (e.target.closest(".qr-preview")) return;
      var qr = e.target.closest("[data-qr]");
      if (qr) openQr(qr.getAttribute("src"), qr.getAttribute("data-qr"));
    });

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var d = document.documentElement;
        var max = d.scrollHeight - d.clientHeight;
        els.progress.style.width = (max > 0 ? (d.scrollTop / max) * 100 : 0) + "%";
        els.top.classList.toggle("show", d.scrollTop > Math.min(420, max * 0.33));
        document.body.classList.toggle("is-scrolled", d.scrollTop > 8);
        ticking = false;
      });
    }, { passive: true });

    els.top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

    if (els.menu) {
      els.menu.addEventListener("click", function () {
        var t = document.getElementById("lineup");
        if (t) window.scrollTo({ top: Math.max(0, t.getBoundingClientRect().top + window.scrollY - 90), behavior: "smooth" });
      });
    }
  }

  /* ---------------- 初始化 ---------------- */
  function init() {
    if (els.brandLogo) {
      var img = document.createElement("img");
      img.src = "images/logo-mark.png";
      img.alt = "视感闪租";
      els.brandLogo.textContent = "";
      els.brandLogo.appendChild(img);
    }
    renderStats();
    renderFilter();
    renderSections();
    renderServices();
    initTheme();
    bindEvents();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
