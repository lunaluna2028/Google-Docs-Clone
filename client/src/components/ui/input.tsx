// 자주 사용하는 텍스트 입력 필드

import * as React from "react"

import { cn } from "@/lib/utils"

// 입력 필드에 쓸 수 있는 속성 정의
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// 입력 필드 컴포넌트 본체 
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (

      // 입력 필드의 기본 스타일을 정의
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
