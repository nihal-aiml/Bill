import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const StatusNotification = ({ 
  notifications = [], 
  onNotificationClick, 
  onMarkAsRead, 
  onMarkAllAsRead,
  maxVisible = 3 
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unreadNotifications = notifications?.filter(n => !n?.read);
    setVisibleNotifications(unreadNotifications?.slice(0, maxVisible));
  }, [notifications, maxVisible]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return { name: 'CheckCircle', color: 'text-green-600' };
      case 'warning':
        return { name: 'AlertTriangle', color: 'text-orange-600' };
      case 'error':
        return { name: 'AlertCircle', color: 'text-red-600' };
      case 'info':
      default:
        return { name: 'Info', color: 'text-blue-500' };
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 shadow-green-100';
      case 'warning':
        return 'bg-orange-50 border-orange-200 shadow-orange-100';
      case 'error':
        return 'bg-red-50 border-red-200 shadow-red-100';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 shadow-blue-100';
    }
  };

  const handleNotificationClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    if (onMarkAsRead && !notification?.read) {
      onMarkAsRead(notification?.id);
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

  if (visibleNotifications?.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-dropdown space-y-3 max-w-sm">
      {visibleNotifications?.map((notification, index) => {
        const icon = getNotificationIcon(notification?.type);
        const bgClass = getNotificationBg(notification?.type);
        
        return (
          <div
            key={notification?.id}
            className={`${bgClass} border rounded-lg p-4 shadow-lg cursor-pointer civic-transition-fast hover:scale-[1.02] animate-slide-in backdrop-blur-sm`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-1 rounded-full ${notification?.type === 'success' ? 'bg-green-100' : notification?.type === 'warning' ? 'bg-orange-100' : notification?.type === 'error' ? 'bg-red-100' : 'bg-blue-100'}`}>
                <Icon 
                  name={icon?.name} 
                  size={18} 
                  className={`${icon?.color} flex-shrink-0`} 
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {notification?.title}
                    </p>
                    {notification?.message && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification?.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      {formatTimeAgo(notification?.timestamp)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e?.stopPropagation();
                      if (onMarkAsRead) {
                        onMarkAsRead(notification?.id);
                      }
                    }}
                    className="w-6 h-6 text-gray-400 hover:text-gray-600 civic-transition-fast ml-2"
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </div>
              </div>
            </div>
            {/* Enhanced progress bar for time-sensitive notifications */}
            {notification?.progress !== undefined && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span className="font-medium">Progress</span>
                  <span className="font-semibold">{notification?.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full civic-transition ${
                      notification?.type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      notification?.type === 'warning' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                      notification?.type === 'error'? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`}
                    style={{ width: `${notification?.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
      {/* Show more button with enhanced styling */}
      {notifications?.filter(n => !n?.read)?.length > maxVisible && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="civic-transition-fast bg-white/80 backdrop-blur-sm border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            {notifications?.filter(n => !n?.read)?.length - maxVisible} more notifications
          </Button>
        </div>
      )}
      {/* Mark all as read button with enhanced styling */}
      {notifications?.some(n => !n?.read) && (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            className="text-gray-500 hover:text-gray-700 civic-transition-fast bg-white/60 backdrop-blur-sm"
          >
            Mark all as read
          </Button>
        </div>
      )}
    </div>
  );
};

export default StatusNotification;