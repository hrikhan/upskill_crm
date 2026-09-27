import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, LogOut, User, Crown, ShieldCheck } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { logout } from "@/store/features/AuthSlice/authSlice";
import { canUserAccessMenuItem } from "@/utils/permissionMapping";
import { adminRoutes } from "@/routes/AdminRoutes";
import { menuGenerator, MenuItem } from "@/utils/Generator/MenuGenerator";
import { Location } from "react-router-dom";
import { cn } from "@/lib/utils";
import Logo from "@/common/Logo";

const exactMatchPaths = ["/admin", "/user"];



const isRouteActive = (item: MenuItem, currentPath: string): boolean => {
  if (!item.path) return false;

  if (currentPath === item.path) return true;

  if (exactMatchPaths.includes(item.path)) return false;

  if (item.path !== "/" && currentPath.startsWith(item.path + "/")) return true;

  if (item.children) {
    return item.children.some((child) => isRouteActive(child, currentPath));
  }

  return false;
};

const hasActiveChild = (menuItem: MenuItem, path: string): boolean => {
  if (!menuItem.children) return false;
  return menuItem.children.some(
    (child) => isRouteActive(child, path) || hasActiveChild(child, path)
  );
};

const SidebarItem = ({ item, location, depth = 0 }: { item: MenuItem; location: Location; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(() => hasActiveChild(item, location.pathname));
  const hasChildren = !!item.children?.length;
  const isActive = isRouteActive(item, location.pathname);

  return (
    <div className="w-full">
      {hasChildren ? (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center justify-between w-full rounded-xl transition-all duration-200 group cursor-pointer",
              depth === 0 ? "h-12 px-4 text-sm font-medium" : "h-10 px-3 text-sm font-medium",
              isActive 
                ? depth === 0
                  ? "bg-brand-gradient text-white font-medium"
                  : "text-secondary-brand font-medium"
                : "text-muted-blue hover:bg-light-background hover:text-primary-text"
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon && (
                <span className={cn("shrink-0 transition-colors", 
                  depth === 0 ? "[&_svg]:size-6" : "[&_svg]:size-4",
                  isActive
                    ? depth === 0 ? "text-white" : "text-secondary-brand"
                    : "text-muted-blue group-hover:text-primary-text"
                )}>
                  {item.icon}
                </span>
              )}
              <span className="truncate">{item.label}</span>
            </div>
            <ChevronRight
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-200 shrink-0",
                isActive
                  ? depth === 0 ? "text-white" : "text-secondary-brand"
                  : "text-muted-blue group-hover:text-primary-text",
                isOpen && "rotate-90"
              )}
            />
          </button>
          {isOpen && (
            <div className={cn(
              "mt-1 space-y-1 border-l border-border animate-in slide-in-from-top-1 duration-200",
              depth === 0 ? "ml-6 pl-3" : "ml-3 pl-2 border-l-border/60"
            )}>
              {item.children!.map((child) => (
                <SidebarItem key={child.path} item={child} location={location} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <NavLink
          to={item.path || "#"}
          className={cn(
            "flex items-center gap-3 rounded-xl transition-all duration-200 no-underline! group",
            depth === 0 ? "h-12 px-4 text-sm font-medium" : "h-10 px-3 text-sm font-medium",
            isActive
              ? depth === 0
                ? "bg-brand-gradient text-white font-medium"
                : "text-secondary-brand font-medium"
              : "text-muted-blue hover:bg-light-background hover:text-primary-text"
          )}
        >
          {item.icon && (
            <span className={cn("shrink-0 transition-colors", 
              depth === 0 ? "[&_svg]:size-6" : "[&_svg]:size-4",
              isActive
                ? depth === 0 ? "text-white" : "text-secondary-brand"
                : "text-muted-blue group-hover:text-primary-text"
            )}>
              {item.icon}
            </span>
          )}
          <span className="truncate">{item.label}</span>
        </NavLink>
      )}
    </div>
  );
};

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  config?: any[];
  basePath?: string;
}

const Sidebar = ({
  isMobileOpen,
  setIsMobileOpen,
  config = adminRoutes,
  basePath = "/admin",
}: SidebarProps) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const rawMenu = menuGenerator(config, basePath);

  // Dynamically filter sidebar items based on Super Admin / Admin / Staff permissions
  const menu = rawMenu
    .filter((item) => canUserAccessMenuItem(user, item.label || item.path || ""))
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter((child) =>
            canUserAccessMenuItem(user, child.label || child.path || "")
          ),
        };
      }
      return item;
    });
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const w = window.innerWidth;
    if (w < 640) return false;
    if (w < 1280) return true;
    return localStorage.getItem("sidebar-collapsed") === "true";
  });
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  const prevBreakpoint = useRef<"mobile" | "sm-xl" | "xl">("xl");

  useEffect(() => {
    const getBreakpoint = (w: number): "mobile" | "sm-xl" | "xl" =>
      w < 640 ? "mobile" : w < 1280 ? "sm-xl" : "xl";

    const handleResize = () => {
      const w = window.innerWidth;
      const bp = getBreakpoint(w);
      setIsMobile(w < 640);

      if (bp === "sm-xl" && prevBreakpoint.current === "xl") {
        setIsCollapsed(true);
      }
      if (bp === "xl" && prevBreakpoint.current === "sm-xl") {
        setIsCollapsed(localStorage.getItem("sidebar-collapsed") === "true");
      }
      prevBreakpoint.current = bp;
    };

    prevBreakpoint.current =
      window.innerWidth < 640 ? "mobile" : window.innerWidth < 1280 ? "sm-xl" : "xl";

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname, setIsMobileOpen]);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    if (typeof window !== "undefined" && window.innerWidth >= 1280) {
      localStorage.setItem("sidebar-collapsed", String(nextState));
    }
  };

  const groupedMenu = menu.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const group = item.group || "General";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  const showCollapsed = isCollapsed && !isMobile;

  return (
    <aside
      className={cn(
        "bg-primary-background text-primary-text h-screen flex flex-col transition-all duration-300 z-50 shrink-0 border-r border-border rounded-br-xl",
        // Desktop layouts
        "sm:sticky sm:top-0 sm:translate-x-0",
        showCollapsed ? "sm:w-20" : "sm:w-[260px]",
        // Mobile layouts (drawer overlay style)
        "fixed left-0 top-0 h-screen w-[280px] sm:static",
        isMobileOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
      )}
    >
      {/* Floating Collapse/Expand Button aligned exactly on the border intersection */}
      <button
        onClick={toggleCollapse}
        className="absolute right-[-12px] top-20 z-50 transform -translate-y-1/2 w-6 h-6 rounded-full bg-primary-background border border-border hidden sm:flex items-center justify-center cursor-pointer hover:border-border transition-colors text-secondary-text hover:text-primary-text focus:outline-none"
      >
        {showCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Sidebar Header with Site-styled BaseKit Logo - h-20 to align with Top Header */}
      <div className={cn("h-20 flex items-center justify-center border-b border-border shrink-0", showCollapsed ? "px-1" : "px-4")}>
        <Link to={menu[0]?.path || "/"} className="w-full no-underline outline-none">
          <Logo collapsed={showCollapsed} className="w-full justify-center sm:justify-start" />
        </Link>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7 scrollbar-thin scrollbar-thumb-slate-200">
        {Object.entries(groupedMenu).map(([group, items]) => (
          <div key={group} className="space-y-2">
            {!showCollapsed && (
              <span className="text-xs uppercase tracking-wider font-medium text-muted-blue px-4 block">
                {group}
              </span>
            )}
            <div className="space-y-2">
              {items.map((item) =>
                showCollapsed ? (
                  <Link
                    key={item.path}
                    to={item.path || "#"}
                    className={cn(
                      "flex items-center justify-center h-12 p-6 rounded-xl transition-all duration-200",
                      isRouteActive(item, location.pathname)
                        ? "bg-brand-gradient text-white"
                        : "text-muted-blue hover:bg-light-background hover:text-primary-text"
                    )}
                  >
                    {item.icon && (
                      <span
                        className={cn(
                          "shrink-0 [&_svg]:size-6",
                          isRouteActive(item, location.pathname)
                            ? "text-white"
                            : "text-muted-blue hover:text-primary-text"
                        )}
                      >
                        {item.icon}
                      </span>
                    )}
                  </Link>
                ) : (
                  <SidebarItem key={item.label + item.path} item={item} location={location} />
                )
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Card at Bottom */}
      <div className="p-3 border-t border-border mt-auto shrink-0">
        {showCollapsed ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border flex items-center justify-center text-slate-600 dark:text-slate-300">
              {user?.role === "super_admin" ? (
                <Crown className="w-5 h-5 text-amber-500" />
              ) : user?.role === "admin" ? (
                <ShieldCheck className="w-5 h-5 text-sky-500" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <button
              onClick={() => {
                dispatch(logout());
                window.location.href = "/login";
              }}
              title="Sign Out"
              className="text-muted-blue hover:text-red-500 transition-colors cursor-pointer p-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2.5 border border-border rounded-xl bg-card surface shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                {user?.role === "super_admin" ? (
                  <Crown className="w-4.5 h-4.5 text-amber-500" />
                ) : user?.role === "admin" ? (
                  <ShieldCheck className="w-4.5 h-4.5 text-sky-500" />
                ) : (
                  <User className="w-4.5 h-4.5" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-primary-text leading-tight truncate">
                  {user?.name || "User"}
                </span>
                <span className="text-[10px] text-muted-blue leading-tight truncate mt-0.5 capitalize">
                  {user?.designation || (user?.role === "super_admin" ? "Super Admin" : user?.role === "admin" ? "Operations Admin" : "Staff")}
                </span>
              </div>
            </div>
            <button 
              onClick={() => {
                dispatch(logout());
                window.location.href = "/login";
              }}
              title="Sign Out"
              className="text-muted-blue hover:text-red-500 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
