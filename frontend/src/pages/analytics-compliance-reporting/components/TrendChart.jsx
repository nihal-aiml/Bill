import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrendChart = ({ title, data = [], type = 'line', height = 300 }) => {
  const [chartType, setChartType] = useState(type);
  const [timeframe, setTimeframe] = useState('monthly');

  const mockData = [
    { period: 'Jan 2024', violations: 145, resolved: 120, pending: 25 },
    { period: 'Feb 2024', violations: 132, resolved: 115, pending: 17 },
    { period: 'Mar 2024', violations: 158, resolved: 140, pending: 18 },
    { period: 'Apr 2024', violations: 167, resolved: 145, pending: 22 },
    { period: 'May 2024', violations: 142, resolved: 128, pending: 14 },
    { period: 'Jun 2024', violations: 156, resolved: 142, pending: 14 },
    { period: 'Jul 2024', violations: 134, resolved: 125, pending: 9 },
    { period: 'Aug 2024', violations: 148, resolved: 135, pending: 13 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-civic p-3 civic-shadow">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry?.name}: <strong className="text-foreground">{entry?.value}</strong>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="period" 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="violations" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="resolved" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    }

    return (
      <LineChart data={mockData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="period" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="violations" 
          stroke="var(--color-primary)" 
          strokeWidth={3}
          dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="resolved" 
          stroke="var(--color-success)" 
          strokeWidth={3}
          dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="pending" 
          stroke="var(--color-warning)" 
          strokeWidth={3}
          dot={{ fill: 'var(--color-warning)', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: 'var(--color-warning)', strokeWidth: 2 }}
        />
      </LineChart>
    );
  };

  return (
    <div className="bg-card border border-border rounded-civic-card civic-shadow">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={timeframe === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={timeframe === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={timeframe === 'quarterly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe('quarterly')}
            >
              Quarterly
            </Button>
            
            <div className="w-px h-6 bg-border mx-2" />
            
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              iconName="TrendingUp"
              iconPosition="left"
              iconSize={14}
            >
              Line
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
              iconName="BarChart3"
              iconPosition="left"
              iconSize={14}
            >
              Bar
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div style={{ width: '100%', height: height }}>
          <ResponsiveContainer>
            {renderChart()}
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Total Violations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm text-muted-foreground">Resolved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;