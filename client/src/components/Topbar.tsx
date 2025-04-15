// 랜딩 페이지에서 탑바 : 로고 & 검색창창

import Img1 from "../assets/hans_logo.png" ;
import Img2 from "../assets/SearchIcon.jpeg" ;
import { useAdmin } from "@/context/AdminContext";


export const Topbar = () => {
    const { isAdmin, setIsAdmin } = useAdmin();

    return(
        <nav className="Topbar">
            <div className="logodiv">
                <img src={Img1} alt="Logo" />
                
            </div>
            <div className="Searchbar">
                <img src={Img2} alt="" />
                <input type="text" placeholder="검색"/>   
            </div>

            <div className="isAdmin">
                <label className="switch">
                    <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                    <span className="slider"></span>
                </label>
                <span className="label-text">관리자 모드</span>
            </div>

        </nav>
    )
}