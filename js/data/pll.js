// 21 个 PLL 公式
// 算法来源：SpeedCubeDB / J Perm / Cubeskills 通用版本
// id 按名字命名：pll-Ua / pll-T / pll-Y 等，方便路由可读
//
// subCategory：Edges-only / Corners-only / Adj-Swap / Diag-Swap / G
//
// pattern: 9 位顶面（PLL 顶面都是黄色，但为了统一用 'Y' 表示）
//   PLL 卡片上 2D 预览默认全黄，差异要靠侧面表达——后续可以加箭头侧面示意。

export const PLL_FORMULAS = [
  // ===== 棱交换（角不动） =====
  {
    id: "pll-Ua", category: "PLL", subCategory: "棱交换", number: 1, name: "Ua-Perm",
    algorithm: "R U' R U R U R U' R' U' R2",
    pattern: "YYYYYYYYY",
    difficulty: 1, isPremium: false,
    tip: "三棱顺时针轮换。口诀：R U' 开头，后面三次 R U。"
  },
  {
    id: "pll-Ub", category: "PLL", subCategory: "棱交换", number: 2, name: "Ub-Perm",
    algorithm: "R2 U R U R' U' R' U' R' U R'",
    pattern: "YYYYYYYYY",
    difficulty: 1, isPremium: false,
    tip: "三棱逆时针轮换。Ua 的镜像。"
  },
  {
    id: "pll-H", category: "PLL", subCategory: "棱交换", number: 3, name: "H-Perm",
    algorithm: "M2 U M2 U2 M2 U M2",
    pattern: "YYYYYYYYY",
    difficulty: 1, isPremium: false,
    tip: "四棱两两对换，全 M slice，最好记的 PLL。"
  },
  {
    id: "pll-Z", category: "PLL", subCategory: "棱交换", number: 4, name: "Z-Perm",
    algorithm: "M' U M2 U M2 U M' U2 M2",
    pattern: "YYYYYYYYY",
    difficulty: 1, isPremium: false,
    tip: "隔棱交换。与 H 同族都是 M slice 公式。"
  },

  // ===== 角交换（棱不动） =====
  {
    id: "pll-Aa", category: "PLL", subCategory: "角交换", number: 5, name: "Aa-Perm",
    algorithm: "x R' U R' D2 R U' R' D2 R2",
    pattern: "YYYYYYYYY",
    difficulty: 1, isPremium: false,
    tip: "三角顺时轮换。起手 x 转体，后续都是 R/D 动作。"
  },
  {
    id: "pll-Ab", category: "PLL", subCategory: "角交换", number: 6, name: "Ab-Perm",
    algorithm: "x R2 D2 R U R' D2 R U' R",
    pattern: "YYYYYYYYY",
    difficulty: 1, isPremium: true,
    tip: "三角逆时轮换。Aa 的镜像。"
  },
  {
    id: "pll-E", category: "PLL", subCategory: "角交换", number: 7, name: "E-Perm",
    algorithm: "x' R U' R' D R U R' D' R U R' D R U' R' D'",
    pattern: "YYYYYYYYY",
    difficulty: 3, isPremium: true,
    tip: "对角两对交换。公式长，需要多练 D 面节奏。"
  },

  // ===== 邻角 + 棱交换 =====
  {
    id: "pll-T", category: "PLL", subCategory: "邻角棱", number: 8, name: "T-Perm",
    algorithm: "R U R' U' R' F R2 U' R' U' R U R' F'",
    pattern: "YYYYYYYYY",
    difficulty: 2, isPremium: true,
    tip: "使用率最高的 PLL！双手必背。额外用于多种 3-cycle 场景。"
  },
  {
    id: "pll-F", category: "PLL", subCategory: "邻角棱", number: 9, name: "F-Perm",
    algorithm: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
    pattern: "YYYYYYYYY",
    difficulty: 3, isPremium: true,
    tip: "可以记为「R' U' F' + T-Perm + F R」的拼接。"
  },
  {
    id: "pll-Ja", category: "PLL", subCategory: "邻角棱", number: 10, name: "Ja-Perm",
    algorithm: "x R2 F R F' R U2 r' U r U2",
    pattern: "YYYYYYYYY",
    difficulty: 2, isPremium: true,
    tip: "两角一棱交换，起手 x 转体。"
  },
  {
    id: "pll-Jb", category: "PLL", subCategory: "邻角棱", number: 11, name: "Jb-Perm",
    algorithm: "R U R' F' R U R' U' R' F R2 U' R' U'",
    pattern: "YYYYYYYYY",
    difficulty: 2, isPremium: true,
    tip: "Ja 的镜像。和 T-Perm 手法接近、可联记。"
  },
  {
    id: "pll-Ra", category: "PLL", subCategory: "邻角棱", number: 12, name: "Ra-Perm",
    algorithm: "R U' R' U' R U R D R' U' R D' R' U2 R'",
    pattern: "YYYYYYYYY",
    difficulty: 3, isPremium: true,
    tip: "含 D / D' 使用。R/Ra-Perm 是一对镜像。"
  },
  {
    id: "pll-Rb", category: "PLL", subCategory: "邻角棱", number: 13, name: "Rb-Perm",
    algorithm: "R' U2 R U2 R' F R U R' U' R' F' R2",
    pattern: "YYYYYYYYY",
    difficulty: 3, isPremium: true,
    tip: "Ra 的镜像。中间是 sexy + F'。"
  },

  // ===== 对角 + 棱交换（难点） =====
  {
    id: "pll-V", category: "PLL", subCategory: "对角棱", number: 14, name: "V-Perm",
    algorithm: "R' U R' U' y R' F' R2 U' R' U R' F R F",
    pattern: "YYYYYYYYY",
    difficulty: 3, isPremium: true,
    tip: "含 y 转体过渡，节奏多练。"
  },
  {
    id: "pll-Y", category: "PLL", subCategory: "对角棱", number: 15, name: "Y-Perm",
    algorithm: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    pattern: "YYYYYYYYY",
    difficulty: 3, isPremium: true,
    tip: "长，但只是 F sexy F' + R sledgehammer F R F'。誓言级公式。"
  },
  {
    id: "pll-Na", category: "PLL", subCategory: "对角棱", number: 16, name: "Na-Perm",
    algorithm: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
    pattern: "YYYYYYYYY",
    difficulty: 3, isPremium: true,
    tip: "最长的 PLL 之一，可以拆为两段 J-Perm 变体。"
  },
  {
    id: "pll-Nb", category: "PLL", subCategory: "对角棱", number: 17, name: "Nb-Perm",
    algorithm: "R' U R U' R' F' U' F R U R' F R' F' R U' R",
    pattern: "YYYYYYYYY",
    difficulty: 3, isPremium: true,
    tip: "Na 的镜像。"
  },

  // ===== G 类（8 个块都动，最复杂） =====
  {
    id: "pll-Ga", category: "PLL", subCategory: "G 型", number: 18, name: "Ga-Perm",
    algorithm: "R2 U R' U R' U' R U' R2 U' D R' U R D'",
    pattern: "YYYYYYYYY",
    difficulty: 3, isPremium: true,
    tip: "含 D / D' 动作。G 类四个吉必要联动记。"
  },
  {
    id: "pll-Gb", category: "PLL", subCategory: "G 型", number: 19, name: "Gb-Perm",
    algorithm: "R' U' R U D' R2 U R' U R U' R U' R2 D",
    pattern: "YYYYYYYYY",
    difficulty: 3, isPremium: true,
    tip: "起手是 sexy 反转。"
  },
  {
    id: "pll-Gc", category: "PLL", subCategory: "G 型", number: 20, name: "Gc-Perm",
    algorithm: "R2 U' R U' R U R' U R2 U D' R U' R' D",
    pattern: "YYYYYYYYY",
    difficulty: 3, isPremium: true,
    tip: "Ga 的镜像。"
  },
  {
    id: "pll-Gd", category: "PLL", subCategory: "G 型", number: 21, name: "Gd-Perm",
    algorithm: "R U R' U' D R2 U' R U' R' U R' U R2 D'",
    pattern: "YYYYYYYYY",
    difficulty: 3, isPremium: true,
    tip: "Gb 的镜像。G 类里手感最顺的一个。"
  }
];
