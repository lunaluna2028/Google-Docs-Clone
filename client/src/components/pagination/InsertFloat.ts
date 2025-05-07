import { UPPER_VERTICAL_BLANK, LOWER_VERTICAL_BLANK, PAGE_HEIGHT, PAGE_GAP } from './page-constants'

interface BlockInfo {
  node: any
  height: number
  cumulativeHeight: number
  insertMarginTop?: number
}

export const InsertFloat = (contentJson: any): BlockInfo[] => {
  const contents = contentJson.content || []
  const blocks: BlockInfo[] = []

  // 1단계: 블록별 높이 측정 (이건 실제 DOM에서 측정된 값을 넣는다고 가정)
  const estimatedHeights = estimateHeightsFromDOM()  // 예시 함수, 실제 높이 측정 방식 필요

  let cumulativeHeight = 0

  contents.forEach((block, index) => {
    const height = estimatedHeights[index] || 0
    let insertMarginTop = 0

    // 첫 번째 블록이면 UVB 반영
    if (index === 0) {
      cumulativeHeight += UPPER_VERTICAL_BLANK
      insertMarginTop = UPPER_VERTICAL_BLANK
    }

    // 페이지 경계 넘는지 체크
    if (cumulativeHeight + height > PAGE_HEIGHT) {
      // 페이지 넘김 발생
      insertMarginTop = UPPER_VERTICAL_BLANK + LOWER_VERTICAL_BLANK + PAGE_GAP
      cumulativeHeight = insertMarginTop  // 새로운 페이지에서 다시 누적 시작
    }

    // 누적 업데이트
    blocks.push({
      node: block,
      height,
      cumulativeHeight,
      insertMarginTop
    })

    cumulativeHeight += height
  })

  return blocks
}
