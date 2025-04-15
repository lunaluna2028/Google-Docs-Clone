// src/constants.ts

export const SAVE_INTERVAL_MS = 5000;

// isAdmin 여부에 따라 동적으로 툴바 옵션 생성
export function getToolbarOptions(isAdmin: boolean) {
  const baseToolbar = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ['link', 'image', 'formula'],
  ];

  const customTools = isAdmin
    ? [['table-better', 'input-container']] // 관리자일 때만
    : [['table-better']];            // 일반 유저는 table만

  return [...baseToolbar, ...customTools, ['clean']];
}
