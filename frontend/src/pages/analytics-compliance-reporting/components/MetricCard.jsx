import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  description,
  className = '' 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-civic-card p-6 civic-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {icon && (
              <div className="w-8 h-8 bg-primary/10 rounded-civic flex items-center justify-center">
                <Icon name={icon} size={16} className="text-primary" />
              </div>
            )}
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            
            {change && (
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getChangeIcon()} 
                  size={14} 
                  className={getChangeColor()} 
                />
                <span className={`text-sm font-medium ${getChangeColor()}`}>
                  {change}
                </span>
                <span className="text-sm text-muted-foreground">vs last period</span>
              </div>
            )}
            
            {description && (
              <p className="text-xs text-muted-foreground mt-2">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;