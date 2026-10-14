import { Outlet } from "react-router";
import NavSidebar from "../../components/NavSidebar";
import TopBar from "../../components/TopBar";

function MainLayout(){
    return(
        <div className="flex">

            <NavSidebar />

            <main className="flex flex-col gap-2">
                <TopBar/>
                <Outlet />
            </main>

        </div>
    )
}

export default MainLayout;