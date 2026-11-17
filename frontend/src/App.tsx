import BoardsPage from "./pages/BoardsPage";
import {Navigate, Route, Routes} from "react-router";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import BoardPage from "./pages/BoardPage";
import MainLayout from "./pages/layouts/MainLayout";
import { GuestRoute, ProtectedRoute } from "./components/RouteGuards";
import SettingsLayout from "./pages/layouts/SettingsLayout";
import ActivityPage from "./pages/settings/ActivityPage";
import ProfilePage from "./pages/settings/ProfilePage";
import AccountSettingsPage from "./pages/settings/AccountSettingsPage";
import WorkspaceBoardsPage from "./pages/settings/WorkspaceBoardsPage";
import WorkspaceMembersPage from "./pages/settings/WorkspaceMembersPage";
import WorkspaceSettingsPage from "./pages/settings/WorkspaceSettingsPage";

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
                <Route element={<SettingsLayout />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/activity" element={<ActivityPage />} />
                    <Route path="/account-settings" element={<AccountSettingsPage />} />
                    <Route path="/workspace/boards" element={<WorkspaceBoardsPage />} />
                    <Route path="/workspace/members" element={<WorkspaceMembersPage />} />
                    <Route path="/workspace/settings" element={<WorkspaceSettingsPage />} />
                </Route>
            </Route>
        </Routes>
    </>
  )
}

export default App;