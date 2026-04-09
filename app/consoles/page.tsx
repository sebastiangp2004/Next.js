
import SideBar from "@/components/SideBar";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import ConsolesInfo from "@/components/ConsolesInfo";


export default async function ConsolesPage({
    Children,
}: {
    Children: React.ReactNode
}) {

    const user = await stackServerApp.getUser();
    if (!user) {
        redirect("/");

    }
    return (
        <div>
            <SideBar currentPath={'/consoles'}>
                <ConsolesInfo />
            </SideBar>
        </div>
    );
}