import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsChartProps {
  data: Array<{ date: string; points: number }>;
}

const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
  return (
    <div className="h-64 sm:h-80 w-full min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={256}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.7}/>
              <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#0f172a', fontSize: 11, fontWeight: 900}} 
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{
              borderRadius: '16px', 
              border: '3px solid #0f766e', 
              backgroundColor: '#ffffff',
              padding: '12px',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#0f766e', fontWeight: '900', fontSize: '12px' }}
            labelStyle={{fontWeight: '900', color: '#0f172a', marginBottom: '6px', fontSize: '13px'}}
          />
          <Area type="monotone" dataKey="points" stroke="#0f766e" strokeWidth={5} fillOpacity={1} fill="url(#colorPoints)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;

