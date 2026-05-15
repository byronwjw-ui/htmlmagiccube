// 闪卡练习：10 张一轮，翻牌看答案，记录「已掌握 / 还不熟」
// 完成后撒花 + 成绩页 + 写入 session、progress
//
// 撒花 canvas-confetti 以 ES module 动态 import，加载失败也不影响主流程（纯装饰）

import { analytics } from "../analytics.js";
import { store, recordPractice, addSession } from "../store.js";
import { pickFlashcardSet } from "../data/formulas.js";
import { navigate } from "../router.js";
import { toast } from "../utils.js";

const ROUND_SIZE = 10;
const CONFETTI_URL = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/+esm";

let _confettiPromise = null;
function loadConfetti() {
  if (_confettiPromise) return _confettiPromise;
  _confettiPromise = import(CONFETTI_URL).then((m) => m.default).catch(() => null);
  return _confettiPromise;
}

export function renderFlashcard(outlet) {
  const isPremium = store.getState().user?.isPremium;
  const cards = pickFlashcardSet(ROUND_SIZE, { isPremium });

  if (cards.length === 0) {
    outlet.innerHTML = `
      <div class="container">
        <div class="empty">
          <div class="empty-emoji">😵</div>
          <h2>没有可抽的卡</h2>
          <p class="text-muted mt-2">请先去「学习」看看公式</p>
        </div>
      </div>`;
    return;
  }

  // 轮次状态
  const session = {
    cards,
    idx: 0,
    flipped: false,
    correct: 0,        // “已掌握”计数
    wrong: 0,          // “还不熟”计数
    results: [],       // [{id, success}]
    startedAt: Date.now(),
  };

  analytics.track("practice_start", { mode: "flashcard", total: cards.length });

  paint();

  function paint() {
    if (session.idx >= session.cards.length) return paintResult();

    const card = session.cards[session.idx];
    const progressPct = Math.round((session.idx / session.cards.length) * 100);

    outlet.innerHTML = `
      <div class="container">
        <div class="flash-shell">
          <div class="flash-progress">${session.idx + 1} / ${session.cards.length}</div>
          <div class="flash-progress-bar"><div class="flash-progress-fill" style="width:${progressPct}%"></div></div>

          <div class="flashcard ${session.flipped ? "is-flipped" : ""}" id="flashcard">
            <div class="flashcard-inner">
              <div class="flashcard-face front">
                <div style="font-size:14px;color:var(--color-text-muted);font-weight:700;letter-spacing:1px">${card.category} · ${card.subCategory}</div>
                <div style="font-size:32px;font-weight:900;margin-top:12px">${card.name}</div>
                ${card.number ? `<div style="font-size:14px;color:var(--color-text-muted);margin-top:8px">#${card.number}</div>` : ""}
                <div class="hint">点击卡片查看公式</div>
              </div>
              <div class="flashcard-face back">
                <div style="font-size:14px;color:var(--color-text-muted);font-weight:700">${card.name}</div>
                <div class="algo" style="font-size:22px;font-weight:800;margin-top:16px;letter-spacing:0.5px;word-break:break-all">${card.algorithm}</div>
                ${card.tip ? `<div style="font-size:13px;color:var(--color-text-soft);margin-top:16px;line-height:1.6;max-width:340px">💡 ${card.tip}</div>` : ""}
                <div class="hint">你背出来了吗？</div>
              </div>
            </div>
          </div>

          <div class="flash-actions">
            <button class="btn" id="btn-wrong">❌ 还不熟</button>
            <button class="btn btn-primary" id="btn-correct">✅ 已掌握</button>
          </div>

          <div class="text-center mt-4">
            <a class="btn btn-ghost btn-sm" href="#/practice">退出练习</a>
          </div>
        </div>
      </div>
    `;

    const $card = outlet.querySelector("#flashcard");
    $card.addEventListener("click", () => {
      session.flipped = !session.flipped;
      $card.classList.toggle("is-flipped", session.flipped);
    });

    outlet.querySelector("#btn-correct").addEventListener("click", () => answer(true));
    outlet.querySelector("#btn-wrong").addEventListener("click", () => answer(false));
  }

  function answer(success) {
    const card = session.cards[session.idx];
    session.results.push({ id: card.id, success });
    if (success) session.correct++;
    else session.wrong++;

    // 写入练习记录 + 提升状态
    recordPractice(card.id, success);

    session.idx++;
    session.flipped = false;
    paint();
  }

  function paintResult() {
    const total = session.cards.length;
    const score = Math.round((session.correct / total) * 100);
    const isPerfect = session.correct === total;
    const emoji = isPerfect ? "🎯" : score >= 70 ? "💪" : score >= 40 ? "👍" : "🌱";
    const headline = isPerfect ? "完美一局！" : score >= 70 ? "不错哦！" : score >= 40 ? "在进步！" : "反复才是王道";

    // 写 session
    const date = new Date();
    addSession({
      date: date.toISOString().slice(0, 10),
      total,
      correct: session.correct,
      formulaIds: session.cards.map((c) => c.id),
      timestamp: Date.now(),
      durationMs: Date.now() - session.startedAt,
      mode: "flashcard",
    });

    analytics.track("practice_complete", {
      mode: "flashcard",
      total,
      correct: session.correct,
      score,
      durationMs: Date.now() - session.startedAt,
    });

    outlet.innerHTML = `
      <div class="container">
        <div class="flash-shell flash-result card">
          <div class="big-emoji">${emoji}</div>
          <h2>${headline}</h2>
          <div class="score">${score}<small style="font-size:20px;font-weight:700">分</small></div>
          <div class="text-soft">${session.correct} / ${total} 掌握 · 用时 ${Math.round((Date.now() - session.startedAt) / 1000)} 秒</div>

          <div class="flex gap-3 mt-8" style="justify-content:center;flex-wrap:wrap">
            <button class="btn btn-primary btn-lg" id="btn-again">🔄 再来一轮</button>
            <a class="btn btn-lg" href="#/dashboard">📊 看看我的进步</a>
            <a class="btn btn-ghost btn-lg" href="#/practice">返回练习</a>
          </div>
        </div>
      </div>
    `;

    outlet.querySelector("#btn-again").addEventListener("click", () => {
      analytics.track("practice_again", { mode: "flashcard" });
      renderFlashcard(outlet);
    });

    // 撒花（装饰）
    if (score >= 70) celebrate(isPerfect);
  }
}

function celebrate(isPerfect) {
  loadConfetti().then((confetti) => {
    if (!confetti) return;
    const burst = (opts) =>
      confetti({
        particleCount: isPerfect ? 120 : 60,
        spread: 70,
        startVelocity: 45,
        colors: ["#FFD500", "#0046AD", "#1FA855", "#FF6B1A"],
        ...opts,
      });
    burst({ origin: { x: 0.2, y: 0.7 } });
    burst({ origin: { x: 0.8, y: 0.7 } });
    if (isPerfect) {
      setTimeout(() => burst({ origin: { x: 0.5, y: 0.4 }, particleCount: 200, spread: 120 }), 350);
    }
  });
}
