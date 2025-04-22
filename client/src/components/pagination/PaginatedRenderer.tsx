export function logTotalContentHeight() {
    const prose = document.querySelector(".ProseMirror")
    if (!prose) {
      console.warn("ProseMirror DOM not found")
      return
    }
  
    const blocks = Array.from(prose.children) as HTMLElement[]
    let totalHeight = 0
  
    blocks.forEach(block => {
      totalHeight += block.getBoundingClientRect().height
    })
  
    console.log(`총 콘텐츠 높이: ${totalHeight.toFixed(1)}px`)
  }