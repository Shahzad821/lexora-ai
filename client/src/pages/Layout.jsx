import { RedirectToSignIn, useAuth } from "@clerk/react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8ff] text-sm font-medium text-slate-500">
        Loading workspace...
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8ff]">
      <Sidebar />
      <main className="min-w-0 lg:pl-72">
        <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
