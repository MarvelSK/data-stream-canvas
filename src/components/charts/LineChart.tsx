
import { DataPoint } from "@/hooks/useFakeData";
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface LineChartProps {
  data: DataPoint[];
  title?: string;
  xKey?: string;
  yKey?: string;
  color?: string;
}

export function LineChart({ 
  data, 
  title = "Line Chart", 
  xKey = "timestamp", 
  yKey = "value", 
  color = "#3b82f6" 
}: LineChartProps) {
  const formattedData = data.map(point => ({
    [xKey]: point.timestamp instanceof Date 
      ? point.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      : point.timestamp,
    [yKey]: point.value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart 
        data={formattedData}
        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey={xKey} 
          tick={{ fill: 'var(--muted-foreground)' }}
        />
        <YAxis 
          tick={{ fill: 'var(--muted-foreground)' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--card)', 
            borderColor: 'var(--border)' 
          }}
          labelStyle={{ color: 'var(--muted-foreground)' }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={yKey} 
          stroke={color}
          name={title}
          strokeWidth={2}
          activeDot={{ r: 6 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
