// 极简 hash 路由：支持 /learn/:category/:id 这种参数路径
export class Router {
  constructor(outlet) {
    this.outlet = outlet;
    this.routes = [];
    this.notFoundHandler = null;
    this._currentCleanup = null;
  }

  add(pattern, handler) {
    const keys = [];
    const regex = new RegExp(
      "^" +
        pattern
          .replace(/\//g, "\\/")
          .replace(/:([a-zA-Z]+)/g, (_, k) => {
            keys.push(k);
            return "([^\\/]+)";
          }) +
        "$"
    );
    this.routes.push({ pattern, regex, keys, handler });
    return this;
  }

  notFound(handler) {
    this.notFoundHandler = handler;
    return this;
  }

  start() {
    window.addEventListener("hashchange", () => this._render());
    this._render();
  }

  _render() {
    // 调用上一个页面的 cleanup（比如详情页要销毁 TwistyPlayer）
    if (typeof this._currentCleanup === "function") {
      try { this._currentCleanup(); } catch (_) {}
      this._currentCleanup = null;
    }

    const path = (location.hash || "#/").replace(/^#/, "") || "/";
    window.scrollTo({ top: 0 });

    for (const route of this.routes) {
      const m = path.match(route.regex);
      if (m) {
        const params = {};
        route.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
        const result = route.handler(this.outlet, params);
        // 页面 render 函数可以返回 cleanup 函数
        if (typeof result === "function") this._currentCleanup = result;
        return;
      }
    }

    if (this.notFoundHandler) this.notFoundHandler(this.outlet);
  }
}

// 跳转辅助
export function navigate(path) {
  if (!path.startsWith("/")) path = "/" + path;
  location.hash = "#" + path;
}
