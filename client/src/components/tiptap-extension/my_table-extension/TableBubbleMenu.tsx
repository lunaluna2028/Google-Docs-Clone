import * as React from "react"
import './table-bubble-menu.scss'
import { BubbleMenu } from "@tiptap/react"
import { CellSelection } from "@tiptap/pm/tables"
import type { Editor } from "@tiptap/core"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/tiptap-ui-primitive/popover"
import { Button } from "@/components/tiptap-ui-primitive/button"

export function TableBubbleMenu({ editor }: { editor: Editor }) {
  const isCellSelected = () => {
    return editor?.state?.selection instanceof CellSelection
  }

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="table-bubble-menu"
      shouldShow={isCellSelected}
      tippyOptions={{ duration: 100 }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button data-style="ghost">🧰 Table Options</Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-4 rounded-lg shadow-md bg-white text-sm grid grid-cols-2 gap-4 z-50">
          <div>
            <div className="font-semibold mb-1">Column</div>
            <button onClick={() => editor.chain().focus().addColumnBefore().run()} className="w-full hover:bg-gray-100 rounded px-2 py-1 text-left">Add Before</button>
            <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="w-full hover:bg-gray-100 rounded px-2 py-1 text-left">Add After</button>
            <button onClick={() => editor.chain().focus().deleteColumn().run()} className="w-full hover:bg-red-100 rounded px-2 py-1 text-left">Delete</button>
          </div>
          <div>
            <div className="font-semibold mb-1">Row</div>
            <button onClick={() => editor.chain().focus().addRowBefore().run()} className="w-full hover:bg-gray-100 rounded px-2 py-1 text-left">Add Before</button>
            <button onClick={() => editor.chain().focus().addRowAfter().run()} className="w-full hover:bg-gray-100 rounded px-2 py-1 text-left">Add After</button>
            <button onClick={() => editor.chain().focus().deleteRow().run()} className="w-full hover:bg-red-100 rounded px-2 py-1 text-left">Delete</button>
          </div>
          <div>
            <div className="font-semibold mb-1">Cell</div>
            <button onClick={() => editor.chain().focus().mergeCells().run()} className="w-full hover:bg-gray-100 rounded px-2 py-1 text-left">Merge</button>
            <button onClick={() => editor.chain().focus().splitCell().run()} className="w-full hover:bg-gray-100 rounded px-2 py-1 text-left">Split</button>
          </div>
          <div>
            <div className="font-semibold mb-1">Header</div>
            <button onClick={() => editor.chain().focus().toggleHeaderRow().run()} className="w-full hover:bg-gray-100 rounded px-2 py-1 text-left">Toggle Header Row</button>
            <button onClick={() => editor.chain().focus().toggleHeaderColumn().run()} className="w-full hover:bg-gray-100 rounded px-2 py-1 text-left">Toggle Header Col</button>
          </div>
        </PopoverContent>
      </Popover>
    </BubbleMenu>
  )
}
