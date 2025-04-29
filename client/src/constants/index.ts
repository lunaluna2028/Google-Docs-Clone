// src/constants.ts

export const SAVE_INTERVAL_MS = 5000;

export const PAGE_WIDTH_MM = 210; // A4 가로
export const PAGE_HEIGHT_MM = 297; // A4 세로
export const PAGE_PADDING_MM = 25.4; // 1인치
export const MM_TO_PX = 3.77953; // mm → px 변환계수

export const PAGE_AVAILABLE_HEIGHT_PX = (PAGE_HEIGHT_MM - PAGE_PADDING_MM * 2) * MM_TO_PX;