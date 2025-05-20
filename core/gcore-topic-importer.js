class GcoreTopicImporter extends ArticleImporter {
  constructor() {
    super();
  }

  uploadImage(file) {
    return Promise.resolve(null);
    // const formData = new FormData();
    // formData.append('file', file);
    // return fetch("https://indienova.com/home/action/blogImageUpload", {
    //   "body": formData,
    //   "method": "POST",
    //   "mode": "cors",
    //   "credentials": "include"
    // })
    //   .then(res => res.json())
    //   .then(res => {
    //     return res.link
    //   })
  }

  getMarkdownImgReplaceContent(newImageUrl, imgContent) {
    return '';
  }

  getEditor() {
    return document.querySelector('textarea');
  }

  // 获取编辑器内容
  getEditorInjectContent() {
    if (!this.editor) {
      this.showStatus('找不到编辑器元素', 'error');
      return;
    }
    if (!this.markdownContent) {
      this.showStatus('请先导入 Markdown 文件', 'error');
      return;
    }
    // 去除markdown语法标记
    const plainText = this.markdownContent.replace(/[#*_`~[\](){}|>-]/g, '');
    return plainText;
  }

  injectImportButton(buttonContainer) {
    const editorContainer = document.querySelector('.topicEditor_body');
    console.log('editorContainer', editorContainer);
    buttonContainer.style.marginBottom = '12px';
    if (editorContainer) {
      editorContainer.insertBefore(buttonContainer, editorContainer.firstChild);
    }
  }

  injectContentIntoEditor(injectContent) {
    this.editor.value = injectContent;
    // 创建并触发 input 事件
    const event = new Event('input', {
      bubbles: true,    // 允许事件冒泡
      cancelable: true  // 允许事件被取消
    });
    this.editor.dispatchEvent(event);
  }
}