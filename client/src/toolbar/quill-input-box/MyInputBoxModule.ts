import Quill from 'quill';

interface ToolbarLike {
  addHandler: (name: string, callback: () => void) => void;
}

export default class MyInputBoxModule {
  quill: Quill;

  constructor(quill: Quill, options: any) {
    this.quill = quill;

    const toolbar = quill.getModule('toolbar') as unknown as ToolbarLike;

    if (toolbar && typeof toolbar.addHandler === 'function') {
      toolbar.addHandler('input-container', this.insertInputContainer.bind(this));
    }
  }
  insertInputContainer() {
    const range = this.quill.getSelection();
    if (range) {
      // input-container 삽입
      this.quill.insertEmbed(range.index, 'input-container', '', Quill.sources.USER);
  
      // +1 위치에 엔터 넣기 (줄 바꿈을 유도하거나 아래 요소 삽입 대비)
      this.quill.insertText(range.index + 1, '\n', Quill.sources.SILENT);
      this.quill.setSelection(range.index + 2, Quill.sources.SILENT); // 커서 이동
    }
  }
  
}
