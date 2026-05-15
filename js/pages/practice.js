// 练习首页：三模式入口
// 闪卡（免费） / 计时（Pro） / 弱项强化（Pro）
import { analytics } from "../analytics.js";
import { store } from "../store.js";
import { openModal } from "../utils.js";
import { navigate } from "../router.js";

export function renderPractice(outlet) {
  analytics.track("practice_view");
  const isPro = store.getState().user?.isPremium;

  outlet.innerHTML = `
    <div class="container">
      <h1 class="page-title">练习模式</h1>
      <p class="page-sub">选一种你喜欢的方式开练。顶住压力才能走得更远。</p>

      <div class="practice-modes">
        <div class="card card-hover mode-card" data-mode="flashcard">
          <div class="mode-emoji">🎴</div>
          <div class="mode-name">闪卡练习</div>
          <div class="mode-desc">10 张一轮 · 翻牌看答案<br/>适合初学，免费使用</div>
          <span class="badge badge-mastered">免费</span>
        </div>

        <div class="card card-hover mode-card" data-mode="timer" data-pro="1">
          <div class="mode-emoji">⏱️</div>
          <div class="mode-name">计时挑战</div>
          <div class="mode-desc">随机出题 · 记录手速<br/>刷新 PB、看到进步</div>
          <span class="badge badge-premium lock-corner">🔒 Pro</span>
        </div>

        <div class="card card-hover mode-card" data-mode="weak" data-pro="1">
          <div class="mode-emoji">🎯</div>
          <div class="mode-name">弱项强化</div>
          <div class="mode-desc">智能挑出你不熟的公式<br/>针对性练习，效率翻倍</div>
          <span class="badge badge-premium lock-corner">🔒 Pro</span>
        </div>
      </div>
    </div>
  `;

  outlet.querySelector(".practice-modes").addEventListener("click", (e) => {
    const card = e.target.closest("[data-mode]");
    if (!card) return;
    const mode = card.getAttribute("data-mode");
    const isProOnly = card.getAttribute("data-pro") === "1";

    if (isProOnly && !isPro) {
      analytics.track("premium_modal_show", { from: "practice_mode", mode });
      openModal({
        title: "🔒 这是 Pro 模式",
        body: "计时挑战与弱项强化需要 Pro 会员。闪卡模式免费使用，适合骑子打造背诵手感。",
        primary: "查看 Pro",
        secondary: "先试闪卡",
        onPrimary: () => {
          analytics.track("pricing_view", { from: "practice_premium_modal" });
          navigate("/pricing");
        },
        onSecondary: () => navigate("/practice/flashcard"),
      });
      return;
    }

    if (mode === "flashcard") {
      analytics.track("practice_start", { mode: "flashcard" });
      navigate("/practice/flashcard");
    }
  });
}
