// src/components/pagination/handlers/ParagraphHandler.ts

import type { Editor } from '@tiptap/core';
import { OverflowHandler } from './OverflowHandler';
import { getLastPageContent, addPage } from '../pagination-utils';

export class ParagraphHandler implements OverflowHandler {
  canHandle(overflowNode: HTMLElement, editor: Editor): boolean {
    return overflowNode.nodeName.toLowerCase() === 'p';
  }

  handle(editor: Editor, overflowNode: HTMLElement): void {
    const pos = editor.view.posAtDOM(overflowNode, 0);
    console.log(pos);
    if (typeof pos !== 'number') return;

    this.moveParagraphToNewPage(editor, pos);
  }

  private moveParagraphToNewPage(editor: Editor, paraPos: number) {
    // 1) 먼저 빈 페이지 하나를 추가
    addPage(editor);

    // 2) 방금 추가된 페이지 바로 앞 위치 계산
    //    addPage는 chain().run()까지 실행하므로 editor.state가 갱신된 상태입니다.
    const endPos = editor.state.doc.content.size - 2; // 새로 추가된 페이지의 시작점

    // 3) paragraphNode 전체를 JSON 형태로 꺼내기
    const paragraphJSON = editor.state.doc.nodeAt(paraPos)?.toJSON();
    if (!paragraphJSON) return;

    // 4) 한 번의 chain에서 삭제 → 삽입 동작
    editor
      .chain()
      .focus()
      .deleteRange({ from: paraPos, to: paraPos + (editor.state.doc.nodeAt(paraPos)?.nodeSize || 0) })
      .insertContentAt(endPos, paragraphJSON)
      .run();
  }
}
