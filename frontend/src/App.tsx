import BoardsPage from "./pages/BoardsPage";
import {Navigate, Route, Routes} from "react-router";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import BoardPage from "./pages/BoardPage";
import useBoards from "./hooks/useBoards";


function App(){

  function RootRedirect() {
    const token = localStorage.getItem("token");
    return token ?  <Navigate to="/" replace /> : <Navigate to="/login" replace />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<RootRedirect/>}/>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<Navigate to="/app/boards" />}/>
        <Route path="/boards" element={< BoardsPage boards={boards}/>} />
        <Route path="/boards/:boardId" element={< BoardPage/>} />

        <Route path="*" element={<div>Strona nie znaleziona</div>} />
      </Routes>
    </>
  )
}

export default App;