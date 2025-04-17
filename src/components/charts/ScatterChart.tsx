
import { ResponsiveContainer, ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ZAxis } from "recharts";

interface ScatterChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  zKey?: string;
  title?: string;
  color?: string;
}

export function ScatterChart({ 
  data, 
  xKey, 
  yKey, 
  zKey, 
  title = "Scatter Chart", 
  color = "#3b82f6" 
}: ScatterChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsScatterChart
        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey={xKey} 
          name={xKey}
          tick={{ fill: 'var(--muted-foreground)' }}
          domain={['auto', 'auto']}
        />
        <YAxis 
          dataKey={yKey} 
          name={yKey}
          tick={{ fill: 'var(--muted-foreground)' }}
          domain={['auto', 'auto']}
        />
        {zKey && (
          <ZAxis dataKey={zKey} range={[60, 200]} name={zKey} />
        )}
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{ 
            backgroundColor: 'var(--card)', 
            borderColor: 'var(--border)' 
          }}
          labelStyle={{ color: 'var(--muted-foreground)' }}
        />
        <Legend />
        <Scatter 
          name={title} 
          data={data} 
          fill={color}
        />
      </RechartsScatterChart>
    </ResponsiveContainer>
  );
}
