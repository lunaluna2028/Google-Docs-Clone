// 페이지 구조와 라우팅 정의 

import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom" // 페이지 전환을 위한 라우팅 라이브러리
import { TestEditor } from "./components/TestEditor"
import { LandingPage } from "./components/LandingPage"
// import { v4 as uuidV4 } from "uuid"

function App() { 

  return (
    <div className="app">
      <Router>
        <Routes> 
          <Route path="/" element={<LandingPage />} />
          <Route path="/documents/:id" element={ <TestEditor /> }/> 
        </Routes>
      </Router>
    </div>
  )
}

export default App
