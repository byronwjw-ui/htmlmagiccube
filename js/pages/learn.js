// 学习区：OLL/PLL Tab + 子分类过滤 + 搜索 + 卡片网格
// 状态保存在 module 局部，页面重新 mount 时保留上次的筛选
import { analytics } from "../analytics.js";
import { store } from "../store.js";
import {
  listByCategory,
  listSubCategories,
  searchFormulas,
} from "../data/formulas.js";
import { topFaceSVG, openModal } from "../utils.js";
import { navigate } from "../router.js";

const state = {
  category: "OLL",      // 'OLL' | 'PLL'
  subCategory: null,    // null = 全部
  keyword: "",
};

export function renderLearn(outlet) {
  analytics.track("learn_view", { category: state.category });

  outlet.innerHTML = `
    <div class="container">
      <h1 class="page-title">学习区</h1>
      <p class="page-sub">选一个公式开始。黄锁 🔒 表示 Pro 专享。</p>

      <div class="learn-toolbar">
        <div class="tabs" id="cat-tabs" role="tablist">
          <button class="tab" data-cat="OLL" role="tab">OLL（57）</button>
          <button class="tab" data-cat="PLL" role="tab">PLL（21）</button>
        </div>
        <input class="input search" id="search" type="search" placeholder="搜索名称 / 编号 / 手法…" />
      </div>

      <div class="sub-filters" id="sub-filters"></div>
      <div id="grid"></div>
    </div>
  `;

  const $tabs = outlet.querySelector("#cat-tabs");
  const $search = outlet.querySelector("#search");
  const $subs = outlet.querySelector("#sub-filters");
  const $grid = outlet.querySelector("#grid");

  $search.value = state.keyword;

  // Tab 切换
  $tabs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    const cat = btn.getAttribute("data-cat");
    if (cat === state.category) return;
    state.category = cat;
    state.subCategory = null;
    analytics.track("learn_tab", { category: cat });
    paintTabs();
    paintSubs();
    paintGrid();
  });

  // 搜索（实时）
  let searchTimer = null;
  $search.addEventListener("input", (e) => {
    state.keyword = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      analytics.track("learn_search", { keyword: state.keyword });
      paintGrid();
    }, 120);
  });

  // 子分类 点击
  $subs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-sub]");
    if (!btn) return;
    const sub = btn.getAttribute("data-sub");
    state.subCategory = sub === "__all__" ? null : sub;
    paintSubs();
    paintGrid();
  });

  // 卡片点击
  $grid.addEventListener("click", (e) => {
    const card = e.target.closest("[data-id]");
    if (!card) return;
    const id = card.getAttribute("data-id");
    const locked = card.getAttribute("data-locked") === "1";
    const cat = card.getAttribute("data-cat");
    if (locked && !store.getState().user?.isPremium) {
      analytics.track("premium_modal_show", { from: "learn_card", id });
      openModal({
        title: "🔒 这是 Pro 公式",
        body: "免费版本包含 10 个 OLL + 5 个 PLL 入门公式。解锁 Pro 后可以查看全部 78 个。",
        primary: "查看 Pro",
        secondary: "下次再说",
        onPrimary: () => {
          analytics.track("pricing_view", { from: "premium_modal" });
          navigate("/pricing");
        },
      });
      return;
    }
    analytics.track("formula_view", { id, from: "learn_grid" });
    navigate(`/learn/${cat}/${id}`);
  });

  paintTabs();
  paintSubs();
  paintGrid();

  function paintTabs() {
    $tabs.querySelectorAll(".tab").forEach((el) => {
      el.classList.toggle("is-active", el.getAttribute("data-cat") === state.category);
    });
  }

  function paintSubs() {
    const subs = listSubCategories(state.category);
    $subs.innerHTML =
      `<button class="sub-filter ${state.subCategory == null ? "is-active" : ""}" data-sub="__all__">全部</button>` +
      subs
        .map(
          (s) =>
            `<button class="sub-filter ${state.subCategory === s ? "is-active" : ""}" data-sub="${s}">${s}</button>`
        )
        .join("");
  }

  function paintGrid() {
    const list = searchFormulas({
      category: state.category,
      subCategory: state.subCategory,
      keyword: state.keyword,
    });

    if (list.length === 0) {
      $grid.innerHTML = `
        <div class="empty">
          <div class="empty-emoji">🔍</div>
          <h3>没找到匹配的公式</h3>
          <p class="text-muted mt-2">试试取消子分类或清空搜索框</p>
        </div>`;
      return;
    }

    const progress = store.getState().progress || {};
    const isPremium = store.getState().user?.isPremium;

    $grid.innerHTML = `
      <div class="formula-grid">
        ${list.map((f) => renderCard(f, progress[f.id], isPremium)).join("")}
      </div>`;
  }
}

function renderCard(f, prog, isPremium) {
  const locked = f.isPremium && !isPremium;
  const status = prog?.status || "new";
  const statusLabel = { new: "未学", learning: "学习中", mastered: "已掌握" }[status];
  return `
    <div class="card card-hover formula-card" data-id="${f.id}" data-cat="${f.category}" data-locked="${locked ? 1 : 0}">
      ${topFaceSVG(f.pattern)}
      <div class="meta">
        <div class="name" title="${f.name}">${f.name}</div>
        <div class="num">${f.category} · ${f.subCategory}${f.number ? " · #" + f.number : ""}</div>
        <div class="badges">
          <span class="badge badge-${status}">${statusLabel}</span>
          <span class="badge badge-difficulty-${f.difficulty}">难度 ${f.difficulty}</span>
        </div>
      </div>
      ${locked ? `<div class="lock-overlay" title="Pro 公式">🔒</div>` : ""}
    </div>
  `;
}
