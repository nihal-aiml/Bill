import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusOverview = ({ stats }) => {
  const statusItems = [
    {
      label: 'Submitted',
      count: stats?.submitted,
      icon: 'FileText',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      label: 'Under Review',
      count: stats?.underReview,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    {
      label: 'Resolved',
      count: stats?.resolved,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Your Report Status</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statusItems?.map((item, index) => (
          <div
            key={index}
            className={`${item?.bgColor} ${item?.borderColor} border rounded-civic-card p-4 civic-transition-fast hover:scale-105`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${item?.bgColor} rounded-civic flex items-center justify-center`}>
                <Icon name={item?.icon} size={20} className={item?.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{item?.count}</p>
                <p className="text-sm text-muted-foreground">{item?.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusOverview;