// 成就定义 + 检查逻辑
// 每个成就有一个 check(state) -> boolean，store 变化时统一检查

import { store, unlockAchievement } from "./store.js";
import { toast } from "./utils.js";
import { analytics } from "./analytics.js";

export const ACHIEVEMENTS = [
  {
    id: "first_step",
    name: "启程",
    description: "完成第一次练习",
    emoji: "🚀",
    check: (s) => (s.sessions?.length || 0) >= 1,
  },
  {
    id: "sune_master",
    name: "Sune 入门",
    description: "掌握 OLL 27 Sune",
    emoji: "⭐",
    check: (s) => s.progress?.["oll-27"]?.status === "mastered",
  },
  {
    id: "oll_10",
    name: "OLL 十连",
    description: "掌握 10 个 OLL 公式",
    emoji: "🎯",
    check: (s) => countMastered(s, "OLL") >= 10,
  },
  {
    id: "pll_full",
    name: "PLL 全通",
    description: "掌握全部 21 个 PLL",
    emoji: "🏆",
    check: (s) => countMastered(s, "PLL") >= 21,
  },
  {
    id: "streak_3",
    name: "三日不辍",
    description: "连续练习 3 天",
    emoji: "🔥",
    check: (s) => computeStreak(s.sessions) >= 3,
  },
  {
    id: "streak_7",
    name: "一周坚持",
    description: "连续练习 7 天",
    emoji: "💪",
    check: (s) => computeStreak(s.sessions) >= 7,
  },
  {
    id: "practice_50",
    name: "五十练",
    description: "累计练习 50 次",
    emoji: "📈",
    check: (s) => (s.sessions?.reduce((n, x) => n + (x.total || 0), 0) || 0) >= 50,
  },
  {
    id: "first_perfect",
    name: "完美一局",
    description: "闪卡一轮全部掌握",
    emoji: "💯",
    check: (s) => (s.sessions || []).some((x) => x.total > 0 && x.correct === x.total),
  },
];

function countMastered(s, category) {
  const prefix = category.toLowerCase() + "-";
  return Object.values(s.progress || {}).filter(
    (p) => p.status === "mastered" && p.formulaId && p.formulaId.startsWith(prefix)
  ).length;
}

export function computeStreak(sessions) {
  if (!sessions || sessions.length === 0) return 0;
  const days = new Set(
    sessions
      .map((s) => s.date || (s.timestamp ? new Date(s.timestamp).toISOString().slice(0, 10) : null))
      .filter(Boolean)
  );
  let streak = 0;
  let d = new Date();
  // 如果今天没练，允许从昨天开始算
  const todayKey = d.toISOString().slice(0, 10);
  if (!days.has(todayKey)) d.setDate(d.getDate() - 1);
  while (days.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// 订阅 store，每次变化检查一次
store.subscribe((s) => {
  for (const a of ACHIEVEMENTS) {
    if (s.achievements?.[a.id]) continue;
    let pass = false;
    try { pass = a.check(s); } catch (_) {}
    if (pass) {
      const ok = unlockAchievement(a.id);
      if (ok) {
        toast(`${a.emoji} 解锁成就：${a.name}`, 2400);
        analytics.track("achievement_unlock", { id: a.id, name: a.name });
      }
    }
  }
});
