import SideBar from "@/components/SideBar";
import DashboardContent from "@/components/DashboardPage"; 
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {

    const user = await stackServerApp.getUser();
    if (!user) redirect("/");

    return (
        <div>
            <SideBar currentPath="/dashboard">
                <DashboardContent /> 
            </SideBar>
        </div>
    );
}