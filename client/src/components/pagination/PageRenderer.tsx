// src/components/tiptap-extension/pagination/PaginatedRenderer.tsx
import React from 'react'
import { EditorContent } from '@tiptap/react'
import type { Editor } from '@tiptap/core'


interface PaginatedRendererProps {
  editor: Editor
}

const PaginatedRenderer: React.FC<PaginatedRendererProps> = ({ editor }) => {
  const doc = editor.state.doc
  const pageNodes = []

  // 1. 문서의 각 자식을 순회하며 page 노드를 찾음
  doc.forEach((node, offset) => {
    if (node.type.name === 'page') {
      pageNodes.push({ node, offset })
    }
  })

  return (
    <div className="paginated-editor-container">
      {pageNodes.map(({ node, offset }, index) => (
        <div
          key={index}
          data-page-index={index}
          className="page-wrapper"
          style={{
            width: '210mm',
            height: '297mm',
            margin: '0 auto 40px',
            padding: '25.4mm',
            boxSizing: 'border-box',
            background: 'white',
            border: '1px solid #ccc',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* 이 영역에 각 페이지 내용이 들어가야 하는데... 
              EditorContent는 전체 문서를 보여주므로 여기선 별도로 컨트롤할 수 없음.
              실제로는 커스텀 NodeView 또는 EditorContent 재정의가 필요함 */}
          <EditorContent editor={editor} />
        </div>
      ))}
    </div>
  )
}

export default PaginatedRenderer
