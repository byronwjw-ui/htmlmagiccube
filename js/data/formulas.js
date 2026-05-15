// 公式统一查询入口
// - 合并 OLL + PLL
// - 自动生成 setupMoves（= invertAlgorithm(algorithm)）——不手写
// - 提供按 id / category / subCategory / 搜索 查询
// - 免费名单按「学习路径」挑选，不是按编号 1-10

import { OLL_FORMULAS } from "./oll.js";
import { PLL_FORMULAS } from "./pll.js";
import { invertAlgorithm } from "../utils.js";

// ----- 免费名单（需要和 oll.js / pll.js 里的 isPremium=false 一致） -----
// 这里再列一次，作为唯一权威（防止数据表中忘记改标记）
export const FREE_FORMULA_IDS = new Set([
  // OLL（按学习路径选 10 个）
  "oll-27", // Sune
  "oll-26", // Anti-Sune
  "oll-21", // H
  "oll-22", // Pi
  "oll-23", // Headlights
  "oll-24", // Bowtie
  "oll-25", // Bowtie Mirror
  "oll-44", // P
  "oll-45", // T
  "oll-33", // T-shape
  // PLL（5 个）
  "pll-Ua",
  "pll-Ub",
  "pll-H",
  "pll-Z",
  "pll-Aa",
]);

// ----- 合并 + 填充 setupMoves -----
function enrich(raw) {
  return raw.map((f) => ({
    ...f,
    // 以 FREE_FORMULA_IDS 为准，覆盖数据文件里的 isPremium（防不一致）
    isPremium: !FREE_FORMULA_IDS.has(f.id),
    setupMoves: f.setupMoves || invertAlgorithm(f.algorithm),
  }));
}

export const ALL_FORMULAS = [...enrich(OLL_FORMULAS), ...enrich(PLL_FORMULAS)];

// ----- 查询 API -----
const BY_ID = new Map(ALL_FORMULAS.map((f) => [f.id, f]));

export function getFormulaById(id) {
  return BY_ID.get(id) || null;
}

export function listByCategory(category /* 'OLL' | 'PLL' */) {
  return ALL_FORMULAS.filter((f) => f.category === category);
}

export function listSubCategories(category) {
  const seen = new Set();
  const out = [];
  for (const f of ALL_FORMULAS) {
    if (f.category !== category) continue;
    if (seen.has(f.subCategory)) continue;
    seen.add(f.subCategory);
    out.push(f.subCategory);
  }
  return out;
}

export function searchFormulas({ category, subCategory, keyword } = {}) {
  const kw = (keyword || "").trim().toLowerCase();
  return ALL_FORMULAS.filter((f) => {
    if (category && f.category !== category) return false;
    if (subCategory && f.subCategory !== subCategory) return false;
    if (!kw) return true;
    return (
      f.name.toLowerCase().includes(kw) ||
      String(f.number).includes(kw) ||
      f.id.toLowerCase().includes(kw) ||
      f.algorithm.toLowerCase().includes(kw) ||
      (f.subCategory || "").toLowerCase().includes(kw)
    );
  });
}

// 详情页「上一个 / 下一个」：同同类 (OLL/PLL) 下的顺序
export function getNeighbors(id) {
  const f = getFormulaById(id);
  if (!f) return { prev: null, next: null };
  const list = listByCategory(f.category);
  const idx = list.findIndex((x) => x.id === id);
  return {
    prev: idx > 0 ? list[idx - 1] : null,
    next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null,
  };
}

// 闪卡：随机抽 N 张，免费用户只能抽 FREE_FORMULA_IDS 里的
export function pickFlashcardSet(n, { isPremium = false, weakIds = null } = {}) {
  let pool = isPremium ? ALL_FORMULAS : ALL_FORMULAS.filter((f) => !f.isPremium);
  if (weakIds && weakIds.length > 0) {
    const weakSet = new Set(weakIds);
    const weak = pool.filter((f) => weakSet.has(f.id));
    if (weak.length >= n) pool = weak;
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

// 调试用：暴露到 window
if (typeof window !== "undefined") {
  window.__mcFormulas = {
    all: ALL_FORMULAS,
    byId: getFormulaById,
    search: searchFormulas,
    free: [...FREE_FORMULA_IDS],
  };
}
