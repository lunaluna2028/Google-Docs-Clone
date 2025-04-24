// src/components/tiptap-extension/paragraph-extension/paragraph-extension.ts
import { Paragraph } from '@tiptap/extension-paragraph'
import { ReactNodeViewRenderer } from '@tiptap/react'
import ParagraphSplitView from './ParagraphSplitView'

const CustomParagraph = Paragraph.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ParagraphSplitView)
  },
})

export default CustomParagraph
