import type { Editor } from '@tiptap/core'


export function sanitizeDoc(doc: any) {
    // 만약 doc 안에 page가 이미 있으면 그대로 둠
    if (doc?.content?.[0]?.type === 'page') {
      return doc;
    }
  
    // 없으면 page로 감싸서 리턴
    return {
      type: 'doc',
      content: [
        {
          type: 'page',
          content: doc.content ?? [], // doc 자체에 content가 있으면 유지
        },
      ],
    };
  }


  /**
 * .page-node:last-child .page-content 요소를 반환합니다.
 */
export function getLastPageContent(): HTMLElement | null {
    return document.querySelector('.page-node:last-child .page-content');
  }
  
  /**
   * 페이지 컨테이너 안에서 가장 먼저 페이지를 넘어간 블록 요소를 찾습니다.
   * (예: <p>, <table>, <pre>, <img> 등 블록 요소)
   */
  export function findOverflowingBlock(container: HTMLElement): HTMLElement | null {
    const children = Array.from(container.children) as HTMLElement[];
  
    if (container.scrollHeight > container.clientHeight) {
      for (const child of children) {
        const rect = child.getBoundingClientRect();
        if (rect.bottom > container.getBoundingClientRect().bottom) {
          return child;
        }
      }
  
      // 넘친 블록을 못 찾았더라도, container 넘쳤으면 마지막 블록을 넘긴다
      if (children.length > 0) {
        return children[children.length - 1];
      }
    }
  
    return null;
  }
  

  // src/components/pagination/pagination-utils.ts

/**
 * 새 빈 페이지를 문서의 마지막에 추가합니다.
 * 
 * @param editor - @tiptap/core 의 Editor 인스턴스
 */
export function addPage(editor: Editor) {
    if (!editor) return
    const insertPos = editor.state.doc.content.size
  
    editor
      .chain()
      .focus()
      .insertContentAt(insertPos, {
        type: 'page',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      })
      // 새 페이지의 단락 바로 앞(= insertPos+2)으로 커서 이동
      .setTextSelection(insertPos + 2)
      .run()
  }
