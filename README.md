# 小魔方大师 (Magic Cube Master)

> 9–15 岁孩子和家长一起学魔方公式的 MVP 网站 · 纯静态 HTML 版本

---

## ⚠️ 怎么打开（必读，30 秒看完）

本项目用了 **cubing.js**（3D 魔方可视化）+ **CDN ES module**，浏览器规定这种代码**必须通过 `http://` 打开，不能直接双击 `index.html`（`file://` 协议）**，否则会白屏。

所以请按下面任一种方式打开：

### ✅ 方式一（最简单，推荐）：双击启动脚本

- **Mac 用户**：双击仓库根目录的 `启动-Mac.command`
- **Windows 用户**：双击仓库根目录的 `启动-Windows.bat`

脚本会自动启动一个本地小服务器，并用默认浏览器打开 <http://localhost:8080>。看到黄色大标题「小魔方大师」就成功了。

关闭网站时，把弹出的黑色终端窗口关掉即可。

### ✅ 方式二：把整个文件夹拖进 Chrome

打开 Chrome 浏览器空白窗口，把解压后的 **整个文件夹** 拖进去（不是单个文件），Chrome 也能跑（部分版本支持）。

### ✅ 方式三（懂技术的）：自己起服务

```bash
cd 项目目录
python3 -m http.server 8080
# 然后浏览器访问 http://localhost:8080
```

---

## 🍎 Mac 首次双击 `启动-Mac.command` 报错怎么办？

macOS 安全策略默认拦截未签名脚本。第一次会提示「无法打开，因为它来自身份不明的开发者」。解决方法：

1. 打开 **系统设置 → 隐私与安全性**
2. 滚动到最下面，会看到一行「已阻止使用 启动-Mac.command…」
3. 点 **「仍要打开」**
4. 之后双击就再也不会报错了

---

## 📦 下载安装

1. 在 GitHub 仓库页面点绿色按钮 **Code → Download ZIP**
2. 解压到桌面或任意位置
3. 按上面「怎么打开」操作即可

**不需要安装 Node.js、不需要 npm、不需要任何命令行工具。** 只要电脑里有浏览器（Chrome / Edge / Safari 都行）和 Python 3（Mac 自带，Windows 10/11 自带）就能跑。

---

## 🗂️ 项目结构

```
/index.html                  唯一入口
/启动-Mac.command            Mac 一键启动
/启动-Windows.bat            Windows 一键启动
/README.md
/css/
  reset.css                  最小重置
  theme.css                  CSS 变量（魔方黄/蓝/灰）
  components.css             按钮、卡片、徽章
  pages.css                  各页面专属样式
/js/
  main.js                    入口、初始化路由
  router.js                  hash 路由（mini router）
  store.js                   全局状态 + Pub/Sub
  storage.js                 localStorage 抽象层
  analytics.js               埋点（先 console.log，预留 Mixpanel）
  achievements.js            成就定义和检查
  utils.js                   工具函数
  cube.js                    cubing.js TwistyPlayer 封装
  /pages/
    home.js / learn.js / detail.js / practice.js
    flashcard.js / dashboard.js / pricing.js
  /data/
    oll.js                   57 个 OLL 公式
    pll.js                   21 个 PLL 公式
    formulas.js              统一查询入口
```

---

## 🎯 功能

- **首页**：品牌介绍 + 三大卖点 + Pro 入口
- **学习区**：OLL / PLL 双 Tab，按子分类筛选，搜索，卡片网格预览
- **公式详情**：3D 魔方动画演示、复制公式、标记掌握、上一个/下一个
- **练习**：闪卡（免费）/ 计时（Pro）/ 弱项强化（Pro）
- **个人中心**：练习统计、连续天数、进度环、30 天热力图、成就墙
- **定价**：免费 vs Pro，月/年切换，B 端机构咨询入口

---

## 🧰 技术栈

- HTML5 + 原生 ES Module + 原生 CSS（无 Tailwind、无框架、无构建工具）
- 3D 可视化：[cubing.js](https://js.cubing.net/cubing/) via jsDelivr CDN
- 撒花：canvas-confetti via CDN
- 状态：原生 Pub/Sub store
- 存储：localStorage（封装在 `storage.js`，未来可换 API）
- 路由：hash 路由（`#/learn` `#/practice` …）

---

## 🚧 路线图

- [x] 静态 HTML MVP（当前版本）
- [ ] 接入真实 Mixpanel 埋点
- [ ] 接入支付（Stripe / 微信支付）
- [ ] B 端机构后台（多教室、班级进度）
- [ ] PWA 离线可用

---

## 📮 联系

B 端机构合作 / 商务咨询：contact@magiccube.app
