import BoardsPage from "./pages/BoardsPage";
import {Navigate, Route, Routes} from "react-router";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import BoardPage from "./pages/BoardPage";
import MainLayout from "./pages/layouts/MainLayout";
import { GuestRoute, ProtectedRoute } from "./components/RouteGuards";

function App(){

  return (
    <>
        <Routes>
            <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/boards" replace />} />
                    <Route path="/boards" element={<BoardsPage />} />
                    <Route path="/boards/:boardId" element={<BoardPage />} />
                    <Route path="*" element={<div>Strona nie znaleziona</div>} />
                </Route>
            </Route>
        </Routes>
    </>
  )
}

export default App;