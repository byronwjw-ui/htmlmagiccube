// 入口：初始化 store、绑定路由、首次渲染
import { Router } from "./router.js";
import { store } from "./store.js";
import { storage } from "./storage.js";
import { analytics } from "./analytics.js";
import "./achievements.js"; // side-effect: 订阅 store 检查成就

import { renderHome }      from "./pages/home.js";
import { renderLearn }     from "./pages/learn.js";
import { renderDetail }    from "./pages/detail.js";
import { renderPractice }  from "./pages/practice.js";
import { renderFlashcard } from "./pages/flashcard.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderPricing }   from "./pages/pricing.js";

// ----- 1. 初始化匿名 user + 全局 state -----
const user = storage.getOrCreateUser();
store.setState({
  user,
  progress: storage.getProgressMap(),
  sessions: storage.getSessions(),
  achievements: storage.getAchievements(),
});

// 任何 state 变化都自动持久化
store.subscribe((s, changed) => {
  if (changed.has("user"))         storage.setUser(s.user);
  if (changed.has("progress"))     storage.setProgressMap(s.progress);
  if (changed.has("sessions"))     storage.setSessions(s.sessions);
  if (changed.has("achievements")) storage.setAchievements(s.achievements);
});

// ----- 2. 路由 -----
const app = document.getElementById("app");
const router = new Router(app);

router
  .add("/",                            renderHome)
  .add("/learn",                       renderLearn)
  .add("/learn/:category/:id",         renderDetail)
  .add("/practice",                    renderPractice)
  .add("/practice/flashcard",          renderFlashcard)
  .add("/dashboard",                   renderDashboard)
  .add("/pricing",                     renderPricing)
  .notFound((el) => {
    el.innerHTML = `
      <div class="container">
        <div class="empty">
          <div class="empty-emoji">🧐</div>
          <h2>找不到这个页面</h2>
          <p class="text-muted mt-2">回到 <a href="#/" style="color:var(--color-accent);font-weight:700">首页</a></p>
        </div>
      </div>`;
  });

router.start();

// ----- 3. 顶栏高亮 -----
function updateNav() {
  const hash = location.hash.replace(/^#/, "") || "/";
  document.querySelectorAll("#app-nav a").forEach((a) => {
    const target = a.getAttribute("href").replace(/^#/, "");
    const isActive = target !== "/" && hash.startsWith(target);
    a.classList.toggle("is-active", isActive);
  });
}
window.addEventListener("hashchange", updateNav);
updateNav();

// ----- 4. 首次访问埋点 -----
analytics.track("app_open", { uid: user.id });
