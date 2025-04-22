// InputContainer.tsx
import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import { useAdmin } from "@/context/AdminContext"
import "./input-container.scss"

export const InputContainer = Node.create({
  name: "inputContainer",
  group: "block",
  content: "block+",
  isolating: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      id: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='input-container']",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "input-container",
        class: "input-container",
      }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(InputContainerView)
  },
})

// ✅ NodeView React 컴포넌트 정의 (tsx 파일에서)
const InputContainerView = (props: any) => {
  const { isAdmin } = useAdmin()

  return (
    <NodeViewWrapper
      className="input-container"
      data-type="input-container"
    >
      <div
        className="input-inner"
        contentEditable={true} // ✅ 문서 전체가 editable: false여도 이 부분은 편집 가능
        suppressContentEditableWarning
      >
        <NodeViewContent as="div" />
      </div>
    </NodeViewWrapper>
  )
}
