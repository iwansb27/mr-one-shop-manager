import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Video,
  Megaphone,
  BookOpen,
  Cloud,
  AlertCircle,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/console1/products", label: "Console 1 — Products (A)", icon: Package },
  { to: "/console1/content", label: "Console 1 — Content (B)", icon: Video },
  { to: "/console2/marketing", label: "Console 2 — Marketing", icon: Megaphone },
  { to: "/architecture", label: "Architecture", icon: BookOpen },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
              M1
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">MR.ONE</h1>
              <p className="text-xs text-gray-500">Shop Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-gray-200 space-y-3">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Cloud size={14} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-700">
                Cloudinary
              </span>
              <span className="badge-warning ml-auto">NOT VERIFIED</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Master storage bridge is not yet connected. Master URLs are
              registered manually.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Megaphone size={14} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-700">
                Buffer / Distribution
              </span>
              <span className="badge-warning ml-auto">NOT VERIFIED</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Distribution API is not yet connected. Scheduling is recorded
              only.
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
