import { UserButton, useAuth, useClerk, useUser } from "@clerk/react";

import {
  ChevronLeft,
  Crown,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AiToolsData, assets } from "../assets/assets";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const { has } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const metadataPlan = String(user?.publicMetadata?.plan || "").toLowerCase();
  const isPremium =
    has?.({ plan: "premium" }) ||
    has?.({ plan: "user:premium" }) ||
    metadataPlan === "premium" ||
    metadataPlan === "user:premium";
  const planLabel = isPremium ? "Premium plan active" : "Free plan active";

  const navItems = [
    { label: "Dashboard", path: "/ai", Icon: LayoutDashboard },
    ...AiToolsData.map(({ title, path, Icon }) => ({
      label: title,
      path,
      Icon,
    })),
    { label: "Community", path: "/ai/community", Icon: Users },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <button onClick={() => navigate("/")} className="flex items-center">
          <img src={assets.logo} alt="Lexora AI" className="h-9 w-auto" />
        </button>
        <button
          onClick={() => setOpen(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-4 rounded-2xl border border-primary/10 bg-primary/5 p-3">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {user?.fullName || "Creator"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {user?.primaryEmailAddress?.emailAddress || "Lexora workspace"}
            </p>
          </div>
        </div>
        <div
          className={`mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold ${
            isPremium ? "text-amber-600" : "text-primary"
          }`}
        >
          <Crown className="h-4 w-4" />
          {planLabel}
        </div>
      </div>

      <nav className="no-scrollbar mt-4 flex-1 space-y-1 overflow-y-auto px-3 pb-3">
        {navItems.map(({ label, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/ai"}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`
            }
          >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50"
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-100 bg-white/85 px-4 backdrop-blur lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 text-slate-700"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <img src={assets.logo} alt="Lexora AI" className="h-8 w-auto" />
        <UserButton afterSignOutUrl="/" />
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-100 bg-white lg:block">
        {sidebarContent}
      </aside>
      {/* small screen sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-slate-950/40 transition ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-80 max-w-[86vw] border-r border-slate-100 bg-white shadow-2xl transition ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>
      </div>

      <button
        onClick={() => navigate("/")}
        className="fixed left-72 top-6 z-30 hidden h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-500 shadow-sm hover:text-primary lg:flex"
        aria-label="Back to home"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    </>
  );
};

export default Sidebar;
