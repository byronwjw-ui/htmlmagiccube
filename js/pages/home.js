// 首页：Hero + 三卖点 + Pro 入口
import { analytics } from "../analytics.js";
import { warmupCubeModule } from "../cube.js";

export function renderHome(outlet) {
  analytics.track("home_view");
  // 提前预热 cubing.js，用户点进详情页时已经下载好
  warmupCubeModule();

  outlet.innerHTML = `
    <div class="container">
      <section class="hero">
        <div class="hero-inner">
          <h1 class="hero-title">小魔方大师</h1>
          <p class="hero-sub">你的 AI 魔方教练 · 9-15 岁孩子学公式的好伙伴</p>
          <div class="hero-cta">
            <a class="btn btn-primary btn-lg" href="#/learn">开始学习</a>
            <a class="btn btn-lg" href="#/practice">立即练习</a>
          </div>
        </div>
      </section>

      <section class="sell-grid">
        <div class="card sell-card">
          <div class="sell-emoji">📚</div>
          <div class="sell-title">57 OLL + 21 PLL 全收录</div>
          <div class="sell-desc">WCA 标准公式 · 3D 演示 · 一看就懂</div>
        </div>
        <div class="card sell-card">
          <div class="sell-emoji">🎯</div>
          <div class="sell-title">闪卡练习</div>
          <div class="sell-desc">10 张一轮 · 翻牌看答案 · 越练越快</div>
        </div>
        <div class="card sell-card">
          <div class="sell-emoji">🏆</div>
          <div class="sell-title">成就 & 连续打卡</div>
          <div class="sell-desc">坚持解锁徽章 · 看见自己的进步</div>
        </div>
      </section>

      <section class="pro-banner">
        <div>
          <h3>解锁 Pro，公式全开放</h3>
          <p>全部 78 个公式 · 计时模式 · 弱项强化 · 持续更新</p>
        </div>
        <a class="btn btn-primary btn-lg" href="#/pricing">查看 Pro</a>
      </section>
    </div>
  `;
}
