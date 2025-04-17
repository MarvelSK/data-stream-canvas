
import { DataCard } from "@/components/ui/DataCard";
import { DeviceData } from "@/hooks/useFakeData";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Check, 
  Wifi, 
  WifiOff, 
  Clock, 
  Cpu, 
  Thermometer, 
  Droplets,
  Gauge
} from "lucide-react";

interface DeviceListProps {
  devices: DeviceData[];
  isLoading: boolean;
}

export default function DeviceList({ devices, isLoading }: DeviceListProps) {
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading devices...</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Connected Devices</h1>
        <p className="text-muted-foreground">
          Manage and monitor your connected devices
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <DataCard
          title="Status Overview"
          className="lg:col-span-1"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-500" />
                <span>Online</span>
              </div>
              <Badge variant="outline" className="bg-green-500/10">
                {devices.filter(d => d.status === 'online').length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                <span>Warning</span>
              </div>
              <Badge variant="outline" className="bg-yellow-500/10">
                {devices.filter(d => d.status === 'warning').length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <WifiOff className="w-4 h-4 mr-2 text-red-500" />
                <span>Offline</span>
              </div>
              <Badge variant="outline" className="bg-red-500/10">
                {devices.filter(d => d.status === 'offline').length}
              </Badge>
            </div>
          </div>
        </DataCard>
        
        <DataCard
          title="Device Types"
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DEVICE_TYPES.map(type => {
              const count = devices.filter(d => d.type === type).length;
              return (
                <div 
                  key={type} 
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50"
                >
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground">{type}s</div>
                </div>
              );
            })}
          </div>
        </DataCard>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Devices</h2>
        <div className="space-y-4">
          {devices.map(device => (
            <DeviceItem key={device.id} device={device} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DeviceItem({ device }: { device: DeviceData }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'offline':
        return <WifiOff className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getLatestMetrics = (device: DeviceData) => {
    const metrics = [];
    
    const temperature = device.metrics.temperature[device.metrics.temperature.length - 1];
    if (temperature) {
      metrics.push({
        icon: <Thermometer className="h-4 w-4 text-muted-foreground" />,
        value: `${temperature.value.toFixed(1)}°C`,
      });
    }
    
    const humidity = device.metrics.humidity[device.metrics.humidity.length - 1];
    if (humidity) {
      metrics.push({
        icon: <Droplets className="h-4 w-4 text-muted-foreground" />,
        value: `${humidity.value.toFixed(1)}%`,
      });
    }
    
    const pressure = device.metrics.pressure[device.metrics.pressure.length - 1];
    if (pressure) {
      metrics.push({
        icon: <Gauge className="h-4 w-4 text-muted-foreground" />,
        value: `${pressure.value.toFixed(0)} hPa`,
      });
    }
    
    return metrics;
  };
  
  return (
    <div className="data-card">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{device.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="mr-2">{device.type}</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatTimeAgo(device.lastSeen)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-4">
            {getLatestMetrics(device).map((metric, i) => (
              <div key={i} className="flex items-center gap-1" title={metric.value}>
                {metric.icon}
                <span className="text-sm">{metric.value}</span>
              </div>
            ))}
          </div>
          {getStatusIcon(device.status)}
        </div>
      </div>
    </div>
  );
}

// Constant for device types (used in the component)
const DEVICE_TYPES = ["Sensor", "Controller", "Gateway", "Monitor"];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}
