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

      // 스타일 정의 (A4 기준)
      dom.style.width = "210mm";
      dom.style.height = "297mm";
      dom.style.padding = "25.4mm"; // 1 inch
      dom.style.boxSizing = "border-box";
      dom.style.background = "white";
      dom.style.border = "1px solid #ccc";
      dom.style.margin = "2rem auto";
      dom.style.overflow = "hidden";
      dom.style.position = "relative";

      const contentDOM = document.createElement("div");
      dom.appendChild(contentDOM);

      return {
        dom,
        contentDOM,
      };
    };
  },
});
