// 문서 첫 화면 대시보드 

import { useState, useEffect } from "react" ;
import { Docs } from "./Docs";
import { io } from "socket.io-client";
import { Topbar } from "./Topbar";
import { Dialogbox } from "./Dialogbox";
  

// 이런 모양의 데이터를 다룰 거에요라고 약속하는 코드 
interface DocumentType {
    _id: string;
    name: string;
    data: {
        ops: any[];
    };
    __v: number;
}


export const LandingPage = () => {

    // 최근 문서 목록을 저장하는 상태 변수
    const [documents, setDocuments] = useState<DocumentType[]>([]) ;

    useEffect(() => {
        const socket = io(import.meta.env.VITE_SERVER_URL) ; // 백엔드 서버에 소켓 연결

        socket.emit("get-all-documents") ; // 전체 문서 목록을 달라고 요청

        socket.on("all-documents", (allDocuments) => { // 서버로부터 문서 목록을 받음 
            setDocuments(allDocuments) ;
        });
        
        return () => {
            socket.disconnect() ; // 소켓 연결 해제
        }
    }, []) ;

    return(
        <div className="LandingPage">
            <Topbar />
            <div className="Docs-container-1"> 
                <div className="title-1"> 새 템플릿 시작 </div>
                {/* 새로운 문서를 생성하는 UI */}
                <div> <Dialogbox /> </div>  
            </div>

            {
                (documents.length > 0) && ( // 문서가 있을 때만 최근 문서 목록을 보여줌
                <div className="Docs-container-2">
                    <div className="title-2"> 최근 문서 </div>
                    <div className="grid grid-cols-6">
                    {
                        documents?.map((docs, index) => 
                            <Docs documentId={docs._id} docName={docs.name} key={index}/>
                        )
                    }
                    </div>
                </div>)
            }
        </div>
    )
}