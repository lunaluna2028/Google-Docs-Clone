import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import type { Editor } from '@tiptap/core'

// --- Server ---
import { io, Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';

// --- Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem } from "@tiptap/extension-task-item"
import { TaskList } from "@tiptap/extension-task-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Underline } from "@tiptap/extension-underline"

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension"
import { Selection } from "@/components/tiptap-extension/selection-extension"
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import ImageResize from 'tiptap-extension-resize-image';
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"


// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { NodeButton } from "@/components/tiptap-ui/node-button"
import {
  HighlightPopover,
} from "@/components/tiptap-ui/highlight-popover"
import {
  LinkPopover,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Tables ---
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/styles/simple-editor.scss"


const MainToolbarContent = ({ editor }: { editor: Editor | null }) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
        <NodeButton type="codeBlock" />
        <NodeButton type="blockquote" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        <HighlightPopover />
        <LinkPopover />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <Button
          onClick={() =>
            editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()
          }
        >
          Insert Table
        </Button>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

    </>
  )
}

export function TestEditor() {
  const [socket, setSocket] = React.useState<Socket>() ;
  const { id: documentId } = useParams() ;
  React.useEffect(() => {
          const skt = io(import.meta.env.VITE_SERVER_URL) ;
          setSocket(skt) ;
          return () => {
              skt.disconnect() ;
          }
      }, [])

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
    extensions: [
      StarterKit,
      ImageResize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
    ],
    
  })

  React.useEffect(() => {
    if (!socket || !editor) return;
  
    const handler = () => {
      const json = editor.getJSON();
      socket.emit("send-changes", json); // delta가 아닌 JSON 문서 전체 전송
    };
  
    editor.on("update", handler);
  
    return () => {
      editor.off("update", handler);
    };
  }, [socket, editor]);

  React.useEffect(() => {
    if (!socket || !editor) return;
  
    const handler = (newDoc: any) => {
      editor?.commands.setContent(newDoc, false); // false: history stack에 기록하지 않음
    };
  
    socket.on("receive-changes", handler);
  
    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, editor]);
  
  React.useEffect(() => {
    if (!socket || !editor) return;
  
    socket.once("load-document", (doc: any) => {
      editor.commands.setContent(doc); // Tiptap JSON 포맷이어야 함
      editor.setEditable(true);        // 편집 가능하게 설정
    });
  
    const documentName = localStorage.getItem(`document-name-for-${documentId}`) || "Untitled";
    socket.emit("get-document", { documentId, documentName });
  
  }, [socket, editor, documentId]);
  React.useEffect(() => {
    if (!socket || !editor) return;
  
    const interval = setInterval(() => {
      const json = editor.getJSON();
      socket.emit("save-document", json);
    }, 5000);
  
    return () => {
      clearInterval(interval);
      localStorage.clear(); // 저장된 문서명 등 제거
    };
  }, [socket, editor]);

  
  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar>
        <MainToolbarContent editor={editor} />
      </Toolbar>
      <div className="content-wrapper">
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </div>
    </EditorContext.Provider>
  )
}
