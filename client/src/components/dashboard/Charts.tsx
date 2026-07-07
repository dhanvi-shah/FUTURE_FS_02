import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '../ui/Card';
import { CHART_COLORS } from '../../constants';
import type { ChartDataPoint, MonthlyTrendPoint } from '../../types';

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

interface StatusPieChartProps {
  data: ChartDataPoint[];
}

export const StatusPieChart = ({ data }: StatusPieChartProps) => (
  <Card delay={0.3}>
    <h3 className="text-sm font-semibold text-text-primary mb-4">Leads by Status</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            animationBegin={0}
            animationDuration={1200}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span className="text-text-secondary text-xs">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

interface SourceBarChartProps {
  data: ChartDataPoint[];
}

export const SourceBarChart = ({ data }: SourceBarChartProps) => (
  <Card delay={0.4}>
    <h3 className="text-sm font-semibold text-text-primary mb-4">Leads by Source</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name="Leads" radius={[8, 8, 0, 0]} animationDuration={1200}>
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

interface TrendAreaChartProps {
  data: MonthlyTrendPoint[];
}

export const TrendAreaChart = ({ data }: TrendAreaChartProps) => (
  <Card delay={0.5} className="col-span-full">
    <h3 className="text-sm font-semibold text-text-primary mb-4">Monthly Growth Trend</h3>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="convertedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(value) => <span className="text-text-secondary text-xs">{value}</span>} />
          <Area
            type="monotone"
            dataKey="leads"
            name="Total Leads"
            stroke="#8B5CF6"
            fill="url(#leadsGradient)"
            strokeWidth={2}
            animationDuration={1500}
          />
          <Area
            type="monotone"
            dataKey="converted"
            name="Converted"
            stroke="#06B6D4"
            fill="url(#convertedGradient)"
            strokeWidth={2}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </Card>
);
