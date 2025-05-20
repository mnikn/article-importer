class XiaoHeiHeArticleImporter extends ArticleImporter {
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

  getEditor() {
    return document.querySelectorAll('.hb-editor')[1];
  }

  injectImportButton(buttonContainer) {
    const editorContainer = document.querySelector('.editor-article__section');
    console.log('editorContainer', editorContainer);
    buttonContainer.style.marginBottom = '12px';
    if (editorContainer) {
      editorContainer.insertBefore(buttonContainer, editorContainer.firstChild);
    }
  }

  injectContentIntoEditor(injectContent) {
    this.editor.innerHTML = injectContent;
  }
}