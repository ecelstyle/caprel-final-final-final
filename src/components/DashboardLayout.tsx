import { ReactNode, useState } from "react";
import { Home, Package, Plus, Users, Folder, MessageSquare, LogOut, Shield, Brain, Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/orders", icon: Package, label: "Orders" },
    { to: "/new-order", icon: Plus, label: "New Order" },
    { to: "/clients", icon: Users, label: "Clients" },
    { to: "/catalog", icon: Folder, label: "Catalog" },
    { to: "/ml-analytics", icon: Brain, label: "ML Analytics" },
    { to: "/messages", icon: MessageSquare, label: "Messages" },
  ];

  return (
    <div className="min-h-screen flex w-full bg-gradient-subtle">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo & Toggle */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-sidebar-primary" />
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">Caprel</h2>
                <p className="text-xs text-sidebar-foreground/60">LocalSecure</p>
              </div>
            </div>
          )}
          {isCollapsed && <Shield className="h-8 w-8 text-sidebar-primary mx-auto" />}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent ml-auto"
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout - Always Visible */}
        <div className="p-4 border-t border-sidebar-border">
          <NavLink to="/">
            <Button
              variant="ghost"
              className={cn(
                "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive transition-colors",
                isCollapsed ? "px-2" : "justify-start"
              )}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
