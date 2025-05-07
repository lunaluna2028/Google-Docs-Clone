import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import type { Editor } from '@tiptap/core'

// --- 관리자/사용지 ---
import { useAdmin } from "@/context/AdminContext";

// --- Server ---
import { io, Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';

// --- Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { TaskItem } from "@tiptap/extension-task-item"
import { TaskList } from "@tiptap/extension-task-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Underline } from "@tiptap/extension-underline"

import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension"
import { Selection } from "@/components/tiptap-extension/selection-extension"

// --- Tool Bar ---
import {
  Toolbar
} from "@/components/tiptap-ui-primitive/toolbar"
import { MainToolbarContent } from "@/components/MainToolbarContent"

// --- Tiptap Node ---
import ImageResize from 'tiptap-extension-resize-image';
import { Image } from "@tiptap/extension-image"
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"


// --- Tiptap UI ---
// --- Tables ---
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { TableBubbleMenu } from "@/components/tiptap-extension/my_table-extension/TableBubbleMenu"


// --- input container ---
import { InputContainer } from "@/components/tiptap-node/input-container/input-container-extension" // 경로는 실제 위치에 따라 조정


// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/styles/simple-editor.scss"




export function TestEditor() {
  const { isAdmin } = useAdmin();
  const [socket, setSocket] = React.useState<Socket>() ;
  const { id: documentId } = useParams() ;
  const pagesRef = React.useRef<HTMLDivElement>(null);
  const PAGE_HEIGHT = 1000; // 페이지 높이 (px 단위)


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
      InputContainer,
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
      // TrailingNode,
      Link.configure({ openOnClick: false }),      
    ],    
  })
  // 사용자가 에디터를 수정할 때마다 update 이벤트 발생
 // 문서 내용을 JSON으로 변환하여 서버에 전송
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


  // 타 사용자로부터의 변경 사항을 수신하여 로컬 에디터에 적용
  React.useEffect(() => {
    if (!socket || !editor) return;
  
    const handler = (newDoc: any) => {
      // 기본 : setContent(newDoc, false); 
      editor?.commands.setContent(newDoc, false); // false: history stack에 기록하지 않음
    };
  
    socket.on("receive-changes", handler);
  
    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, editor]);
  

  // 서버에 문서를 요청하고 서버로부터 한 번만 문서를 수신
  React.useEffect(() => {
    if (!socket || !editor) return;
  
    socket.once("load-document", (doc: any) => {
      editor.commands.setContent(doc); // Tiptap JSON 포맷이어야 함
      editor.setEditable(true);        // 편집 가능하게 설정
    });
  
    const documentName = localStorage.getItem(`document-name-for-${documentId}`) || "Untitled";
    socket.emit("get-document", { documentId, documentName });
  
  }, [socket, editor, documentId]);


  // 자동 저장
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


  React.useEffect(() => {
    if (!editor || !pagesRef.current) return;
  
    const adjustNumberOfPages = () => {
      const content = document.querySelector(".ProseMirror");
      if (!content) return;
  
      const height = content.scrollHeight;
      const neededPages = Math.floor(height / PAGE_HEIGHT) + 1;
      const currentPages = pagesRef.current!.querySelectorAll(".page").length;
  
      if (neededPages > currentPages) {
        for (let i = currentPages; i < neededPages; i++) {
          const page = document.createElement("div");
          page.className = "page";
          pagesRef.current!.appendChild(page);
  
          const breaker = document.createElement("div");
          breaker.className = "breaker";
          pagesRef.current!.appendChild(breaker);
        }
      } else if (neededPages < currentPages) {
        for (let i = currentPages - 1; i >= neededPages; i--) {
          const lastPage = pagesRef.current!.querySelector(".page:last-child");
          const lastBreaker = pagesRef.current!.querySelector(".breaker:last-child");
          if (lastPage) pagesRef.current!.removeChild(lastPage);
          if (lastBreaker) pagesRef.current!.removeChild(lastBreaker);
        }
      }
    };
  
    editor.on("update", adjustNumberOfPages);
    window.addEventListener("resize", adjustNumberOfPages);
  
    // 최초 실행
    adjustNumberOfPages();
  
    return () => {
      editor.off("update", adjustNumberOfPages);
      window.removeEventListener("resize", adjustNumberOfPages);
    };
  }, [editor]);
  
  
  
  return (
    <EditorContext.Provider value={{ editor }}>
      {/* 툴바는 항상 */}
      <Toolbar className="custom-toolbar">
        <MainToolbarContent editor={editor} />
      </Toolbar>

      {/* 테이블 전용 버블 메뉴 */}
      {editor && <TableBubbleMenu editor={editor} />}


      <div className="container">
        <div id="pages" ref={pagesRef} />
        <EditorContent editor={editor} role="presentation" />
      {/* {editor && <PaginatedRenderer editor={editor} />} */}
    </div>
  </EditorContext.Provider>
  )
}



// return (
//   <EditorContext.Provider value={{ editor }}>
//   {/* 툴바는 항상 */}
//   <Toolbar className="custom-toolbar">
//     <MainToolbarContent editor={editor} />
//   </Toolbar>

//   {/* 테이블 전용 버블 메뉴 */}
//   {editor && <TableBubbleMenu editor={editor} />}

//   {/* 전체 에디터 래퍼: read-only 모드 제어 */}
//   <div
//     className={`content-wrapper simple-editor-content ${
//       isAdmin ? "" : "read-only"
//     }`}
//   >
//     <EditorContent editor={editor} role="presentation" />
//   </div>
// </EditorContext.Provider>
// )


