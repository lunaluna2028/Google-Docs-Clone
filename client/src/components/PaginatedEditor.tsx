import React, { useEffect, useRef, useState } from "react"
import { Editor } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit"
import { EditorContent } from "@tiptap/react"  // 기본 Tiptap EditorContent

// 1. 에디터 인스턴스 생성 함수
function createEditorInstance(initialContent: any) {
  return new Editor({
    extensions: [StarterKit],
    content: initialContent,
  })
}

// 2. 이진 탐색으로 overflow 기준 포지션 찾기
function findOverflowPosition(
  editor: Editor,
  container: HTMLElement,
  maxHeight: number
): number {
  const original = editor.getJSON()
  const { doc } = editor.state
  const docSize = doc.content.size

  let low = 1
  let high = docSize
  let best = docSize

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const fragment = doc.slice(0, mid).content.toJSON()

    editor.commands.setContent(fragment, false)

    if (container.scrollHeight > maxHeight) {
      high = mid - 1
    } else {
      best = mid
      low = mid + 1
    }
  }

  editor.commands.setContent(original, false)
  return best
}

// 3. 단일 페이지 컴포넌트
interface PageProps {
  editor: Editor
  pageIndex: number
  onOverflow: (pageIndex: number, splitPos: number) => void
}

const Page: React.FC<PageProps> = ({ editor, pageIndex, onOverflow }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const MAX_HEIGHT = 112

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    requestAnimationFrame(() => {
      const scrollHeight = el.scrollHeight
      console.log(`[Page ${pageIndex}] scrollHeight: ${scrollHeight}px`)

      if (scrollHeight > MAX_HEIGHT) {
        const splitPos = findOverflowPosition(editor, el, MAX_HEIGHT)
        console.log(`→ Overflow at pos ${splitPos}`)
        onOverflow(pageIndex, splitPos)
      }
    })
  }, [editor.state.doc])

  return (
    <div
      ref={containerRef}
      style={{
        maxHeight: `${MAX_HEIGHT}px`,
        overflow: "hidden",
        marginBottom: "20px",
        border: "1px solid #ccc",
        padding: "16px",
        backgroundColor: "white",
      }}
    >
      <EditorContent editor={editor} />
    </div>
  )
}

// 4. 전체 PaginatedEditor 컴포넌트
export const PaginatedEditor: React.FC = () => {
  const [pages, setPages] = useState<Editor[]>([
    createEditorInstance("<p>내용을 입력하세요. 줄바꿈을 여러 번 해보세요.</p>"),
  ])

  const handleOverflow = (pageIndex: number, splitPos: number) => {
    setPages(prev => {
      const newPages = [...prev]
      const currentEditor = newPages[pageIndex]
      const docSize = currentEditor.state.doc.content.size

      const overflowSlice = currentEditor.state.doc.slice(splitPos, docSize)
      const newEditor = createEditorInstance(overflowSlice.content.toJSON())

      currentEditor.commands.deleteRange({ from: splitPos, to: docSize })
      newPages.splice(pageIndex + 1, 0, newEditor)

      return newPages
    })
  }

  return (
    <div
      style={{
        maxWidth: "816px",
        margin: "0 auto",
        padding: "2rem",
        background: "#f9f9f9",
      }}
    >
      {pages.map((editor, idx) => (
        <Page
          key={idx}
          editor={editor}
          pageIndex={idx}
          onOverflow={handleOverflow}
        />
      ))}
    </div>
  )
}
