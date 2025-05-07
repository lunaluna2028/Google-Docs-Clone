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
    if (!containerRef.current) return

    // 높이 추적
    const calc = () => {
      const h = containerRef.current!.scrollHeight 
      

      setPageCount(Math.ceil(h / PAGE_HEIGHT))
    }
    calc()
    
    
    // DOM 요소 크기 변화 추적 
    const obs = new ResizeObserver(calc)
    obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [editor])

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
      //marginBottom: ${PAGE_GAP}px, // 추가!
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