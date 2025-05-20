class IndieNovaImporter extends ArticleImporter {
  constructor() {
    super();
  }

  uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    return fetch("https://indienova.com/home/action/blogImageUpload", {
      "body": formData,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    })
      .then(res => res.json())
      .then(res => {
        return res.link
      })
  }

  getMarkdownImgReplaceContent(newImageUrl, imgContent) {
    return `<img class="fr-fin fr-dib" alt="Image title" src="${newImageUrl}"></img>`;
  }

  getEditor() {
    return document.querySelector('.froala-view');
  }

  injectImportButton(buttonContainer) {
    const editorContainer = document.querySelector('.froala-box');
    buttonContainer.style.marginBottom = '12px';
    if (editorContainer) {
      editorContainer.insertBefore(buttonContainer, editorContainer.firstChild);
    }
  }

  injectContentIntoEditor(injectContent) {
    this.editor.innerHTML = injectContent;
  }
}