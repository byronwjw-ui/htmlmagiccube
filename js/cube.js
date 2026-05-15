// cubing.js TwistyPlayer 封装
// - 单例缓存 module import
// - 编程式创建实例，方便后续切换公式
// - 错误兜底：CDN 加载失败时显示 fallback

const CUBING_URL = "https://cdn.jsdelivr.net/npm/cubing@0.55.0/twisty.mjs";

let _modulePromise = null;

function loadTwistyModule() {
  if (_modulePromise) return _modulePromise;
  _modulePromise = import(CUBING_URL).catch((err) => {
    // 失败时清掉 promise，允许重试
    _modulePromise = null;
    throw err;
  });
  return _modulePromise;
}

/**
 * 创建一个魔方播放器。
 * @param {HTMLElement} container  挂载容器（会被 player 填满）
 * @param {object} opts
 * @param {string} opts.alg        要演示的算法（WCA notation）
 * @param {string} [opts.setup]    起始扰乱（一般是 invert(alg)）
 * @param {string} [opts.background='none']
 * @param {string} [opts.controlPanel='bottom-row'|'none']
 * @returns {Promise<{ player: any, destroy: () => void }>}
 */
export async function createCubePlayer(container, opts) {
  const { alg = "", setup = "", background = "none", controlPanel = "bottom-row" } = opts || {};

  // 占位骨架
  container.innerHTML = `
    <div class="cube-skeleton">
      <div class="spinner"></div>
      <div>魔方加载中…</div>
    </div>`;

  try {
    const mod = await loadTwistyModule();
    const TwistyPlayer = mod.TwistyPlayer;
    if (!TwistyPlayer) throw new Error("TwistyPlayer not found in module");

    const player = new TwistyPlayer({
      puzzle: "3x3x3",
      alg,
      experimentalSetupAlg: setup,
      background,
      controlPanel,
      hintFacelets: "none",
      backView: "none",
      visualization: "3D",
    });

    container.innerHTML = "";
    player.style.width = "100%";
    player.style.height = "100%";
    container.appendChild(player);

    return {
      player,
      destroy() {
        try { player.remove(); } catch (_) {}
      },
    };
  } catch (err) {
    console.error("[cube] load failed:", err);
    container.innerHTML = `
      <div class="cube-skeleton">
        <div style="font-size:32px">😢</div>
        <div>魔方加载失败<br/>请检查网络后刷新</div>
      </div>`;
    return { player: null, destroy() {} };
  }
}

// 预热：在用户还没进详情页时就开始下载
export function warmupCubeModule() {
  loadTwistyModule().catch(() => {});
}
