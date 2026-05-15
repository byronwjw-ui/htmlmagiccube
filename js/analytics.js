// 埋点：MVP 阶段先 console.log，未来接 Mixpanel
// track(event, props) 是唯一对外接口

const BUFFER = [];
const MAX_BUFFER = 500;

function getUid() {
  try {
    const raw = localStorage.getItem("mc_anon_uid");
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

export const analytics = {
  track(event, props = {}) {
    const payload = {
      event,
      props: { ...props, ts: Date.now() },
      uid: getUid(),
    };
    BUFFER.push(payload);
    if (BUFFER.length > MAX_BUFFER) BUFFER.shift();

    // eslint-disable-next-line no-console
    console.log(
      "%c[track]%c " + event,
      "color:#0046AD;font-weight:700",
      "color:inherit",
      payload.props
    );

    // TODO: 接 Mixpanel
    // if (window.mixpanel) window.mixpanel.track(event, payload.props);
  },
  dump() { return [...BUFFER]; },
};

if (typeof window !== "undefined") window.__mcAnalytics = analytics;
