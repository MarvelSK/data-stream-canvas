
import { useState, useEffect } from "react";

export interface DataPoint {
  timestamp: Date;
  value: number;
}

export interface DeviceData {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline" | "warning";
  lastSeen: Date;
  metrics: {
    temperature: DataPoint[];
    humidity: DataPoint[];
    pressure: DataPoint[];
    voltage: DataPoint[];
  };
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  device: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
}

const DEVICE_TYPES = ["Sensor", "Controller", "Gateway", "Monitor"];
const LOG_MESSAGES = [
  "Device connected",
  "Reading update received",
  "Threshold exceeded",
  "Connection lost",
  "Battery low",
  "Firmware updated",
  "Alert triggered",
  "Restarted successfully",
];

// Generate random device data
const generateDevices = (count: number): DeviceData[] => {
  return Array.from({ length: count }, (_, i) => {
    const deviceId = `device-${i + 1}`;
    const now = new Date();
    const lastSeen = new Date(now.getTime() - Math.random() * 86400000);
    
    return {
      id: deviceId,
      name: `Device ${i + 1}`,
      type: DEVICE_TYPES[Math.floor(Math.random() * DEVICE_TYPES.length)],
      status: Math.random() > 0.8 ? "offline" : Math.random() > 0.6 ? "warning" : "online",
      lastSeen,
      metrics: {
        temperature: generateMetric(24, 20, 30),
        humidity: generateMetric(24, 30, 70),
        pressure: generateMetric(24, 995, 1015),
        voltage: generateMetric(24, 11.5, 12.5),
      },
    };
  });
};

// Generate random metric data
const generateMetric = (count: number, min: number, max: number): DataPoint[] => {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    return {
      timestamp: new Date(now.getTime() - (23 - i) * 3600000),
      value: min + Math.random() * (max - min),
    };
  });
};

// Generate random log entries
const generateLogs = (devices: DeviceData[], count: number): LogEntry[] => {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const device = devices[Math.floor(Math.random() * devices.length)];
    const message = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
    const typeOptions: LogEntry["type"][] = ["info", "warning", "error", "success"];
    const type = typeOptions[Math.floor(Math.random() * typeOptions.length)];
    
    return {
      id: `log-${i + 1}`,
      timestamp: new Date(now.getTime() - Math.random() * 86400000),
      device: device.name,
      message,
      type,
    };
  });
};

export function useFakeData() {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial data
    const initialDevices = generateDevices(5);
    const initialLogs = generateLogs(initialDevices, 20);
    
    setDevices(initialDevices);
    setLogs(initialLogs);
    setIsLoading(false);
    
    // Update data periodically
    const interval = setInterval(() => {
      // Add new log entry
      const newLog = generateLogs(devices, 1)[0];
      setLogs(prev => [newLog, ...prev].slice(0, 100));
      
      // Update device metrics
      setDevices(prev => 
        prev.map(device => {
          // Add new data point to each metric
          const now = new Date();
          const updatedMetrics = {
            temperature: [...device.metrics.temperature.slice(1), {
              timestamp: now,
              value: 20 + Math.random() * 10
            }],
            humidity: [...device.metrics.humidity.slice(1), {
              timestamp: now,
              value: 30 + Math.random() * 40
            }],
            pressure: [...device.metrics.pressure.slice(1), {
              timestamp: now,
              value: 995 + Math.random() * 20
            }],
            voltage: [...device.metrics.voltage.slice(1), {
              timestamp: now,
              value: 11.5 + Math.random() * 1
            }],
          };
          
          return {
            ...device,
            lastSeen: Math.random() > 0.8 ? device.lastSeen : now,
            metrics: updatedMetrics,
          };
        })
      );
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  return { devices, logs, isLoading };
}
