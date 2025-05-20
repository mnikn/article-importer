class XiaoHeiHeImageTextImporter extends ArticleImporter {
  constructor() {
    super();
  }

  uploadImage(file) {
    return Promise.resolve(null);
  }

  getMarkdownImgReplaceContent(newImageUrl, imgContent) {
    return '';
  }

  getEditor() {
    return document.querySelectorAll('.hb-editor')[1];
  }

  injectImportButton(buttonContainer) {
    const editorContainer = document.querySelector('.editor-image-text__section');
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