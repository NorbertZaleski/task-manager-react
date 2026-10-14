import { Outlet } from "react-router";
import TopBar from "../../components/TopBar";

function MainLayout(){
    return(
        <div className="flex h-dvh flex-col overflow-hidden">
            <main className="min-h-0 flex-1">
                <TopBar />
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout;