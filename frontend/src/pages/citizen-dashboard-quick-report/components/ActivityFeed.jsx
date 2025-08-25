import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'report_submitted':
        return { name: 'FileText', color: 'text-primary' };
      case 'report_reviewed':
        return { name: 'Eye', color: 'text-warning' };
      case 'report_resolved':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'achievement_earned':
        return { name: 'Award', color: 'text-secondary' };
      case 'system_update':
        return { name: 'Bell', color: 'text-muted-foreground' };
      default:
        return { name: 'Info', color: 'text-muted-foreground' };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-civic-card">
      <div className="p-4 border-b border-border">
        <h3 className="font-medium text-foreground flex items-center space-x-2">
          <Icon name="Activity" size={20} className="text-primary" />
          <span>Recent Activity</span>
        </h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {activities?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="Activity" size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {activities?.map((activity, index) => {
              const icon = getActivityIcon(activity?.type);
              
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon name={icon?.name} size={16} className={icon?.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity?.title}</p>
                    {activity?.description && (
                      <p className="text-xs text-muted-foreground mt-1">{activity?.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimeAgo(activity?.timestamp)}
                    </p>
                  </div>
                  {activity?.actionable && (
                    <button className="text-primary text-xs hover:underline">
                      View
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {activities?.length > 0 && (
        <div className="p-4 border-t border-border text-center">
          <button className="text-primary text-sm hover:underline">
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;