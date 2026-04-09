import SideBar from "@/components/SideBar";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import GamesInfo from "@/components/GamesInfo";

export default async function GamesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string; genre?: string }>;
}) {
    const user = await stackServerApp.getUser();
    if (!user) {
        redirect("/");
    }

    const resolvedSearchParams = await searchParams;

    return (
        <div>
            <SideBar currentPath={"/games"}>
                <GamesInfo searchParams={resolvedSearchParams} />
            </SideBar>
        </div>
    );
}
