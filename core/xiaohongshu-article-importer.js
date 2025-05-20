class XiaoHongShuArticleImporter extends ArticleImporter {
  constructor() {
    super();
  }

  createImportButton() {
    const buttonContainer = super.createImportButton();
    buttonContainer.querySelector('#sync-img-button').style.display = 'none';
    return buttonContainer;
  }

  getEditorInjectContent() {
    if (!this.editor) {
      this.showStatus('找不到编辑器元素', 'error');
      return;
    }
    if (!this.markdownContent) {
      this.showStatus('请先导入 Markdown 文件', 'error');
      return;
    }
    const content = this.removeMarkdownImgLinks(this.markdownContent);
    return marked.parse(content);
  }

  init() {
    new Promise((resolve, reject) => {
      let timer = setInterval(() => {
        const queryEle = document.querySelector('.post-page')
        if (queryEle) {
          clearInterval(timer)
          resolve()
        }
      }, 500)
    }).then(() => {
      super.init();
    })
  }

  uploadImage(file) {
    return Promise.resolve(null);
  }

  getMarkdownImgReplaceContent(newImageUrl, imgContent) {
    return '';
  }

  getEditor() {
    return document.querySelector('.ql-editor');
  }

  injectImportButton(buttonContainer) {
    const editorContainer = document.querySelector('.content');
    buttonContainer.style.marginBottom = '12px';
    if (editorContainer) {
      editorContainer.insertBefore(buttonContainer, editorContainer.firstChild);
    }
  }

  injectContentIntoEditor(injectContent) {
    this.editor.innerHTML = injectContent;
  }
}