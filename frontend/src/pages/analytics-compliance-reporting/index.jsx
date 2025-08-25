import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StatusNotification from '../../components/ui/StatusNotification';
import MetricCard from './components/MetricCard';
import FilterBar from './components/FilterBar';
import ViolationMap from './components/ViolationMap';
import TrendChart from './components/TrendChart';
import ViolationBreakdown from './components/ViolationBreakdown';
import PerformanceMetrics from './components/PerformanceMetrics';
import ExportModal from './components/ExportModal';
import ScheduleModal from './components/ScheduleModal';

const AnalyticsComplianceReporting = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    district: 'all',
    violationType: 'all',
    status: 'all'
  });
  const [notifications, setNotifications] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize notifications
    const initialNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Report Generated Successfully',
        message: 'Monthly compliance report has been generated and sent to stakeholders.',
        timestamp: new Date(Date.now() - 300000),
        read: false
      },
      {
        id: 2,
        type: 'warning',
        title: 'High Violation Area Detected',
        message: 'Connaught Place showing increased violation activity.',
        timestamp: new Date(Date.now() - 900000),
        read: false
      }
    ];
    setNotifications(initialNotifications);
  }, []);

  const breadcrumbItems = [
    { label: 'Municipal Dashboard', path: '/municipal-authority-dashboard' },
    { label: 'Analytics & Compliance', path: '/analytics-compliance-reporting' }
  ];

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = (exportConfig) => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      const newNotification = {
        id: Date.now(),
        type: 'success',
        title: 'Export Completed',
        message: `${exportConfig?.format?.toUpperCase()} report has been generated successfully.`,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
    }, 2000);
  };

  const handleScheduleReport = (scheduleConfig) => {
    const newNotification = {
      id: Date.now(),
      type: 'info',
      title: 'Report Scheduled',
      message: `${scheduleConfig?.reportName} scheduled for ${scheduleConfig?.frequency} delivery.`,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleLocationClick = (violation) => {
    console.log('Location clicked:', violation);
  };

  const handleViewOfficerDetails = () => {
    // Navigate to detailed officer performance page
    console.log('Navigate to officer details');
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="municipal" 
        notificationCount={notifications?.filter(n => !n?.read)?.length}
        onNotificationClick={() => console.log('Header notification clicked')}
      />
      <StatusNotification
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        maxVisible={3}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-foreground">Analytics & Compliance Reporting</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive insights into billboard compliance trends and enforcement effectiveness
              </p>
            </div>
          </div>

          <FilterBar
            onFiltersChange={handleFiltersChange}
            onExport={() => setShowExportModal(true)}
            onScheduleReport={() => setShowScheduleModal(true)}
          />

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-muted-foreground">Loading analytics data...</span>
              </div>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Violations"
              value="1,247"
              change="+12.5%"
              changeType="negative"
              icon="AlertTriangle"
              description="Reported in selected period"
            />
            <MetricCard
              title="Resolution Rate"
              value="87.3%"
              change="+5.2%"
              changeType="positive"
              icon="CheckCircle"
              description="Cases resolved successfully"
            />
            <MetricCard
              title="Avg Response Time"
              value="2.4 hrs"
              change="-18 min"
              changeType="positive"
              icon="Clock"
              description="Time to first response"
            />
            <MetricCard
              title="Compliance Improvement"
              value="23.8%"
              change="+8.1%"
              changeType="positive"
              icon="TrendingUp"
              description="Overall compliance increase"
            />
          </div>

          {/* Charts and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ViolationMap
              violations={[]}
              onLocationClick={handleLocationClick}
            />
            <TrendChart
              title="Violation Trends"
              data={[]}
              type="line"
              height={350}
            />
          </div>

          {/* Breakdown and Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ViolationBreakdown
              title="Violation Categories"
              data={[]}
            />
            <PerformanceMetrics
              onViewDetails={handleViewOfficerDetails}
            />
          </div>

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 gap-6">
            <TrendChart
              title="Monthly Compliance Comparison"
              data={[]}
              type="bar"
              height={300}
            />
          </div>
        </div>
      </main>
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleReport}
      />
    </div>
  );
};

export default AnalyticsComplianceReporting;