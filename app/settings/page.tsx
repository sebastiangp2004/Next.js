import SideBar from "@/components/SideBar";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { AccountSettings } from "@stackframe/stack";


export default async function SettingsPage() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/");
  }

  return (
    <div>
      <SideBar currentPath="/settings">
        <div className="w-full min-h-screen bg-base-300 p-6 lg:p-10">
          {/* ── Header ── */}
          <div className="flex items-center gap-4 mb-10">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Account Settings
              </h1>
              <p className="text-white/40 text-sm mt-1 font-mono tracking-wide">
                Manage your profile and preferences
              </p>
            </div>
          </div>

          {/* ── Content Container ── */}
          <div className="bg-base-100/40 backdrop-blur-xl border border-white/[0.07] rounded-2xl shadow-lg overflow-hidden">
            <AccountSettings />
          </div>
        </div>
      </SideBar>
    </div>
  );
}



