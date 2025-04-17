
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import DeviceList from "@/components/DeviceList";
import ActivityLog from "@/components/ActivityLog";
import { useFakeData } from "@/hooks/useFakeData";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const { devices, logs, isLoading } = useFakeData();

  // Show a toast when data is loaded
  if (!isLoading && devices.length > 0 && activeView === "dashboard") {
    toast({
      title: "Connected to Data Stream",
      description: `Monitoring ${devices.length} devices in real-time`,
      duration: 3000,
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar setActiveView={setActiveView} />
      
      <main className="flex-1 pb-12">
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading data...</span>
          </div>
        ) : (
          <>
            {activeView === "dashboard" && <Dashboard devices={devices} isLoading={isLoading} />}
            {activeView === "devices" && <DeviceList devices={devices} isLoading={isLoading} />}
            {activeView === "activity" && <ActivityLog logs={logs} isLoading={isLoading} />}
          </>
        )}
      </main>
      
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>DataStream - Real-time Device Monitoring</p>
          <p className="text-xs mt-1">Connect to Supabase to enable persistent data storage</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
