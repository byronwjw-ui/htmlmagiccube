// 57 个 OLL 公式
// 算法来源：SpeedCubeDB / J Perm / Cubeskills 通用版本
// setupMoves 不手写 —— 由 formulas.js 调用 invertAlgorithm(algorithm) 自动生成
//
// pattern: 9 位字符，代表顶面九孫颜色（左上起，行优先）
//   Y = 黄色已定向 / X = 未定向（侧面色）
//
// difficulty: 1=简单 2=中等 3=较难

export const OLL_FORMULAS = [
  // ---------- All Edges Oriented (OLL 1-7 粗分为连棒 / 鱼 等不同子分类，
  //            这里按官方编号递增，subCategory 取顶面黄色起定向棱数） ----------

  // ===== 棱没定向（点型，0 个黄棱棱面朝上） OLL 1-2 =====
  {
    id: "oll-1", category: "OLL", subCategory: "点型", number: 1, name: "Dot 1",
    algorithm: "R U2 R2 F R F' U2 R' F R F'",
    pattern: "XYXYXYXYX",
    difficulty: 3, isPremium: true,
    tip: "两次 sexy 变体，注意中间的 R2 是 180°。"
  },
  {
    id: "oll-2", category: "OLL", subCategory: "点型", number: 2, name: "Dot 2",
    algorithm: "F R U R' U' F' f R U R' U' f'",
    pattern: "XYXYXYXYX",
    difficulty: 3, isPremium: true,
    tip: "先 F 变体 + 再一次宽 f 变体，正反两面都要多练。"
  },

  // ===== 棱没定向（鱼型） OLL 3-4 =====
  {
    id: "oll-3", category: "OLL", subCategory: "鱼型", number: 3, name: "Fish 1",
    algorithm: "f R U R' U' f' U' F R U R' U' F'",
    pattern: "YXXXYXXYY",
    difficulty: 3, isPremium: true,
    tip: "双 f / F 变体，中间记得 U'。"
  },
  {
    id: "oll-4", category: "OLL", subCategory: "鱼型", number: 4, name: "Fish 2",
    algorithm: "f R U R' U' f' U F R U R' U' F'",
    pattern: "YXXYYXXXY",
    difficulty: 3, isPremium: true,
    tip: "和 OLL 3 镜像，中间变为 U。"
  },

  // ===== 十字型棱定向（4 个棱都朝上，但角未定向） OLL 21-27 =====
  // 官方顺序：21 H 、 22 Pi 、 23 Headlights 、 24 Bowtie、 25 Bowtie-Mirror（众称）、 26 Anti-Sune、 27 Sune
  {
    id: "oll-21", category: "OLL", subCategory: "十字", number: 21, name: "H / Double Sune",
    algorithm: "R U R' U R U' R' U R U2 R'",
    pattern: "XYXYYYXYX",
    difficulty: 2, isPremium: false,
    tip: "三棒胶：Sune + Anti-Sune 拼接，双手节奏快。"
  },
  {
    id: "oll-22", category: "OLL", subCategory: "十字", number: 22, name: "Pi",
    algorithm: "R U2 R2 U' R2 U' R2 U2 R",
    pattern: "XYXYYYYYX",
    difficulty: 2, isPremium: false,
    tip: "连续 R2，节奏变化在 U / U2 上。"
  },
  {
    id: "oll-23", category: "OLL", subCategory: "十字", number: 23, name: "Headlights",
    algorithm: "R2 D' R U2 R' D R U2 R",
    pattern: "YYXYYYYYX",
    difficulty: 2, isPremium: false,
    tip: "D 下底面动作，看准黄色「车头灯」对准后面。"
  },
  {
    id: "oll-24", category: "OLL", subCategory: "十字", number: 24, name: "Bowtie",
    algorithm: "r U R' U' r' F R F'",
    pattern: "XYYYYYXYY",
    difficulty: 1, isPremium: false,
    tip: "领结状：r 是右侧宽块，后半部分是 sledgehammer。"
  },
  {
    id: "oll-25", category: "OLL", subCategory: "十字", number: 25, name: "Bowtie Mirror",
    algorithm: "F' r U R' U' r' F R",
    pattern: "YYXYYYYYX",
    difficulty: 2, isPremium: false,
    tip: "OLL 24 的镜像版，起手 F' 是关键。"
  },
  {
    id: "oll-26", category: "OLL", subCategory: "十字", number: 26, name: "Anti-Sune",
    algorithm: "R U2 R' U' R U' R'",
    pattern: "YYXXYXYYY",
    difficulty: 1, isPremium: false,
    tip: "和 Sune 镜像，从 R 变为 R 但中间多一个 U2。口诀：右上双下、右上下右。"
  },
  {
    id: "oll-27", category: "OLL", subCategory: "十字", number: 27, name: "Sune",
    algorithm: "R U R' U R U2 R'",
    pattern: "YXYYYXYYY",
    difficulty: 1, isPremium: false,
    tip: "入门公式、使用率最高，口诀：右上、右上、上下双。"
  },

  // ===== 棱全定向，4 个角未定向（其他十字） OLL 5-8 （小鱼 / 大鱼 等） =====
  {
    id: "oll-5", category: "OLL", subCategory: "闪光", number: 5, name: "Squad 1",
    algorithm: "l' U2 L U L' U l",
    pattern: "XXYXYYXYY",
    difficulty: 2, isPremium: true,
    tip: "l 是左侧宽块，Beginner 过渡到 Full OLL 的经典公式。"
  },
  {
    id: "oll-6", category: "OLL", subCategory: "闪光", number: 6, name: "Squad 2",
    algorithm: "r U2 R' U' R U' r'",
    pattern: "YXXYYXYYX",
    difficulty: 2, isPremium: true,
    tip: "OLL 5 的镜像。"
  },
  {
    id: "oll-7", category: "OLL", subCategory: "小鱼", number: 7, name: "Lightning 1",
    algorithm: "r U R' U R U2 r'",
    pattern: "YXXYYYYYX",
    difficulty: 2, isPremium: true,
    tip: "跟 Sune 同步，但首末是宽块 r / r'。"
  },
  {
    id: "oll-8", category: "OLL", subCategory: "小鱼", number: 8, name: "Lightning 2",
    algorithm: "l' U' L U' L' U2 l",
    pattern: "XXYYYYXYY",
    difficulty: 2, isPremium: true,
    tip: "OLL 7 的镜像。"
  },

  // ===== 鬼脸 / 小鱼 类型 OLL 9-12 =====
  {
    id: "oll-9", category: "OLL", subCategory: "鱼面", number: 9, name: "Fish Salad",
    algorithm: "R U R' U' R' F R2 U R' U' F'",
    pattern: "YXXYYYYXY",
    difficulty: 2, isPremium: true,
    tip: "中间的 R2 是关键，后半部分 sledgehammer 变体。"
  },
  {
    id: "oll-10", category: "OLL", subCategory: "鱼面", number: 10, name: "Anti-Fish",
    algorithm: "R U R' U R' F R F' R U2 R'",
    pattern: "YYXXYYXYY",
    difficulty: 3, isPremium: true,
    tip: "棱棒出鬼脸，手法容易报错多练。"
  },
  {
    id: "oll-11", category: "OLL", subCategory: "闪光", number: 11, name: "Lightning 3",
    algorithm: "r U R' U R' F R F' R U2 r'",
    pattern: "YYXXYXYYY",
    difficulty: 3, isPremium: true,
    tip: "双宽块 r/r' 外加 sledgehammer。"
  },
  {
    id: "oll-12", category: "OLL", subCategory: "闪光", number: 12, name: "Lightning 4",
    algorithm: "M' R' U' R U' R' U2 R U' R r'",
    pattern: "YXYXYYYYX",
    difficulty: 3, isPremium: true,
    tip: "带 M slice，高阶公式。"
  },

  // ===== 靶型 OLL 13-17 =====
  {
    id: "oll-13", category: "OLL", subCategory: "靶型", number: 13, name: "Knight Move 1",
    algorithm: "F U R U' R2 F' R U R U' R'",
    pattern: "XXYYYXYYX",
    difficulty: 3, isPremium: true,
    tip: "F + R2 拼接 sexy。"
  },
  {
    id: "oll-14", category: "OLL", subCategory: "靶型", number: 14, name: "Knight Move 2",
    algorithm: "R' F R U R' F' R F U' F'",
    pattern: "XYXXYYXYY",
    difficulty: 3, isPremium: true,
    tip: "OLL 13 的镜像。"
  },
  {
    id: "oll-15", category: "OLL", subCategory: "靶型", number: 15, name: "Knight Move 3",
    algorithm: "r' U' r R' U' R U r' U r",
    pattern: "XXYXYYYYX",
    difficulty: 3, isPremium: true,
    tip: "双宽块运动，节奏必须平顺。"
  },
  {
    id: "oll-16", category: "OLL", subCategory: "靶型", number: 16, name: "Knight Move 4",
    algorithm: "r U r' R U R' U' r U' r'",
    pattern: "YXXYYXXYY",
    difficulty: 3, isPremium: true,
    tip: "OLL 15 的镜像。"
  },
  {
    id: "oll-17", category: "OLL", subCategory: "靶型", number: 17, name: "Dot 3",
    algorithm: "R U R' U R' F R F' U2 R' F R F'",
    pattern: "XYXXYYYYY",
    difficulty: 3, isPremium: true,
    tip: "两段 sledgehammer 中间多一个 U2。"
  },

  // ===== 点型变体 OLL 18-20 =====
  {
    id: "oll-18", category: "OLL", subCategory: "点型", number: 18, name: "Dot 4",
    algorithm: "r U R' U R U2 r2 U' R U' R' U2 r",
    pattern: "XYXYYYXYX",
    difficulty: 3, isPremium: true,
    tip: "长公式，动作多。可拆为两段 Sune 记忆。"
  },
  {
    id: "oll-19", category: "OLL", subCategory: "点型", number: 19, name: "Dot 5",
    algorithm: "M U R U R' U' M' R' F R F'",
    pattern: "XYXYYYXYX",
    difficulty: 3, isPremium: true,
    tip: "含 M slice。"
  },
  {
    id: "oll-20", category: "OLL", subCategory: "点型", number: 20, name: "Dot 6",
    algorithm: "M U R U R' U' M2 U R U' r'",
    pattern: "XYXYYYXYX",
    difficulty: 3, isPremium: true,
    tip: "含 M2 + r' 变体。"
  },

  // ===== 十字 + 同色头 OLL 28-32 =====
  {
    id: "oll-28", category: "OLL", subCategory: "棱完成", number: 28, name: "Stealth",
    algorithm: "r U R' U' r' R U R U' R'",
    pattern: "YXYYYYYYY",
    difficulty: 2, isPremium: true,
    tip: "上面看不出什么，但侧面棱已对，东西默默动。"
  },
  {
    id: "oll-29", category: "OLL", subCategory: "P/W", number: 29, name: "Awkward 1",
    algorithm: "R U R' U' R U' R' F' U' F R U R'",
    pattern: "XXYYYXXYY",
    difficulty: 3, isPremium: true,
    tip: "依赖多个 sexy 变体，节奏必须连贯。"
  },
  {
    id: "oll-30", category: "OLL", subCategory: "P/W", number: 30, name: "Awkward 2",
    algorithm: "F R' F R2 U' R' U' R U R' F2",
    pattern: "YXXYYYYXX",
    difficulty: 3, isPremium: true,
    tip: "双 F 头尾。"
  },
  {
    id: "oll-31", category: "OLL", subCategory: "P/W", number: 31, name: "P 1",
    algorithm: "R' U' F U R U' R' F' R",
    pattern: "XYYXYXXYY",
    difficulty: 2, isPremium: true,
    tip: "短小精悘，中间三步是 sexy。"
  },
  {
    id: "oll-32", category: "OLL", subCategory: "P/W", number: 32, name: "P 2",
    algorithm: "L U F' U' L' U L F L'",
    pattern: "YYXXYXYYX",
    difficulty: 2, isPremium: true,
    tip: "左手为主、L/F 交替。"
  },

  // ===== T 型 OLL 33-34, 45 =====
  {
    id: "oll-33", category: "OLL", subCategory: "T 型", number: 33, name: "T-Shape 1",
    algorithm: "R U R' U' R' F R F'",
    pattern: "XYXXYXYYY",
    difficulty: 1, isPremium: false,
    tip: "小白首选公式：sexy + sledgehammer，节奏快，手感好。"
  },
  {
    id: "oll-34", category: "OLL", subCategory: "C 型", number: 34, name: "C-Shape Mirror",
    algorithm: "R U R2 U' R' F R U R U' F'",
    pattern: "XYXYYXXYY",
    difficulty: 2, isPremium: true,
    tip: "R2 过渡 + F 变体收尾。"
  },
  {
    id: "oll-35", category: "OLL", subCategory: "闪光", number: 35, name: "Fish Lightning",
    algorithm: "R U2 R2 F R F' R U2 R'",
    pattern: "YYXXYYYYX",
    difficulty: 2, isPremium: true,
    tip: "两次 R U2 R' 夹中间一个 F R F'。"
  },
  {
    id: "oll-36", category: "OLL", subCategory: "W 型", number: 36, name: "W 1",
    algorithm: "L' U' L U' L' U L U L F' L' F",
    pattern: "YXYYYXXYY",
    difficulty: 3, isPremium: true,
    tip: "长公式，口诀：左左左左左左 + 軗轮。"
  },
  {
    id: "oll-37", category: "OLL", subCategory: "鱼型", number: 37, name: "Fish 3",
    algorithm: "F R U' R' U' R U R' F'",
    pattern: "YXXXYYYYX",
    difficulty: 2, isPremium: true,
    tip: "F sexy F'，起伏平稳。"
  },
  {
    id: "oll-38", category: "OLL", subCategory: "W 型", number: 38, name: "W 2",
    algorithm: "R U R' U R U' R' U' R' F R F'",
    pattern: "YYXXYYXYY",
    difficulty: 2, isPremium: true,
    tip: "Sune 变体 + sledgehammer。"
  },
  {
    id: "oll-39", category: "OLL", subCategory: "L 型", number: 39, name: "BLBS",
    algorithm: "L F' L' U' L U F U' L'",
    pattern: "YYXYYXXYY",
    difficulty: 3, isPremium: true,
    tip: "L + F' 手法，节奏要稳。"
  },
  {
    id: "oll-40", category: "OLL", subCategory: "L 型", number: 40, name: "FRFU",
    algorithm: "R' F R U R' U' F' U R",
    pattern: "YYXYYXXYY",
    difficulty: 3, isPremium: true,
    tip: "OLL 39 的镜像。"
  },
  {
    id: "oll-41", category: "OLL", subCategory: "鱼型", number: 41, name: "Awkward Fish",
    algorithm: "R U R' U R U2 R' F R U R' U' F'",
    pattern: "YXXXYYYYX",
    difficulty: 3, isPremium: true,
    tip: "Sune + F sexy F'。"
  },
  {
    id: "oll-42", category: "OLL", subCategory: "鱼型", number: 42, name: "Awkward Fish Mirror",
    algorithm: "R' U' R U' R' U2 R F R U R' U' F'",
    pattern: "YXXYYYXYX",
    difficulty: 3, isPremium: true,
    tip: "OLL 41 的镜像。"
  },
  {
    id: "oll-43", category: "OLL", subCategory: "P/W", number: 43, name: "P 3",
    algorithm: "f' L' U' L U f",
    pattern: "XXYXYYYYX",
    difficulty: 1, isPremium: true,
    tip: "极短公式，双 f 变体。"
  },
  {
    id: "oll-44", category: "OLL", subCategory: "P/W", number: 44, name: "P 4",
    algorithm: "f R U R' U' f'",
    pattern: "XXYYYXXYY",
    difficulty: 1, isPremium: false,
    tip: "另一个经典入门：F 变体的 sexy 套餐，手感舒服。"
  },
  {
    id: "oll-45", category: "OLL", subCategory: "T 型", number: 45, name: "T-Shape 2",
    algorithm: "F R U R' U' F'",
    pattern: "XXYYYYXYX",
    difficulty: 1, isPremium: false,
    tip: "初学者最爱：F sexy F'，6 步搞定。"
  },
  {
    id: "oll-46", category: "OLL", subCategory: "C 型", number: 46, name: "C-Shape",
    algorithm: "R' U' R' F R F' U R",
    pattern: "XYYYYXXYY",
    difficulty: 2, isPremium: true,
    tip: "反向 sledgehammer。"
  },
  {
    id: "oll-47", category: "OLL", subCategory: "L 型", number: 47, name: "L 1",
    algorithm: "F' L' U' L U L' U' L U F",
    pattern: "XYYYYXYYX",
    difficulty: 3, isPremium: true,
    tip: "长公式，拆为 F' + 两次 lefty sexy + F。"
  },
  {
    id: "oll-48", category: "OLL", subCategory: "L 型", number: 48, name: "L 2",
    algorithm: "F R U R' U' R U R' U' F'",
    pattern: "XYYXYXYYX",
    difficulty: 2, isPremium: true,
    tip: "F + 两次 sexy + F'。"
  },
  {
    id: "oll-49", category: "OLL", subCategory: "L 型", number: 49, name: "L 3",
    algorithm: "r U' r2 U r2 U r2 U' r",
    pattern: "XYXYYYYYY",
    difficulty: 3, isPremium: true,
    tip: "连续宽块 r 转，节奏是关键。"
  },
  {
    id: "oll-50", category: "OLL", subCategory: "L 型", number: 50, name: "L 4",
    algorithm: "r' U r2 U' r2 U' r2 U r'",
    pattern: "YYXYYYYYX",
    difficulty: 3, isPremium: true,
    tip: "OLL 49 的镜像。"
  },
  {
    id: "oll-51", category: "OLL", subCategory: "一字", number: 51, name: "Line 1",
    algorithm: "f R U R' U' R U R' U' f'",
    pattern: "XXXYYYXXX",
    difficulty: 2, isPremium: true,
    tip: "双 f 包裹 + 两次 sexy。"
  },
  {
    id: "oll-52", category: "OLL", subCategory: "一字", number: 52, name: "Line 2",
    algorithm: "R U R' U R U' B U' B' R'",
    pattern: "YXXXYXYXY",
    difficulty: 3, isPremium: true,
    tip: "含罕见的 B 面动作。"
  },
  {
    id: "oll-53", category: "OLL", subCategory: "L 型", number: 53, name: "L 5",
    algorithm: "r' U' R U' R' U R U' R' U2 r",
    pattern: "XYXYYXYYY",
    difficulty: 3, isPremium: true,
    tip: "长公式、双宽块。"
  },
  {
    id: "oll-54", category: "OLL", subCategory: "L 型", number: 54, name: "L 6",
    algorithm: "r U R' U R U' R' U R U2 r'",
    pattern: "YYYXYYXYX",
    difficulty: 3, isPremium: true,
    tip: "OLL 53 的镜像。"
  },
  {
    id: "oll-55", category: "OLL", subCategory: "一字", number: 55, name: "Line 3",
    algorithm: "R' F R U R U' R2 F' R2 U' R' U R U R'",
    pattern: "XXXYYYXXX",
    difficulty: 3, isPremium: true,
    tip: "长公式，高阶选修。"
  },
  {
    id: "oll-56", category: "OLL", subCategory: "十字", number: 56, name: "Streetlights",
    algorithm: "r U r' U R U' R' U R U' R' r U' r'",
    pattern: "XYXYYYXYX",
    difficulty: 3, isPremium: true,
    tip: "双宽块夹两次 sexy，节奏要连贯。"
  },
  {
    id: "oll-57", category: "OLL", subCategory: "棱完成", number: 57, name: "H / Checkers",
    algorithm: "R U R' U' M' U R U' r'",
    pattern: "YYYYYYYYY",
    difficulty: 2, isPremium: true,
    tip: "顶面已经全黄，只调角朝向。含 M' slice。"
  }
];
