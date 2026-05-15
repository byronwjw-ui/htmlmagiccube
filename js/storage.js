// localStorage 抽象层 —— 全站唯一存储入口
// 未来换后端 API 只改这一个文件

const K = {
  USER:          "mc_user",
  ANON_UID:      "mc_anon_uid",
  PROGRESS:      "mc_progress",
  SESSIONS:      "mc_sessions",
  ACHIEVEMENTS:  "mc_achievements",
};

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("[storage] parse fail", key, e);
    return fallback;
  }
}
function safeSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn("[storage] write fail", key, e);
  }
}

function makeUid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "uid_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const DEFAULT_AVATARS = ["🧒", "👧", "🦊", "🐼", "🐯", "🦄", "🐢", "🐧"];

export const storage = {
  getOrCreateUser() {
    let user = safeGet(K.USER, null);
    if (user && user.id) return user;

    let uid = safeGet(K.ANON_UID, null);
    if (!uid) {
      uid = makeUid();
      safeSet(K.ANON_UID, uid);
    }
    user = {
      id: uid,
      nickname: "魔方小将",
      avatar: DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
      isPremium: false,
      createdAt: new Date().toISOString(),
    };
    safeSet(K.USER, user);
    return user;
  },
  setUser(user) { safeSet(K.USER, user); },

  getProgressMap()        { return safeGet(K.PROGRESS, {}); },
  setProgressMap(map)     { safeSet(K.PROGRESS, map); },

  getSessions()           { return safeGet(K.SESSIONS, []); },
  setSessions(arr)        { safeSet(K.SESSIONS, arr); },

  getAchievements()       { return safeGet(K.ACHIEVEMENTS, {}); },
  setAchievements(map)    { safeSet(K.ACHIEVEMENTS, map); },

  // 调试：一键清空（在 console 里跑 __mcStorage.reset()）
  reset() {
    Object.values(K).forEach((k) => localStorage.removeItem(k));
  },
};

if (typeof window !== "undefined") window.__mcStorage = storage;
