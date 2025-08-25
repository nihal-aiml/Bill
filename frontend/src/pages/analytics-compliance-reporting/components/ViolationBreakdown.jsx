import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ViolationBreakdown = ({ title = "Violation Categories", data = [] }) => {
  const [viewType, setViewType] = useState('pie');

  const mockData = [
    { category: 'Size Violations', count: 245, percentage: 35, color: '#1E40AF' },
    { category: 'Placement Violations', count: 189, percentage: 27, color: '#059669' },
    { category: 'Permit Violations', count: 156, percentage: 22, color: '#F59E0B' },
    { category: 'Safety Violations', count: 78, percentage: 11, color: '#DC2626' },
    { category: 'Content Violations', count: 35, percentage: 5, color: '#7C3AED' }
  ];

  const COLORS = mockData?.map(item => item?.color);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-civic p-3 civic-shadow">
          <p className="text-sm font-medium text-foreground">{data?.category}</p>
          <p className="text-sm text-muted-foreground">
            Count: <strong className="text-foreground">{data?.count}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: <strong className="text-foreground">{data?.percentage}%</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderPieChart = () => (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={mockData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ category, percentage }) => `${percentage}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="count"
        >
          {mockData?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer>
      <BarChart data={mockData} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          type="number" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          type="category" 
          dataKey="category" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          width={120}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="count" 
          fill="var(--color-primary)" 
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="bg-card border border-border rounded-civic-card civic-shadow">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="PieChart" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewType === 'pie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('pie')}
              iconName="PieChart"
              iconPosition="left"
              iconSize={14}
            >
              Pie Chart
            </Button>
            <Button
              variant={viewType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('bar')}
              iconName="BarChart3"
              iconPosition="left"
              iconSize={14}
            >
              Bar Chart
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2">
            <div style={{ width: '100%', height: 300 }}>
              {viewType === 'pie' ? renderPieChart() : renderBarChart()}
            </div>
          </div>
          
          {/* Legend and Stats */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Category Breakdown</h4>
              <div className="space-y-3">
                {mockData?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item?.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item?.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{item?.count}</p>
                      <p className="text-xs text-muted-foreground">{item?.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Quick Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Violations</span>
                  <span className="text-sm font-medium text-foreground">
                    {mockData?.reduce((sum, item) => sum + item?.count, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Most Common</span>
                  <span className="text-sm font-medium text-foreground">Size Violations</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Least Common</span>
                  <span className="text-sm font-medium text-foreground">Content Violations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationBreakdown;