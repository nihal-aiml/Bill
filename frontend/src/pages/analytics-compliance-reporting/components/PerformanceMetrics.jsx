import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceMetrics = ({ onViewDetails }) => {
  const performanceData = [
    {
      officer: "Rajesh Kumar",
      id: "OFF001",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      totalCases: 45,
      resolved: 38,
      pending: 7,
      avgResponseTime: "2.3 hours",
      satisfactionScore: 4.6,
      efficiency: 84
    },
    {
      officer: "Priya Sharma",
      id: "OFF002", 
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      totalCases: 52,
      resolved: 47,
      pending: 5,
      avgResponseTime: "1.8 hours",
      satisfactionScore: 4.8,
      efficiency: 90
    },
    {
      officer: "Amit Singh",
      id: "OFF003",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      totalCases: 38,
      resolved: 32,
      pending: 6,
      avgResponseTime: "3.1 hours",
      satisfactionScore: 4.2,
      efficiency: 78
    },
    {
      officer: "Sunita Patel",
      id: "OFF004",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      totalCases: 41,
      resolved: 36,
      pending: 5,
      avgResponseTime: "2.7 hours",
      satisfactionScore: 4.5,
      efficiency: 88
    }
  ];

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 85) return 'text-success';
    if (efficiency >= 70) return 'text-warning';
    return 'text-error';
  };

  const getEfficiencyBg = (efficiency) => {
    if (efficiency >= 85) return 'bg-success/10';
    if (efficiency >= 70) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={12}
        className={index < Math.floor(rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  return (
    <div className="bg-card border border-border rounded-civic-card civic-shadow">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Officer Performance</h3>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            iconName="ExternalLink"
            iconPosition="right"
            iconSize={14}
          >
            View All Officers
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {performanceData?.map((officer, index) => (
            <div key={officer?.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-civic civic-transition hover:bg-muted/50">
              <div className="flex-shrink-0">
                <img
                  src={officer?.avatar}
                  alt={officer?.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-border"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{officer?.officer}</h4>
                    <p className="text-xs text-muted-foreground">{officer?.id}</p>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-civic text-xs font-medium ${getEfficiencyBg(officer?.efficiency)} ${getEfficiencyColor(officer?.efficiency)}`}>
                    {officer?.efficiency}% Efficiency
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Total Cases</p>
                    <p className="font-medium text-foreground">{officer?.totalCases}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Resolved</p>
                    <p className="font-medium text-success">{officer?.resolved}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Avg Response</p>
                    <p className="font-medium text-foreground">{officer?.avgResponseTime}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Satisfaction</p>
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-0.5">
                        {renderStars(officer?.satisfactionScore)}
                      </div>
                      <span className="font-medium text-foreground">{officer?.satisfactionScore}</span>
                    </div>
                  </div>
                </div>
                
                {/* Progress bar for resolved cases */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Resolution Rate</span>
                    <span>{Math.round((officer?.resolved / officer?.totalCases) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className="h-1.5 bg-success rounded-full civic-transition"
                      style={{ width: `${(officer?.resolved / officer?.totalCases) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">4.5</p>
              <p className="text-sm text-muted-foreground">Avg Satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">2.5h</p>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">85%</p>
              <p className="text-sm text-muted-foreground">Overall Efficiency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;