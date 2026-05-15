// 详情页：3D <twisty-player> + 复制公式 + 标记掌握 + 上/下一个
// 路由 cleanup 负责销毁 TwistyPlayer。
import { analytics } from "../analytics.js";
import { store, setFormulaStatus } from "../store.js";
import { getFormulaById, getNeighbors } from "../data/formulas.js";
import { createCubePlayer } from "../cube.js";
import { copyToClipboard, toast, openModal, formatRelativeTime } from "../utils.js";
import { navigate } from "../router.js";

export function renderDetail(outlet, params) {
  const f = getFormulaById(params.id);

  if (!f) {
    outlet.innerHTML = `
      <div class="container">
        <a class="detail-back" href="#/learn">← 返回学习</a>
        <div class="empty">
          <div class="empty-emoji">❓</div>
          <h2>找不到这个公式</h2>
        </div>
      </div>`;
    return;
  }

  // 锁定拦截
  const isPro = store.getState().user?.isPremium;
  if (f.isPremium && !isPro) {
    analytics.track("premium_modal_show", { from: "detail_direct", id: f.id });
    outlet.innerHTML = `
      <div class="container">
        <a class="detail-back" href="#/learn">← 返回学习</a>
        <div class="empty">
          <div class="empty-emoji">🔒</div>
          <h2>这是 Pro 公式</h2>
          <p class="text-muted mt-2">免费版本包含 15 个入门公式，解锁 Pro 查看全部 78 个</p>
          <div class="mt-6">
            <a class="btn btn-primary" href="#/pricing">查看 Pro</a>
          </div>
        </div>
      </div>`;
    return;
  }

  analytics.track("formula_view", { id: f.id, category: f.category });

  const progress = store.getState().progress?.[f.id];
  const status = progress?.status || "new";
  const statusLabel = { new: "未学", learning: "学习中", mastered: "已掌握" }[status];
  const { prev, next } = getNeighbors(f.id);

  outlet.innerHTML = `
    <div class="container">
      <a class="detail-back" href="#/learn">← 返回学习</a>

      <div class="detail-grid">
        <div>
          <div class="cube-stage" id="cube-stage"></div>
        </div>

        <div>
          <h1 class="detail-title">${f.name}</h1>
          <div class="detail-sub">
            <span>${f.category} · ${f.subCategory}${f.number ? " · #" + f.number : ""}</span>
            <span class="badge badge-difficulty-${f.difficulty}">难度 ${f.difficulty}</span>
            <span class="badge badge-${status}">${statusLabel}</span>
          </div>

          <div class="algo-box">
            <span class="algo-text" id="algo-text">${f.algorithm}</span>
            <button class="btn btn-sm" id="copy-btn" title="复制公式">📋 复制</button>
          </div>

          ${f.tip ? `<div class="tip-box"><strong>💡 记忆提示：</strong>${f.tip}</div>` : ""}

          <div class="detail-actions">
            ${
              status === "mastered"
                ? `<button class="btn" id="unlearn-btn">🔄 重新学习</button>`
                : `<button class="btn btn-primary" id="master-btn">✅ 标记已掌握</button>`
            }
            <button class="btn" id="replay-btn">▶️ 重新演示</button>
          </div>

          ${
            progress
              ? `<div class="text-muted" style="font-size:14px">
                  练习 ${progress.practiceCount} 次 · 正确率 ${Math.round((progress.successRate || 0) * 100)}% · ${formatRelativeTime(progress.lastPracticedAt)}
                </div>`
              : ""
          }

          <div class="detail-nav">
            ${
              prev
                ? `<a class="btn btn-ghost" href="#/learn/${prev.category}/${prev.id}">← ${prev.name}</a>`
                : `<span></span>`
            }
            ${
              next
                ? `<a class="btn btn-ghost" href="#/learn/${next.category}/${next.id}">${next.name} →</a>`
                : `<span></span>`
            }
          </div>
        </div>
      </div>
    </div>
  `;

  // 3D 魔方创建
  const stage = outlet.querySelector("#cube-stage");
  let cubeHandle = null;
  createCubePlayer(stage, {
    alg: f.algorithm,
    setup: f.setupMoves,
    controlPanel: "bottom-row",
  }).then((h) => {
    cubeHandle = h;
  });

  // 复制按钮
  outlet.querySelector("#copy-btn").addEventListener("click", async () => {
    const ok = await copyToClipboard(f.algorithm);
    if (ok) {
      toast("公式已复制 📋");
      analytics.track("algorithm_copy", { id: f.id });
    } else {
      toast("复制失败，请手动选中");
    }
  });

  // 标记掌握 / 重新学习
  const masterBtn = outlet.querySelector("#master-btn");
  if (masterBtn) {
    masterBtn.addEventListener("click", () => {
      setFormulaStatus(f.id, "mastered");
      analytics.track("formula_master", { id: f.id });
      toast("🎉 标记为已掌握");
      // 重渲染以刷新按钮状态
      renderDetail(outlet, params);
    });
  }
  const unlearnBtn = outlet.querySelector("#unlearn-btn");
  if (unlearnBtn) {
    unlearnBtn.addEventListener("click", () => {
      openModal({
        title: "重新开始学习这个公式？",
        body: "状态会从「已掌握」变回「学习中」。历史练习记录会保留。",
        primary: "确认",
        secondary: "取消",
        onPrimary: () => {
          setFormulaStatus(f.id, "learning");
          toast("已重置为学习中");
          renderDetail(outlet, params);
        },
      });
    });
  }

  // 重新演示
  outlet.querySelector("#replay-btn").addEventListener("click", () => {
    if (cubeHandle && cubeHandle.player) {
      try {
        // cubing.js 的 timestamp 重置
        cubeHandle.player.timestamp = 0;
        cubeHandle.player.play && cubeHandle.player.play();
      } catch (e) {
        console.warn("replay failed", e);
      }
    }
  });

  // cleanup：离开页面时销毁 player
  return () => {
    if (cubeHandle) cubeHandle.destroy();
  };
}
