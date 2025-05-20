function getFileName(path) {
  // 替换连续的斜杠并移除末尾的斜杠
  const normalizedPath = path.replace(/[\\/]+/g, '/').replace(/\/$/, '');
  return normalizedPath.split('/').pop();
}

class ArticleImporter {
  editor = null;
  markdownContent = null;
  markdownImgUploadTable = null;

  constructor() {
    this.editor = null;
  }

  init() {
    this.editor = this.getEditor();
    const buttonContainer = this.createImportButton();
    this.injectImportButton(buttonContainer)
  }

  createImportButton() {
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'import-button-container';

    const importMarkdownButton = document.createElement('button');
    importMarkdownButton.textContent = '导入 Markdown';
    importMarkdownButton.id = 'import-markdown-button';
    importMarkdownButton.className = 'action-button';
    importMarkdownButton.addEventListener('click', () => {
      this.importMarkdown();
    });

    buttonContainer.appendChild(importMarkdownButton);

    const syncImgButton = document.createElement('button');
    syncImgButton.textContent = '同步 Markdown 图片（选择图片目录）';
    syncImgButton.id = 'sync-img-button';
    syncImgButton.className = 'action-button';
    syncImgButton.addEventListener('click', async () => {
      const syncResult = await this.syncMarkdownImgs();
      this.markdownContent = syncResult.processedContent;
      this.markdownImgUploadTable = syncResult.imgTable;
      const injectContent = this.getEditorInjectContent();
      this.injectContentIntoEditor(injectContent);
    });
    buttonContainer.appendChild(syncImgButton);
    return buttonContainer;
  }

  showStatus(message, type = 'normal', autoCloseTime = 2000) {
    const statusElement = document.createElement('div');
    statusElement.className = 'markdown-import-status';
    statusElement.textContent = message;
    if (type === 'success') {
      statusElement.style.backgroundColor = '#dff0d8';
      statusElement.style.color = '#3c763d';
    } else if (type === 'error') {
      statusElement.style.backgroundColor = '#f2dede';
      statusElement.style.color = '#a94442';
    } else {
      // normal
      statusElement.style.backgroundColor = '#f2f2f2';
      statusElement.style.color = '#333';
    }
    document.body.appendChild(statusElement);

    if (autoCloseTime) {
      setTimeout(() => {
        statusElement.style.display = 'none';
        statusElement.remove();
      }, autoCloseTime);
    }

    return statusElement;
  }

  importMarkdown() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.md,.markdown';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // 添加文件选择事件处理
    fileInput.addEventListener('change', async (e) => {
      fileInput.remove();
      const file = e.target.files[0];
      if (!file) return;

      try {
        this.markdownContent = await file.text();
        const injectContent = this.getEditorInjectContent();
        this.injectContentIntoEditor(injectContent);

        this.showStatus('文章导入成功！', 'success');
      } catch (error) {
        console.error('导入失败:', error);
        this.showStatus('导入失败：' + error.message, 'error');
      }
    });

    fileInput.click();
  }

  async syncMarkdownImgs() {
    if (!this.markdownContent) {
      this.showStatus('请先导入 Markdown 文件', 'error');
      return;
    }

    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    let match;
    let processedContent = this.markdownContent;

    const dirHandle = await window.showDirectoryPicker({
      "mode": "read",
    });

    // 递归遍历目录，收集所有文件路径
    const traverseDirectory = async (dirHandle) => {
      const files = {};
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          files[entry.name] = entry
        } else if (entry.kind === 'directory') {
          const subFiles = await traverseDirectory(entry);
          files = { ...files, ...subFiles }
        }
      }
      return files;
    }
    // 使用示例
    const allFiles = await traverseDirectory(dirHandle);
    console.log('所有文件路径:', allFiles);

    const statusElement = this.showStatus('开始同步图片...', 'normal', 0);
    const replaceTable = {}
    while ((match = imageRegex.exec(processedContent)) !== null) {
      const imagePath = match[1];
      try {
        const imgFileName = getFileName(imagePath);

        if (allFiles[imgFileName]) {
          const fileHandle = allFiles[imgFileName]
          const file = await fileHandle.getFile();
          const newImageUrl = await this.uploadImage(file)
          replaceTable[match[0]] = this.getMarkdownImgReplaceContent(newImageUrl, match[0]);
          if (newImageUrl) {
            replaceTable[match[0]] = this.getMarkdownImgReplaceContent(newImageUrl, match[0]);
          } else if (newImageUrl !== null) {
            this.showStatus('上传失败:' + match[0], 'error');
          }
        }
      } catch (error) {
        this.showStatus('处理图片失败:' + imagePath, 'error');
      }
    }

    Object.keys(replaceTable).forEach(key => {
      processedContent = processedContent.replaceAll(key, replaceTable[key]);
      console.log(key, ' ', replaceTable[key]);
    });

    statusElement.remove();
    this.showStatus('图片同步完成', 'success');

    return {
      processedContent,
      imgTable: replaceTable
    };
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
    return marked.parse(this.markdownContent);
  }

  // 子类实现，上传图片
  uploadImage(file) {
    throw new Error('子类必须实现 uploadImage 方法');
  }

  // 子类实现，获取 Markdown 图片替换内容
  getMarkdownImgReplaceContent(newImageUrl, imgContent) {
    throw new Error('子类必须实现 getMarkdownImgReplaceContent 方法');
  }

  // 子类实现，获取编辑器
  getEditor() {
    throw new Error('子类必须实现 getEditor 方法');
  }

  // 子类实现，注入导入按钮
  injectImportButton(buttonContainer) {
    throw new Error('子类必须实现 injectImportButton 方法');
  }

  // 子类实现，注入内容到编辑器
  injectContentIntoEditor(injectContent) {
    throw new Error('子类必须实现 injectContentIntoEditor 方法');
  }
}