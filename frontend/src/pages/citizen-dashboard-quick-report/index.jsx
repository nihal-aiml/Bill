import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import StatusNotification from '../../components/ui/StatusNotification';
import Breadcrumb from '../../components/ui/Breadcrumb';
import HeroSection from './components/HeroSection';
import StatusOverview from './components/StatusOverview';
import RecentReports from './components/RecentReports';
import QuickActions from './components/QuickActions';
import MapWidget from './components/MapWidget';
import AchievementSection from './components/AchievementSection';
import ActivityFeed from './components/ActivityFeed';

const CitizenDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for dashboard
  const userStats = {
    totalReports: 12,
    resolvedReports: 8,
    impactScore: 85,
    accuracyRate: 92
  };

  const reportStats = {
    submitted: 12,
    underReview: 3,
    resolved: 8
  };

  const recentReports = [
    {
      id: "RPT001",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      location: "MG Road, Connaught Place, New Delhi",
      submittedAt: "2025-01-20T10:30:00Z",
      status: "under_review",
      violationType: "Oversized Billboard"
    },
    {
      id: "RPT002", 
      image: "https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?w=400&h=300&fit=crop",
      location: "Sector 18, Noida, Uttar Pradesh",
      submittedAt: "2025-01-18T14:15:00Z",
      status: "resolved",
      violationType: "Unauthorized Placement"
    },
    {
      id: "RPT003",
      image: "https://images.pixabay.com/photo/2016/11/29/05/45/advertising-1867417_1280.jpg?w=400&h=300&fit=crop",
      location: "Brigade Road, Bangalore, Karnataka",
      submittedAt: "2025-01-15T09:45:00Z",
      status: "submitted",
      violationType: "Traffic Obstruction"
    }
  ];

  const nearbyReports = [
    { id: 1, lat: 28.6129, lng: 77.2295, status: 'resolved', priority: 'low' },
    { id: 2, lat: 28.6149, lng: 77.2065, status: 'under_review', priority: 'medium' },
    { id: 3, lat: 28.6159, lng: 77.2090, status: 'submitted', priority: 'high' },
    { id: 4, lat: 28.6119, lng: 77.2100, status: 'resolved', priority: 'low' },
    { id: 5, lat: 28.6139, lng: 77.2080, status: 'under_review', priority: 'medium' }
  ];

  const achievements = ['first_report', 'civic_hero'];

  const activities = [
    {
      type: 'report_resolved',
      title: 'Report RPT002 has been resolved',
      description: 'Billboard removed from Sector 18, Noida',
      timestamp: new Date(Date.now() - 1800000),
      actionable: true
    },
    {
      type: 'achievement_earned',
      title: 'Achievement unlocked: Civic Hero',
      description: 'You have submitted 10+ reports',
      timestamp: new Date(Date.now() - 3600000),
      actionable: false
    },
    {
      type: 'report_reviewed',
      title: 'Report RPT001 is under review',
      description: 'Municipal authority is reviewing your submission',
      timestamp: new Date(Date.now() - 7200000),
      actionable: true
    },
    {
      type: 'system_update',
      title: 'New AI detection features available',
      description: 'Enhanced billboard detection accuracy',
      timestamp: new Date(Date.now() - 86400000),
      actionable: false
    }
  ];

  const mockNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Report Resolved',
      message: 'Your billboard report RPT002 has been successfully resolved.',
      timestamp: new Date(Date.now() - 900000),
      read: false,
      progress: 100
    },
    {
      id: 2,
      type: 'info',
      title: 'Under Review',
      message: 'Report RPT001 is currently being reviewed by authorities.',
      timestamp: new Date(Date.now() - 1800000),
      read: false,
      progress: 65
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(n => n?.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev?.map(n => ({ ...n, read: true })));
  };

  const handlePullToRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const breadcrumbItems = [
    { label: 'Citizen Dashboard', path: '/citizen-dashboard-quick-report' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="citizen" 
        notificationCount={notifications?.filter(n => !n?.read)?.length}
        onNotificationClick={() => console.log('Header notification clicked')}
      />
      <StatusNotification
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        maxVisible={2}
      />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          
          {/* Pull to refresh indicator */}
          {isRefreshing && (
            <div className="text-center mb-4">
              <div className="inline-flex items-center space-x-2 text-primary">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Refreshing...</span>
              </div>
            </div>
          )}

          {/* Mobile-first layout */}
          <div className="lg:hidden space-y-6">
            <HeroSection />
            <StatusOverview stats={reportStats} />
            <QuickActions />
            <RecentReports reports={recentReports} />
            <MapWidget nearbyReports={nearbyReports} />
            <AchievementSection achievements={achievements} userStats={userStats} />
          </div>

          {/* Desktop three-column layout */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
            {/* Left sidebar - Quick actions (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              <QuickActions />
              <ActivityFeed activities={activities} />
            </div>

            {/* Main content area (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <HeroSection />
              <StatusOverview stats={reportStats} />
              <RecentReports reports={recentReports} />
              <MapWidget nearbyReports={nearbyReports} />
            </div>

            {/* Right sidebar - Achievements and activity (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              <AchievementSection achievements={achievements} userStats={userStats} />
            </div>
          </div>

          {/* Pull to refresh gesture area */}
          <div 
            className="fixed top-16 left-0 right-0 h-20 z-10 pointer-events-none"
            onTouchStart={(e) => {
              const startY = e?.touches?.[0]?.clientY;
              const handleTouchMove = (e) => {
                const currentY = e?.touches?.[0]?.clientY;
                const diff = currentY - startY;
                if (diff > 100 && window.scrollY === 0) {
                  handlePullToRefresh();
                  document.removeEventListener('touchmove', handleTouchMove);
                }
              };
              document.addEventListener('touchmove', handleTouchMove);
              document.addEventListener('touchend', () => {
                document.removeEventListener('touchmove', handleTouchMove);
              }, { once: true });
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default CitizenDashboard;