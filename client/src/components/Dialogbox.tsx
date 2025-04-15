// 문서 새로 만들기기

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Img2 from "../assets/Create-New-Image.png"
import { useNavigate } from "react-router-dom"
import { v4 as uuidV4 } from "uuid" 
import { useState } from "react"

export function Dialogbox() {
  const navigate = useNavigate() ; // 페이지 전환을 위한 훅
  const [docName, setDocName] = useState<string>("") ; // 문서 이름을 저장하는 상태 변수
    const createDoc = (docId: string) => {
      navigate(`/documents/${docId}`) ; // 문서 생성 후 해당 문서로 이동
    }

    const handleSubmit = () => {
      const id = uuidV4() ; // 새 문서 id 생성
      localStorage.setItem(`document-name-for-${id}`, docName) ; //로컬에 이름 저장      
      createDoc(id) ; // 문서 생성 후 에디터 페이지로 이동
    }
  return (
    <div className="border p-2 bg-white border-gray-300 h-[200px] w-[160px] rounded-md hover:border-blue-600">
        <Dialog>
        <DialogTrigger asChild> 
          <img
              className="h-full w-full cursor-pointer"
              src={Img2}
              alt="createImg"
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new document</DialogTitle>
            <DialogDescription>
              Enter a name for your document. Click create when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3"
                value={docName}
                onChange={(e) => { setDocName(e.target.value); }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button style={{"backgroundColor": "rgb(10, 110, 209)"}} type="submit" onClick={handleSubmit}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
