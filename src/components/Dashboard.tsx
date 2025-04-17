
import { DataCard } from "@/components/ui/DataCard";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { ScatterChart } from "@/components/charts/ScatterChart";
import { DeviceData } from "@/hooks/useFakeData";
import { Badge } from "@/components/ui/badge";

interface DashboardProps {
  devices: DeviceData[];
  isLoading: boolean;
}

export default function Dashboard({ devices, isLoading }: DashboardProps) {
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading dashboard data...</div>;
  }
  
  // Prepare correlation data for scatter plot
  const correlationData = devices.flatMap(device => 
    device.metrics.temperature.map((temp, i) => ({
      temperature: temp.value,
      humidity: device.metrics.humidity[i]?.value,
      pressure: device.metrics.pressure[i]?.value,
      device: device.name,
    }))
  );
  
  // Summary data for device types
  const deviceTypeCounts = devices.reduce((acc: Record<string, number>, device) => {
    acc[device.type] = (acc[device.type] || 0) + 1;
    return acc;
  }, {});
  
  const deviceTypesForChart = Object.entries(deviceTypeCounts).map(([type, count]) => ({
    type,
    count,
  }));
  
  // Device status summary
  const deviceStatusCounts = devices.reduce((acc: Record<string, number>, device) => {
    acc[device.status] = (acc[device.status] || 0) + 1;
    return acc;
  }, {});
  
  const deviceStatusesForChart = Object.entries(deviceStatusCounts).map(([status, count]) => ({
    status,
    count,
  }));
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of {devices.length} connected devices
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <DataCard title="Devices by Type">
          <BarChart 
            data={deviceTypesForChart} 
            xKey="type" 
            yKey="count" 
            title="Device Types" 
            color="var(--accent)"
          />
        </DataCard>
        
        <DataCard title="Device Status">
          <BarChart 
            data={deviceStatusesForChart} 
            xKey="status" 
            yKey="count" 
            title="Status" 
            color="var(--primary)"
          />
        </DataCard>
        
        <DataCard title="Device Overview">
          <div className="h-[300px] flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
                <span className="text-3xl font-bold text-primary">
                  {devices.length}
                </span>
                <span className="text-sm text-muted-foreground">Total Devices</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
                <span className="text-3xl font-bold text-primary">
                  {devices.filter(d => d.status === 'online').length}
                </span>
                <span className="text-sm text-muted-foreground">Online</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
                <span className="text-3xl font-bold text-yellow-500">
                  {devices.filter(d => d.status === 'warning').length}
                </span>
                <span className="text-sm text-muted-foreground">Warning</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
                <span className="text-3xl font-bold text-destructive">
                  {devices.filter(d => d.status === 'offline').length}
                </span>
                <span className="text-sm text-muted-foreground">Offline</span>
              </div>
            </div>
          </div>
        </DataCard>
      </div>
      
      {devices.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Device Metrics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <DataCard title={`Temperature (${devices[0].name})`}>
              <LineChart 
                data={devices[0].metrics.temperature} 
                title="Temperature" 
                color="var(--primary)"
              />
            </DataCard>
            
            <DataCard title={`Humidity (${devices[0].name})`}>
              <LineChart 
                data={devices[0].metrics.humidity} 
                title="Humidity" 
                color="var(--accent)"
              />
            </DataCard>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mb-8">
            <DataCard 
              title="Temperature vs. Humidity Correlation" 
              fullWidth
            >
              <ScatterChart 
                data={correlationData} 
                xKey="temperature" 
                yKey="humidity" 
                title="Temperature vs Humidity" 
                color="var(--primary)"
              />
            </DataCard>
          </div>
        </>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recently Active Devices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices
            .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
            .slice(0, 6)
            .map(device => (
              <div key={device.id} className="data-card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{device.name}</h3>
                    <p className="text-sm text-muted-foreground">{device.type}</p>
                  </div>
                  <StatusBadge status={device.status} />
                </div>
                <div className="text-sm text-muted-foreground">
                  Last seen: {formatDate(device.lastSeen)}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: DeviceData["status"] }) {
  const variants = {
    online: "bg-green-500/20 text-green-600 border-green-600/20",
    warning: "bg-yellow-500/20 text-yellow-600 border-yellow-600/20",
    offline: "bg-red-500/20 text-red-600 border-red-600/20",
  };
  
  return (
    <Badge className={variants[status]}>
      {status}
    </Badge>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
