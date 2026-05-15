// 通用工具函数

// 条件 className 拼接（类似 clsx 极简版）
export function cn(...args) {
  const out = [];
  for (const a of args) {
    if (!a) continue;
    if (typeof a === "string") out.push(a);
    else if (Array.isArray(a)) { const s = cn(...a); if (s) out.push(s); }
    else if (typeof a === "object") {
      for (const k in a) if (a[k]) out.push(k);
    }
  }
  return out.join(" ");
}

// WCA notation 求逆：R U R' -> R U' R'
// 规则：整段反转 + 每个 move 反向
//   M  -> M'
//   M' -> M
//   M2 -> M2（180° 自逆）
//   Mw -> Mw'  Mw' -> Mw  Mw2 -> Mw2
export function invertAlgorithm(alg) {
  if (!alg || typeof alg !== "string") return "";
  const cleaned = alg.replace(/\(([^)]*)\)/g, "$1").replace(/\/\/.*$/gm, "").trim();
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  const inverted = tokens.map(invertMove).reverse();
  return inverted.join(" ");
}

function invertMove(move) {
  // 例子：R, R', R2, Rw, Rw', Rw2, M, M', M2, x, y', z2
  const m = move.match(/^([a-zA-Z][a-zA-Z]?w?)(2)?('?)$/);
  if (!m) return move;
  const [, base, two, prime] = m;
  if (two) return base + "2";          // 180° 自逆
  if (prime) return base;                // 去掉 '
  return base + "'";                     // 加上 '
}

// 复制到剪贴板（兼容 file:// 下的 fallback）
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch (e) {
    return false;
  }
}

// 相对时间：刚刚 / 5 分钟前 / 2 小时前 / 3 天前 / 2024-09-12
export function formatRelativeTime(iso) {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "—";
  const diff = Date.now() - t;
  const sec = Math.floor(diff / 1000);
  if (sec < 30)              return "刚刚";
  if (sec < 60 * 60)         return Math.floor(sec / 60) + " 分钟前";
  if (sec < 60 * 60 * 24)    return Math.floor(sec / 3600) + " 小时前";
  if (sec < 60 * 60 * 24 * 30) return Math.floor(sec / 86400) + " 天前";
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// 简单 toast
export function toast(text, ms = 1800) {
  const root = document.getElementById("toast-root");
  if (!root) return;
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  el.style.pointerEvents = "auto";
  root.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity 240ms ease, transform 240ms ease";
    el.style.opacity = "0";
    el.style.transform = "translateY(6px)";
    setTimeout(() => el.remove(), 260);
  }, ms);
}

// 弹窗（升级提示等）
export function openModal({ title, body, primary, secondary, onPrimary, onSecondary }) {
  const root = document.getElementById("modal-root");
  if (!root) return;
  root.innerHTML = "";
  const mask = document.createElement("div");
  mask.className = "modal-mask";
  mask.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-title">${title}</div>
      <div class="modal-body">${body}</div>
      <div class="modal-actions">
        ${secondary ? `<button class="btn btn-ghost" data-act="secondary">${secondary}</button>` : ""}
        ${primary   ? `<button class="btn btn-primary" data-act="primary">${primary}</button>`     : ""}
      </div>
    </div>`;
  function close() { root.innerHTML = ""; }
  mask.addEventListener("click", (e) => {
    if (e.target === mask) return close();
    const act = e.target.getAttribute && e.target.getAttribute("data-act");
    if (act === "primary")   { onPrimary && onPrimary(); close(); }
    if (act === "secondary") { onSecondary && onSecondary(); close(); }
  });
  root.appendChild(mask);
}

// 顶面 SVG 预览（OLL/PLL 卡片用）
// pattern: 长度 9 的字符串，每格为颜色 token: 'Y' 黄 / 'X' 灰 / 'B' 蓝 / 'R' 红 / 'O' 橙 / 'G' 绿 / 'W' 白
const COLOR_MAP = { Y: "#FFD500", X: "#D8DBE2", B: "#0046AD", R: "#C41E1E", O: "#FF6B1A", G: "#1FA855", W: "#FFFFFF" };
export function topFaceSVG(pattern = "XXXXXXXXX") {
  const cells = pattern.split("").map((c) => COLOR_MAP[c] || COLOR_MAP.X);
  return `
    <span class="top-face" aria-hidden="true">
      <span class="top-face-grid">
        ${cells.map((c) => `<span class="top-face-cell" style="background:${c}"></span>`).join("")}
      </span>
    </span>`;
}
