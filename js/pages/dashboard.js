// 个人中心：profile + 三统计 + OLL/PLL 进度环 + 30 天热力图 + 最近练习 + 成就墙
import { analytics } from "../analytics.js";
import { store, updateUser } from "../store.js";
import { ACHIEVEMENTS, computeStreak } from "../achievements.js";
import { listByCategory, getFormulaById } from "../data/formulas.js";
import { formatRelativeTime, toast } from "../utils.js";

const AVATAR_CHOICES = ["🧒", "👧", "🦊", "🐼", "🐯", "🦄", "🐢", "🐧", "🐱", "🐶", "🦁", "🐸"];

export function renderDashboard(outlet) {
  analytics.track("dashboard_view");
  paint();

  // 订阅 store，状态变化就重画（如改昵称后刷新）
  const unsub = store.subscribe(() => paint());

  function paint() {
    const s = store.getState();
    const user = s.user || {};
    const progress = s.progress || {};
    const sessions = s.sessions || [];
    const achievements = s.achievements || {};

    // 统计
    const totalPractice = sessions.reduce((n, x) => n + (x.total || 0), 0);
    const streak = computeStreak(sessions);
    const masteredAll = Object.values(progress).filter((p) => p.status === "mastered").length;

    const ollAll = listByCategory("OLL").length;
    const pllAll = listByCategory("PLL").length;
    const ollDone = countMasteredIn(progress, "oll-");
    const pllDone = countMasteredIn(progress, "pll-");

    outlet.innerHTML = `
      <div class="container">
        <h1 class="page-title">我的中心</h1>
        <p class="page-sub">看看你走了多远。坚持下去，你会越来越快。</p>

        <div class="card mb-4">
          <div class="profile-card">
            <div class="avatar-emoji" id="avatar-emoji" title="点击换一个" style="cursor:pointer">${user.avatar || "🧒"}</div>
            <div style="flex:1">
              <div class="profile-name">
                <span id="nickname-text">${escapeHtml(user.nickname || "魔方小将")}</span>
                <button class="btn btn-ghost btn-sm" id="edit-name" style="margin-left:8px">✏️ 改名</button>
              </div>
              <div class="profile-meta">
                ${user.isPremium ? "✨ Pro 会员" : "免费用户"}
                · 加入于 ${user.createdAt ? formatRelativeTime(user.createdAt) : "刚刚"}
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-4">
          <div class="stat-grid">
            <div class="stat-cell">
              <div class="stat-num">${totalPractice}</div>
              <div class="stat-label">总练习次数</div>
            </div>
            <div class="stat-cell">
              <div class="stat-num">${streak}</div>
              <div class="stat-label">连续天数 🔥</div>
            </div>
            <div class="stat-cell">
              <div class="stat-num">${masteredAll}</div>
              <div class="stat-label">已掌握公式</div>
            </div>
          </div>
        </div>

        <div class="dash-grid mb-4">
          <div class="card">
            ${ringHTML("OLL 进度", ollDone, ollAll)}
          </div>
          <div class="card">
            ${ringHTML("PLL 进度", pllDone, pllAll)}
          </div>
        </div>

        <div class="card mb-4">
          <div class="section-title">近 30 天热力图</div>
          ${heatmapHTML(sessions)}
          <div class="text-muted mt-2" style="font-size:12px">颜色越黄表示那天练得越多</div>
        </div>

        <div class="card mb-4">
          <div class="section-title">最近练习</div>
          ${recentHTML(sessions)}
        </div>

        <div class="card">
          <div class="section-title">成就墙</div>
          <div class="achievements-grid">
            ${ACHIEVEMENTS.map((a) => achvHTML(a, !!achievements[a.id])).join("")}
          </div>
        </div>
      </div>
    `;

    // 换头像
    outlet.querySelector("#avatar-emoji").addEventListener("click", () => {
      const cur = user.avatar || AVATAR_CHOICES[0];
      const idx = AVATAR_CHOICES.indexOf(cur);
      const next = AVATAR_CHOICES[(idx + 1) % AVATAR_CHOICES.length];
      updateUser({ avatar: next });
      analytics.track("profile_avatar_change", { avatar: next });
    });

    // 改名
    outlet.querySelector("#edit-name").addEventListener("click", () => {
      const cur = user.nickname || "魔方小将";
      const next = window.prompt("改个昵称吧（1–12 字）", cur);
      if (next == null) return;
      const trimmed = next.trim().slice(0, 12);
      if (!trimmed) { toast("昵称不能为空"); return; }
      updateUser({ nickname: trimmed });
      analytics.track("profile_nickname_change");
      toast("昵称已更新");
    });
  }

  // 返回 cleanup
  return () => unsub();
}

function countMasteredIn(progress, prefix) {
  return Object.values(progress).filter((p) => p.status === "mastered" && p.formulaId?.startsWith(prefix)).length;
}

function ringHTML(title, done, all) {
  const pct = all > 0 ? done / all : 0;
  const R = 32;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - pct);
  return `
    <div class="progress-ring">
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle class="ring-bg" cx="40" cy="40" r="${R}" fill="none" stroke-width="8"></circle>
        <circle class="ring-fg" cx="40" cy="40" r="${R}" fill="none" stroke-width="8"
          stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
          transform="rotate(-90 40 40)" stroke-linecap="round"></circle>
        <text class="ring-label" x="40" y="40">${Math.round(pct * 100)}%</text>
      </svg>
      <div class="info">
        <div class="title">${title}</div>
        <div class="desc">已掌握 ${done} / ${all}</div>
      </div>
    </div>
  `;
}

function heatmapHTML(sessions) {
  // 统计近 30 天每天 total 总和
  const today = new Date();
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const map = new Map(days.map((d) => [d, 0]));
  for (const s of sessions) {
    const key = s.date || (s.timestamp ? new Date(s.timestamp).toISOString().slice(0, 10) : null);
    if (key && map.has(key)) map.set(key, map.get(key) + (s.total || 0));
  }
  return `
    <div class="heatmap">
      ${days.map((d) => {
        const v = map.get(d) || 0;
        const lv = v === 0 ? 0 : v < 5 ? 1 : v < 15 ? 2 : v < 30 ? 3 : 4;
        const title = `${d} · ${v} 次练习`;
        return `<div class="heat-cell ${lv ? "l" + lv : ""}" title="${title}"></div>`;
      }).join("")}
    </div>
  `;
}

function recentHTML(sessions) {
  if (!sessions || sessions.length === 0) {
    return `<div class="text-muted text-center" style="padding:24px 0">还没有练习记录，<a href="#/practice" style="color:var(--color-accent);font-weight:700">立即开始</a></div>`;
  }
  const recent = sessions.slice(0, 5);
  return `
    <div class="history-list">
      ${recent.map((s) => {
        const score = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
        const modeLabel = { flashcard: "闪卡", timer: "计时", weak: "弱项" }[s.mode] || "练习";
        const when = s.timestamp ? formatRelativeTime(new Date(s.timestamp).toISOString()) : s.date;
        return `
          <div class="history-row">
            <div><strong>${modeLabel}</strong> · ${s.correct}/${s.total} · ${score}分</div>
            <div class="when">${when}</div>
          </div>`;
      }).join("")}
    </div>
  `;
}

function achvHTML(a, unlocked) {
  return `
    <div class="achv ${unlocked ? "unlocked" : ""}" title="${a.description}">
      <div class="achv-emoji">${a.emoji}</div>
      <div class="achv-name">${a.name}</div>
    </div>
  `;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
