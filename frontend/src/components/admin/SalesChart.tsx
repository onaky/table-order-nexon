import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TableDashboard } from '@/types';

interface SalesChartProps {
  tables: TableDashboard[];
}

export default function SalesChart({ tables }: SalesChartProps) {
  const [collapsed, setCollapsed] = useState(false);

  const chartData = tables
    .filter((t) => t.hasActiveSession)
    .map((t) => ({
      name: `T${t.tableNo}`,
      매출: t.totalAmount,
    }));

  const totalSales = tables.reduce((sum, t) => sum + t.totalAmount, 0);

  const colors = ['#38bdf8', '#818cf8', '#a78bfa', '#f472b6', '#fb923c', '#34d399'];

  return (
    <div className="card" data-testid="sales-chart">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-gray-400">오늘 매출</h3>
          <p className="text-xl font-bold text-white">₩{totalSales.toLocaleString()}</p>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          {collapsed ? '펼치기' : '접기'}
        </button>
      </div>

      {!collapsed && chartData.length > 0 && (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: number) => [`₩${value.toLocaleString()}`, '매출']}
              />
              <Bar dataKey="매출" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {!collapsed && chartData.length === 0 && (
        <p className="text-center text-gray-600 text-sm py-4">활성 테이블이 없습니다.</p>
      )}
    </div>
  );
}
