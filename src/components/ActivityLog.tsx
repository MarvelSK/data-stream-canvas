
import { DataCard } from "@/components/ui/DataCard";
import { LogEntry } from "@/hooks/useFakeData";
import { 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle,
  Search
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ActivityLogProps {
  logs: LogEntry[];
  isLoading: boolean;
}

export default function ActivityLog({ logs, isLoading }: ActivityLogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<LogEntry["type"] | "all">("all");
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading activity logs...</div>;
  }
  
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === "" || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.device.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = filterType === "all" || log.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  // Count logs by type
  const logCounts = logs.reduce((counts: Record<string, number>, log) => {
    counts[log.type] = (counts[log.type] || 0) + 1;
    return counts;
  }, { info: 0, warning: 0, error: 0, success: 0 });
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <p className="text-muted-foreground">
          Track and monitor system events and device activities
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <LogTypeCard 
          title="Info" 
          count={logCounts.info} 
          icon={<Info className="h-5 w-5 text-blue-500" />}
          onClick={() => setFilterType(filterType === "info" ? "all" : "info")}
          active={filterType === "info"}
        />
        <LogTypeCard 
          title="Warning" 
          count={logCounts.warning} 
          icon={<AlertTriangle className="h-5 w-5 text-yellow-500" />}
          onClick={() => setFilterType(filterType === "warning" ? "all" : "warning")}
          active={filterType === "warning"}
        />
        <LogTypeCard 
          title="Error" 
          count={logCounts.error} 
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          onClick={() => setFilterType(filterType === "error" ? "all" : "error")}
          active={filterType === "error"}
        />
        <LogTypeCard 
          title="Success" 
          count={logCounts.success} 
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          onClick={() => setFilterType(filterType === "success" ? "all" : "success")}
          active={filterType === "success"}
        />
      </div>
      
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <DataCard title={`Log Entries (${filteredLogs.length})`}>
          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
            {filteredLogs.length > 0 ? (
              filteredLogs.map(log => (
                <LogItem key={log.id} log={log} />
              ))
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No logs matching your filters
              </div>
            )}
          </div>
        </DataCard>
      </div>
    </div>
  );
}

function LogTypeCard({ 
  title, 
  count, 
  icon, 
  onClick,
  active
}: { 
  title: string;
  count: number;
  icon: React.ReactNode;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <div 
      className={`data-card flex flex-col items-center p-4 cursor-pointer transition-all
        ${active ? 'ring-2 ring-primary/50 bg-primary/5' : 'hover:bg-secondary/50'}`}
      onClick={onClick}
    >
      {icon}
      <div className="text-xl font-bold mt-2">{count}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
}

function LogItem({ log }: { log: LogEntry }) {
  const getLogIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="activity-item">
      <div className="mt-0.5">
        {getLogIcon(log.type)}
      </div>
      <div className="flex-1">
        <div className="text-sm">{log.message}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          <span>{log.device}</span>
          <span className="mx-2">•</span>
          <span>{formatDateTime(log.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

function formatDateTime(date: Date): string {
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
