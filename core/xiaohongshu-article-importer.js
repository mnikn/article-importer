class XiaoHongShuArticleImporter extends ArticleImporter {
  constructor() {
    super();
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