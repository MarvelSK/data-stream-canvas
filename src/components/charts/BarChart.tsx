
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title?: string;
  color?: string;
}

export function BarChart({ 
  data, 
  xKey, 
  yKey, 
  title = "Bar Chart", 
  color = "#3b82f6" 
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart
        data={data}
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
        <Bar 
          dataKey={yKey} 
          fill={color} 
          name={title}
          radius={[4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
