// 기존 문서 접근하는 버튼튼

import { useNavigate } from "react-router-dom"
import Img1 from "../assets/Google-Docs-logo.png"

export const Docs = ({ documentId, docName }: { documentId: string, docName: string }) => { // 문서 id와 이름이 전달됨
    const navigate = useNavigate() ;

    const openDoc = (id: string) => {
        navigate(`/documents/${id}`) ; // 문서 id를 이용해 해당 문서로 이동
    }
    return(
        <div className="docs" onClick={() => {openDoc(documentId); }}> 
            <img src={Img1} alt="icon"/>
            <div> {docName} </div>
        </div>
    )
}