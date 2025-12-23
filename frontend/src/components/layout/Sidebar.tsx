import { Link, useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  ChevronDown,
  Check,
  LogOut,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleSidebar } from "@/store/uiSlice";
import { setCurrentOrganization, switchOrganizationToken, logout } from "@/store/authSlice";
import { SWITCH_ORGANIZATION_MUTATION } from "@/graphql/mutations";
import { resetApolloClient } from "@/lib/apollo";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Organization } from "@/types";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: FolderKanban, label: "Projects", path: "/projects" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface SwitchOrgResponse {
  switchOrganization: {
    token: string;
  };
}

export const Sidebar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { currentOrganization, organizations, user } = useAppSelector(
    (state) => state.auth
  );

  const [switchOrg] = useMutation<SwitchOrgResponse>(SWITCH_ORGANIZATION_MUTATION);

  const handleSwitchOrganization = async (org: Organization) => {
    if (org.id === currentOrganization?.id) return;

    try {
      const { data } = await switchOrg({
        variables: { organizationId: org.id },
      });

      if (data?.switchOrganization.token) {
        dispatch(switchOrganizationToken(data.switchOrganization.token));
        dispatch(setCurrentOrganization(org));
        resetApolloClient();
      }
    } catch (error) {
      console.error("Failed to switch organization:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    resetApolloClient();
    window.location.href = "/auth";
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden transition-opacity",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => dispatch(toggleSidebar())}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-20",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              {sidebarOpen && (
                <span className="font-semibold text-sidebar-foreground text-lg">
                  ProjectHub
                </span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => dispatch(toggleSidebar())}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Organization Switcher */}
          {organizations.length > 0 && sidebarOpen && (
            <div className="p-4 border-b border-sidebar-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-auto py-3 px-3 hover:bg-sidebar-accent"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-sidebar-accent flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-sidebar-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-sidebar-foreground truncate max-w-[140px]">
                          {currentOrganization?.name || "Select Organization"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {currentOrganization?.role || ""}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {organizations.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => handleSwitchOrganization(org)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded bg-muted flex items-center justify-center">
                          <Building2 className="h-3 w-3" />
                        </div>
                        <span className="truncate">{org.name}</span>
                      </div>
                      {org.id === currentOrganization?.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full h-auto py-2 hover:bg-sidebar-accent",
                    sidebarOpen ? "justify-start px-3" : "justify-center px-0"
                  )}
                >
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground text-sm font-medium">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </span>
                  </div>
                  {sidebarOpen && (
                    <div className="ml-3 text-left">
                      <p className="text-sm font-medium text-sidebar-foreground">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                        {user?.email}
                      </p>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  );
};
