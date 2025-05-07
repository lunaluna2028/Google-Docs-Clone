// PaginatedRenderer.tsx
import React, { useEffect, useRef, useState } from 'react'
import { EditorContent } from '@tiptap/react'
import type { Editor } from '@tiptap/core'
import './PaginatedRenderer.scss'
import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_GAP,
  HORIZONTAL_BLANK
} from './page-constants';




interface Props { editor: Editor }




export const PaginatedRenderer: React.FC<Props> = ({ editor }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!containerRef.current) return
  
      const spans = containerRef.current.querySelectorAll('p > span');
  
      console.log(`🔍 총 ${spans.length}개의 span 요소를 찾음`);
  
      spans.forEach((span, i) => {
        const spanElement = span as HTMLElement;
  ``
        // 이미 marginTop이 있으면 중복 적용 방지
        if (!spanElement.style.marginTop) {
          spanElement.style.marginTop = '40px'; // 테스트용 마진값
          console.log(`✅ span[${i}]에 marginTop 40px 적용`);
        }
      });
    }, 300);
  
    return () => clearTimeout(timer);
  }, [editor]);
  
  

  return (
    <div className="paginated-editor-wrapper">
      {/* 1) 페이지 배경들 (pointer-events: none 으로 이벤트 무시) */}
      {Array.from({ length: pageCount }).map((_, i) => (
  <div
    key={i}
    className="page-bg"
    style={{
      top: i * (PAGE_HEIGHT + PAGE_GAP),
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      //marginBottom: `${PAGE_GAP}px`, // 추가!
    }}
  />
))}

      {/* 2) 실제 에디터 콘텐츠 (한 번만 렌더) */}
      <div className="paginated-inner" ref={containerRef} 
      style={{ paddingLeft: HORIZONTAL_BLANK, paddingRight: HORIZONTAL_BLANK }}>
  <EditorContent editor={editor} />
  {/* 페이지 중간에 삽입되는 가짜 interrupt 박스 */}
</div>
    </div>
  )
}
