// src/components/tiptap-extension/inline-input-node/InlineInputNode.tsx
import { Node, mergeAttributes } from "@tiptap/core"
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
} from "@tiptap/react"
import { useAdmin } from "@/context/AdminContext"
import "./inline-input-node.scss"

export const InlineInputNode = Node.create({
  name: "inlineInput",
  inline: true,
  group: "inline",
  content: "text*",
  atom: false,

  addAttributes() {
    return {
      placeholder: { default: "입력 가이드" },
    }
  },

  parseHTML() {
    return [{ tag: "span[data-type='inline-input']" }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-type": "inline-input",
        class: "inline-input-node",
        contenteditable: "false", // wrapper 자체는 편집 불가
      }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(InlineInputView)
  },
})

const InlineInputView = (props: any) => {
  const { isAdmin } = useAdmin()
  const { placeholder } = props.node.attrs

  return (
    <NodeViewWrapper
      as="span"
      className="inline-input-node"
      data-type="inline-input"
      contentEditable={false}      // wrapper는 편집 불가
    >
      <span
        className={`inline-input-inner ${isAdmin ? "admin" : "user"}`}
        contentEditable={true}     // 내부는 항상 편집 가능
        suppressContentEditableWarning
        data-placeholder={placeholder}
      >
        <NodeViewContent as="span" />
      </span>
    </NodeViewWrapper>
  )
}
