// 占位：Commit 3 实现
export function renderDetail(outlet, params) {
  outlet.innerHTML = `<div class="container"><div class="empty"><div class="empty-emoji">🚧</div><h2>详情页</h2><p class="text-muted mt-2">即将到来：${params.category} / ${params.id}</p></div></div>`;
}
