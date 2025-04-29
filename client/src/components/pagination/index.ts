// src/components/pagination/index.ts
import type { Editor } from '@tiptap/core'
import { findOverflowingBlock, getLastPageContent } from './pagination-utils'
import { OverflowHandler } from './handlers/OverflowHandler'
import { ParagraphHandler } from './handlers/ParagraphHandler'
//import { TableHandler } from './handlers/TableHandler'
//import { DefaultHandler } from './handlers/DefaultHandler'

// 우선순위대로 등록
export const overflowHandlers: OverflowHandler[] = [
  new ParagraphHandler(),
  //new TableHandler(),
  //new DefaultHandler(),
]

/**
 * 마지막 페이지 오버플로우가 발생했을 때
 * 등록된 핸들러를 순회하며 .canHandle → .handle 실행
 */
export function handleOverflow(editor: Editor) {
    const container = getLastPageContent();
    if (!container){
        return;
    }


        
        
  
    const overflowNode = findOverflowingBlock(container);
    if (!overflowNode) { 
        return;
    }
    for (const handler of overflowHandlers) {
      if (handler.canHandle(overflowNode, editor)) {
        handler.handle(editor, overflowNode);
        break;
      }
    }
  }