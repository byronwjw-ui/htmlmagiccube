// 原生 Pub/Sub 全局 store
// state shape: { user, progress: {[formulaId]: UserProgress}, sessions: PracticeSession[], achievements: {[id]: ISO} }

function shallowDiffKeys(a, b) {
  const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  const changed = new Set();
  for (const k of keys) if (a?.[k] !== b?.[k]) changed.add(k);
  return changed;
}

class Store {
  constructor(initial = {}) {
    this._state = initial;
    this._subs = new Set();
  }
  getState() { return this._state; }
  setState(patch) {
    const next = { ...this._state, ...patch };
    const changed = shallowDiffKeys(this._state, next);
    if (changed.size === 0) return;
    this._state = next;
    this._subs.forEach((fn) => {
      try { fn(this._state, changed); } catch (e) { console.error(e); }
    });
  }
  subscribe(fn) {
    this._subs.add(fn);
    return () => this._subs.delete(fn);
  }
}

export const store = new Store({
  user: null,
  progress: {},
  sessions: [],
  achievements: {},
});

// ---------- 业务辅助方法（避免页面直接乱改 state） ----------
export function setFormulaStatus(formulaId, status) {
  const s = store.getState();
  const prev = s.progress[formulaId] || makeBlankProgress(formulaId);
  const next = {
    ...s.progress,
    [formulaId]: { ...prev, status, lastPracticedAt: new Date().toISOString() },
  };
  store.setState({ progress: next });
}

export function recordPractice(formulaId, success) {
  const s = store.getState();
  const prev = s.progress[formulaId] || makeBlankProgress(formulaId);
  const total = prev.practiceCount + 1;
  const correct = Math.round(prev.successRate * prev.practiceCount) + (success ? 1 : 0);
  const next = {
    ...s.progress,
    [formulaId]: {
      ...prev,
      practiceCount: total,
      successRate: total > 0 ? correct / total : 0,
      lastPracticedAt: new Date().toISOString(),
      status: prev.status === "new" ? "learning" : prev.status,
    },
  };
  store.setState({ progress: next });
}

export function addSession(session) {
  const s = store.getState();
  const sessions = [session, ...s.sessions].slice(0, 200);
  store.setState({ sessions });
}

export function updateUser(patch) {
  const s = store.getState();
  store.setState({ user: { ...s.user, ...patch } });
}

export function unlockAchievement(id) {
  const s = store.getState();
  if (s.achievements[id]) return false;
  store.setState({
    achievements: { ...s.achievements, [id]: new Date().toISOString() },
  });
  return true;
}

function makeBlankProgress(formulaId) {
  return {
    formulaId,
    status: "new",
    practiceCount: 0,
    lastPracticedAt: null,
    successRate: 0,
    classroomId: null, // B 端预留
  };
}
