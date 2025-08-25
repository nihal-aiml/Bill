import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole = 'citizen', notificationCount = 0, onNotificationClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: userRole === 'citizen' ? '/citizen-dashboard-quick-report' : '/municipal-authority-dashboard',
      icon: 'LayoutDashboard',
      visible: true,
      primary: true
    },
    {
      label: 'Report Billboard',
      path: '/camera-capture-ai-detection',
      icon: 'Camera',
      visible: userRole === 'citizen',
      primary: true
    },
    {
      label: 'Submit Report',
      path: '/report-submission-documentation',
      icon: 'FileText',
      visible: userRole === 'citizen',
      primary: true
    },
    {
      label: 'Analytics',
      path: '/analytics-compliance-reporting',
      icon: 'BarChart3',
      visible: userRole === 'municipal',
      primary: true
    },
    {
      label: 'Account',
      path: '/user-registration-login',
      icon: 'User',
      visible: true,
      primary: false
    }
  ];

  const primaryItems = navigationItems?.filter(item => item?.visible && item?.primary);
  const secondaryItems = navigationItems?.filter(item => item?.visible && !item?.primary);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event?.target?.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-navigation">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Eye" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">Billboard Monitor</h1>
              <p className="text-xs text-muted-foreground">Civic Engagement Platform</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className="civic-transition-fast"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative notification-dropdown">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="relative civic-transition-fast"
            >
              <Icon name="Bell" size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-civic-card civic-shadow-lg z-dropdown animate-scale-in">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-popover-foreground">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notificationCount > 0 ? (
                    <div className="p-4 space-y-3">
                      <div className="flex items-start space-x-3 p-2 rounded-civic hover:bg-muted civic-transition-fast">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-popover-foreground">New billboard violation reported</p>
                          <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      <Icon name="Bell" size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Secondary Actions Dropdown */}
          {secondaryItems?.length > 0 && (
            <div className="hidden lg:block relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(secondaryItems?.[0]?.path)}
                iconName={secondaryItems?.[0]?.icon}
                iconPosition="left"
                iconSize={16}
                className="civic-transition-fast"
              >
                {secondaryItems?.[0]?.label}
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden civic-transition-fast"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-slide-in">
          <nav className="px-4 py-4 space-y-2">
            {[...primaryItems, ...secondaryItems]?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? "default" : "ghost"}
                fullWidth
                onClick={() => handleNavigation(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                iconSize={16}
                className="justify-start civic-transition-fast"
              >
                {item?.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;