import type { Editor } from '@tiptap/core';

export interface OverflowHandler {
  /** 
   * 이 핸들러가 처리할 수 있는 노드인지 검사 
   *   예: ParagraphHandler 에서는 node.type.name === 'paragraph' 인지 리턴 
   */
  canHandle: (overflowNode: HTMLElement, editor: Editor) => boolean;

  /**
   * 실제 분할·이관 로직을 수행 
   *   overflowNode 는 페이지 컨테이너에서 넘친 첫 블록 요소
   */
  handle: (editor: Editor, overflowNode: HTMLElement) => void;
}
