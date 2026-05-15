// 定价页：免费 vs Pro 双栏 + 月/年切换 + B 端机构咨询入口
// 默认年付（20% off，年付心智）
import { analytics } from "../analytics.js";
import { store, updateUser } from "../store.js";
import { openModal, toast } from "../utils.js";

const PRICE = {
  monthly: { amount: 29, period: "月", note: "按月续费" },
  yearly:  { amount: 278, period: "年", note: "折合 23 元/月·省 20%" },
};

const state = { plan: "yearly" };

export function renderPricing(outlet) {
  analytics.track("pricing_view");
  paint();

  function paint() {
    const isPro = store.getState().user?.isPremium;
    const p = PRICE[state.plan];

    outlet.innerHTML = `
      <div class="container">
        <div class="pricing-head">
          <h1 class="pricing-title">选一个适合你的计划</h1>
          <p class="pricing-sub">趣味与系统同在 · 随时取消 · 7 天无理由退款</p>
          <div class="pricing-toggle tabs" role="tablist" id="plan-tabs">
            <button class="tab ${state.plan === "monthly" ? "is-active" : ""}" data-plan="monthly">按月</button>
            <button class="tab ${state.plan === "yearly" ? "is-active" : ""}" data-plan="yearly">按年 · 省 20%</button>
          </div>
        </div>

        <div class="pricing-grid">
          <div class="card price-card">
            <div class="tier">免费版</div>
            <div class="price">¥0 <small>/ 永久</small></div>
            <div class="text-muted" style="font-size:13px">适合刚入门的孩子，先体验看看</div>
            <ul>
              <li>15 个入门公式（10 OLL + 5 PLL）</li>
              <li>3D 魔方动画演示</li>
              <li>闪卡练习模式</li>
              <li>成就与连续打卡</li>
              <li>个人中心进度追踪</li>
            </ul>
            ${isPro ? "" : `<button class="btn btn-block" disabled>当前版本</button>`}
          </div>

          <div class="card price-card featured">
            <div class="featured-badge">推荐</div>
            <div class="tier">Pro 会员</div>
            <div class="price">¥${p.amount} <small>/ ${p.period}</small></div>
            <div class="text-muted" style="font-size:13px">${p.note}</div>
            <ul>
              <li><strong>全部 78 个公式</strong>（57 OLL + 21 PLL）</li>
              <li>计时挑战模式 · 记录 PB</li>
              <li>弱项强化 · 智能推荐</li>
              <li>高阶手法视频（即将上线）</li>
              <li>优先客服 · 新功能抢先使用</li>
            </ul>
            ${
              isPro
                ? `<button class="btn btn-block" disabled>你已经是 Pro 了 ✨</button>`
                : `<button class="btn btn-primary btn-block btn-lg" id="cta-pro">立即解锁 Pro</button>`
            }
          </div>
        </div>

        <div class="b2b-box">
          <h3>🏫 机构与学校合作</h3>
          <p>补习班、兴趣班、魔方俱乐部？<br/>我们提供多席位、学生进度后台、老师脚本定制等 SaaS 能力。</p>
          <div class="flex gap-3" style="justify-content:center;flex-wrap:wrap">
            <a class="btn btn-primary" id="b2b-mail" href="mailto:contact@magiccube.app?subject=机构合作咨询">📧 邮件咨询</a>
            <button class="btn" id="b2b-wechat">💭 微信二维码</button>
          </div>
        </div>

        <div class="text-center text-muted mt-8" style="font-size:13px;line-height:1.8">
          · 本 MVP 阶段为产品演示，实际支付渠道即将接入<br/>
          · 会员权益与订阅条款以正式上线时为准
        </div>
      </div>
    `;

    // 月/年切换
    outlet.querySelector("#plan-tabs").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-plan]");
      if (!btn) return;
      const plan = btn.getAttribute("data-plan");
      if (plan === state.plan) return;
      state.plan = plan;
      analytics.track("pricing_toggle", { plan });
      paint();
    });

    // 解锁 Pro CTA（MVP：模拟支付，直接标为 Pro）
    const cta = outlet.querySelector("#cta-pro");
    if (cta) {
      cta.addEventListener("click", () => {
        analytics.track("pricing_cta_click", { plan: state.plan, amount: PRICE[state.plan].amount });
        openModal({
          title: "模拟支付",
          body: `这是 MVP 演示环境，点击「确认」将直接将你标记为 Pro，无任何费用。<br/><br/>套餐：<strong>${
            state.plan === "yearly" ? "年付 ¥" + PRICE.yearly.amount : "月付 ¥" + PRICE.monthly.amount
          }</strong>（仅作演示）`,
          primary: "确认升级",
          secondary: "取消",
          onPrimary: () => {
            updateUser({ isPremium: true, premiumPlan: state.plan, premiumSince: new Date().toISOString() });
            analytics.track("pricing_upgrade_mock", { plan: state.plan });
            toast("✨ 欢迎加入 Pro！全部 78 个公式已解锁");
            paint();
          },
        });
      });
    }

    // B 端 CTA
    outlet.querySelector("#b2b-mail").addEventListener("click", () => {
      analytics.track("b2b_contact_click", { channel: "mail" });
    });
    outlet.querySelector("#b2b-wechat").addEventListener("click", () => {
      analytics.track("b2b_contact_click", { channel: "wechat" });
      openModal({
        title: "💭 微信咨询",
        body: `二维码即将上线。<br/><br/>现在可以先邮件联系：<br/><strong>contact@magiccube.app</strong><br/><br/>或添加微信：<strong>MagicCubeMaster</strong>（备注：机构合作）`,
          primary: "知道了",
      });
    });
  }
}
