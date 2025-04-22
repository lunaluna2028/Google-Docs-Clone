// 단일 페이지 레이아웃 컴포넌트 

import React from "react"
import "./page-layout.scss"

type PageLayoutProps = {
  children: React.ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="page">
      <div className="page-content">
        {children}
      </div>
    </div>
  )
}