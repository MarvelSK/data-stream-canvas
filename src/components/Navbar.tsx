
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun, BarChart2, List, Activity } from "lucide-react";
import { useState } from "react";

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

export default function Navbar({ 
  setActiveView 
}: { 
  setActiveView: (view: string) => void 
}) {
  const { theme, toggleTheme } = useTheme();
  const [activeId, setActiveId] = useState("dashboard");

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart2 className="mr-2 h-4 w-4" /> },
    { id: "devices", label: "Devices", icon: <List className="mr-2 h-4 w-4" /> },
    { id: "activity", label: "Activity", icon: <Activity className="mr-2 h-4 w-4" /> },
  ];
  
  const handleNavClick = (id: string) => {
    setActiveId(id);
    setActiveView(id);
  };
  
  return (
    <div className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <BarChart2 className="h-6 w-6 text-accent" />
          <span className="text-lg">DataStream</span>
        </div>
        
        <nav className="ml-auto md:ml-10 flex gap-1.5 md:gap-4">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeId === item.id ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavClick(item.id)}
              className="h-9"
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
