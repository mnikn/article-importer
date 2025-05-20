// 监听扩展安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('Markdown Article Importer 已安装');
});