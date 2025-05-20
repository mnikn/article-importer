const init = () => {
  const importerTable = {
    'https://indienova.com/home/blog/newpost': IndieNovaImporter,
    'https://indienova.com/home/blogedit': IndieNovaImporter,
    'https://www.gcores.com/topics/editor': GcoreTopicImporter,
    'https://www.xiaoheihe.cn/creator/editor/draft/article': XiaoHeiHeArticleImporter,
    'https://www.xiaoheihe.cn/creator/editor/draft/image_text': XiaoHeiHeImageTextImporter,
    'https://creator.xiaohongshu.com/publish/publish': XiaoHongShuArticleImporter,
  }

  const href = window.location.href;
  const importerClassKey = Object.keys(importerTable).find((key) => {
    return href.startsWith(key);
  })
  if (importerClassKey) {
    const importerClass = importerTable[importerClassKey];
    const importer = new importerClass();
    importer.init();
  }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setTimeout(init, 1000));
} else {
  setTimeout(init, 1000)
}

