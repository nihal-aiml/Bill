import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'report_submitted':
        return { name: 'FileText', color: 'text-primary' };
      case 'report_assigned':
        return { name: 'UserPlus', color: 'text-warning' };
      case 'status_updated':
        return { name: 'RefreshCw', color: 'text-success' };
      case 'comment_added':
        return { name: 'MessageCircle', color: 'text-primary' };
      case 'report_resolved':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'report_rejected':
        return { name: 'XCircle', color: 'text-error' };
      default:
        return { name: 'Bell', color: 'text-muted-foreground' };
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
    <div className="bg-card border border-border rounded-civic-card p-4 civic-shadow">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Activity" size={20} className="text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.length > 0 ? (
          activities?.map((activity, index) => {
            const icon = getActivityIcon(activity?.type);
            
            return (
              <div key={index} className="flex items-start space-x-3 p-2 rounded-civic hover:bg-muted/50 civic-transition">
                <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${icon?.color}`}>
                  <Icon name={icon?.name} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity?.user}</span>
                    {' '}
                    <span className="text-muted-foreground">{activity?.action}</span>
                    {activity?.reportId && (
                      <span className="font-medium text-primary">
                        {' '}Report #{activity?.reportId}
                      </span>
                    )}
                  </p>
                  
                  {activity?.details && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity?.details}
                    </p>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(activity?.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Icon name="Activity" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;