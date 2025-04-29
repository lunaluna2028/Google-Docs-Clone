// src/components/tiptap-extension/page-extension/PageNode.ts
import { Node, mergeAttributes } from "@tiptap/core";

export const PageNode = Node.create({
  name: "page",
  group: "block",
  content: "block+",
  defining: true,
  isolating: true,

  parseHTML() {
    return [
      {
        tag: "div[data-page]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-page": "true", class: "page-node" }),
      0,
    ];
  },

  addNodeView() {
    return () => {
      const dom = document.createElement("div");
      dom.setAttribute("data-page", "true");
      dom.classList.add("page-node");
  
      // 스타일 정의
      Object.assign(dom.style, {
        width: "210mm",
        height: "297mm",
        padding: "25.4mm",
        background: "white",
        border: "1px solid #ccc",
        margin: "2rem auto",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
      });
  
      const contentDOM = document.createElement("div");
      contentDOM.classList.add("page-content");
      Object.assign(contentDOM.style, {
        outline: "none",
      });
  
      dom.appendChild(contentDOM);
  
      return {
        dom,
        contentDOM, // ← 이게 있어야 Tiptap이 내부에 텍스트 넣어줍니다!
      };
    };
  },
});
