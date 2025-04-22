// 페이지 분할 및 유틸 함수 모음

/**
 * 주어진 DOM 요소 배열을 pageHeight 기준으로 분할하여
 * 각 페이지별 HTML 문자열 배열로 반환합니다.
 */
export function splitTable(
  tableEl: HTMLElement,
  pageHeight: number
): string[][] {
  const header = tableEl.querySelector("thead")
  const rows = Array.from(tableEl.querySelectorAll("tbody > tr"))
  const pages: string[][] = []
  let currentRows: string[] = []
  let currentH = header?.getBoundingClientRect().height ?? 0

  for (const row of rows) {
    const rh = row.getBoundingClientRect().height
    if (currentH + rh > pageHeight) {
      // 지금까지 모아둔 헤더+rows를 한 페이지로
      pages.push([
        header?.outerHTML ?? "",
        ...currentRows,
      ])
      // 새 페이지 시작
      currentRows = [row.outerHTML]
      currentH = (header?.getBoundingClientRect().height ?? 0) + rh
    } else {
      currentRows.push(row.outerHTML)
      currentH += rh
    }
  }

  if (currentRows.length > 0) {
    pages.push([
      header?.outerHTML ?? "",
      ...currentRows,
    ])
  }

  return pages
}

export function splitParagraph(
  el: HTMLElement,
  pageHeight: number
): string[] {
  const text = el.textContent || ""
  const wrapper = document.createElement("div")
  wrapper.style.visibility = "hidden"
  wrapper.style.position = "absolute"
  wrapper.style.width = `${el.clientWidth}px`
  document.body.appendChild(wrapper)

  const result: string[] = []
  let start = 0
  let end = text.length

  // binary search style 분할
  while (start < end) {
    let low = start
    let high = end
    let fit = start

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      wrapper.innerText = text.slice(start, mid)
      const h = wrapper.getBoundingClientRect().height
      if (h <= pageHeight) {
        fit = mid
        low = mid + 1
      } else {
        high = mid - 1
      }
    }

    // fit이 start와 같으면 한 글자라도 들어가지 않음: 강제 한 글자 분할
    if (fit === start) fit = start + 1

    result.push(`<p>${text.slice(start, fit)}</p>`)
    start = fit
  }

  document.body.removeChild(wrapper)
  return result
}

/**
 * 실제 페이지 분할을 수행하는 메인 함수
 */
export function paginateElements(
  elements: HTMLElement[],
  pageHeight: number
): string[][] {
  const pages: string[][] = []
  let currentPage: string[] = []
  let currentH = 0

  elements.forEach((el) => {
    const h = el.getBoundingClientRect().height

    // 1) 블록 하나가 페이지보다 클 때 → 내부 분할
    if (h > pageHeight) {
      if (el.tagName === "TABLE") {
        for (const fragRows of splitTable(el, pageHeight)) {
          // 기존에 채워둔 page가 있다면 먼저 푸시
          if (currentPage.length) {
            pages.push(currentPage)
            currentPage = []
            currentH = 0
          }
          // splitTable이 반환한 각 페이지 조각을 바로 푸시
          pages.push(fragRows)
        }
      } else {
        // 문단/헤딩 등 텍스트 블록
        const frags = splitParagraph(el, pageHeight)
        frags.forEach((html) => {
          // 새로운 페이지 시작
          if (currentPage.length) {
            pages.push(currentPage)
            currentPage = []
            currentH = 0
          }
          currentPage.push(html)
        })
      }
      return
    }

    // 2) 일반 블록 분할
    if (currentH + h > pageHeight) {
      pages.push(currentPage)
      currentPage = []
      currentH = 0
    }

    currentPage.push(el.outerHTML)
    currentH += h
  })

  if (currentPage.length) {
    pages.push(currentPage)
  }

  return pages
}
  
  /**
   * 단순 디바운스 함수:
   * 호출이 빈번할 때 마지막 호출 이후 delay(ms)가 지나면 실행됩니다.
   * 취소가 필요하면 debounced.cancel()을 호출하세요.
   */
  export function debounce<T extends (...args: any[]) => void>(
    fn: T,
    delay: number
  ): T & { cancel: () => void } {
    let timeout: number | undefined
  
    const debounced = ((...args: any[]) => {
      if (timeout !== undefined) {
        clearTimeout(timeout)
      }
      timeout = window.setTimeout(() => {
        fn(...args)
      }, delay)
    }) as T & { cancel: () => void }
  
    debounced.cancel = () => {
      if (timeout !== undefined) {
        clearTimeout(timeout)
      }
    }
  
    return debounced
  }
  