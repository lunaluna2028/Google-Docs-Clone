import type { JSONContent } from '@tiptap/core'

export function applyTopPaddingToFirstParagraphInPages(json: JSONContent): JSONContent {
  if (!json.content) return json;

  const PAGE_HEIGHT = 1122;
  const PAGE_GAP = 40;
  const pageWithPadding = 20 * 3.78; // 20mm → px 변환 (1mm ≈ 3.78px)

  const newContent = json.content.map((node, index) => {
    if (node.type === 'paragraph') {
      const approxTop = estimateNodeOffset(index, PAGE_HEIGHT + PAGE_GAP); // 약식 추정
      const isFirstInPage = Math.floor(approxTop / (PAGE_HEIGHT + PAGE_GAP)) !==
                            Math.floor((approxTop - 20) / (PAGE_HEIGHT + PAGE_GAP));
      if (isFirstInPage) {
        return {
          ...node,
          attrs: {
            ...(node.attrs || {}),
            style: 'margin-top: 80px;' // 예시 값
          }
        };
      }
    }
    return node;
  });

  return { ...json, content: newContent };
}

function estimateNodeOffset(index: number, lineHeight: number): number {
  return index * lineHeight; // 매우 간단한 예시 (실제는 렌더링 기준 추정 필요)
}