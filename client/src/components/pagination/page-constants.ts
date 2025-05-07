// components/pagination/page-constants.ts

// 단위: px
export const PAGE_HEIGHT = 1122;                     // A4 세로 길이
export const PAGE_WIDTH = 794;                       // A4 가로 길이
export const PAGE_GAP = 40;                          // 페이지 간 시각적 간격

export const UPPER_VERTICAL_BLANK = 80;              // 페이지 상단 여백
export const LOWER_VERTICAL_BLANK = 80;              // 페이지 하단 여백
export const HORIZONTAL_BLANK = 20 * 3.78;            // 20mm → px (좌우 여백)

export const MAX_CONTENT_HEIGHT_PER_PAGE =
  PAGE_HEIGHT - UPPER_VERTICAL_BLANK - LOWER_VERTICAL_BLANK;
