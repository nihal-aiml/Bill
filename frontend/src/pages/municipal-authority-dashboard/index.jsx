import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricsCard from './components/MetricsCard';
import ReportCard from './components/ReportCard';
import FilterPanel from './components/FilterPanel';
import ActivityFeed from './components/ActivityFeed';
import InteractiveMap from './components/InteractiveMap';
import BulkActionsToolbar from './components/BulkActionsToolbar';

const MunicipalAuthorityDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReports, setSelectedReports] = useState([]);
  const [filters, setFilters] = useState({});
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedMapReport, setSelectedMapReport] = useState(null);

  // Mock data
  const metricsData = [
    {
      title: "Total Reports",
      value: "1,247",
      change: "+12% from last month",
      changeType: "increase",
      icon: "FileText",
      color: "primary"
    },
    {
      title: "Pending Reviews",
      value: "89",
      change: "-5% from last week",
      changeType: "decrease",
      icon: "Clock",
      color: "warning"
    },
    {
      title: "Resolved Cases",
      value: "1,158",
      change: "+18% from last month",
      changeType: "increase",
      icon: "CheckCircle",
      color: "success"
    },
    {
      title: "Compliance Rate",
      value: "92.8%",
      change: "+2.1% from last month",
      changeType: "increase",
      icon: "TrendingUp",
      color: "success"
    }
  ];

  const mockReports = [
    {
      id: "RPT-2024-001",
      location: "MG Road, Connaught Place, New Delhi",
      violationType: "Oversized Billboard",
      priority: "high",
      status: "pending",
      submittedAt: "2024-08-23T10:30:00Z",
      imageUrl: "https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg",
      aiAnalysis: "Billboard dimensions exceed permitted size by 40%. Potential safety hazard detected.",
      assignedOfficer: null,
      coordinates: { lat: 28.6304, lng: 77.2177 }
    },
    {
      id: "RPT-2024-002",
      location: "Karol Bagh Market, Delhi",
      violationType: "Unauthorized Placement",
      priority: "medium",
      status: "investigating",
      submittedAt: "2024-08-22T14:15:00Z",
      imageUrl: "https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg",
      aiAnalysis: "Billboard placed without proper permits. Blocking traffic signage.",
      assignedOfficer: "Rajesh Kumar",
      coordinates: { lat: 28.6519, lng: 77.1909 }
    },
    {
      id: "RPT-2024-003",
      location: "Lajpat Nagar Central Market",
      violationType: "Structural Issue",
      priority: "high",
      status: "pending",
      submittedAt: "2024-08-22T09:45:00Z",
      imageUrl: "https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg",
      aiAnalysis: "Structural damage detected. Immediate attention required for public safety.",
      assignedOfficer: null,
      coordinates: { lat: 28.5677, lng: 77.2431 }
    },
    {
      id: "RPT-2024-004",
      location: "Chandni Chowk Main Road",
      violationType: "Expired Permit",
      priority: "low",
      status: "resolved",
      submittedAt: "2024-08-21T16:20:00Z",
      imageUrl: "https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg",
      aiAnalysis: "Permit expired 3 months ago. Billboard content needs verification.",
      assignedOfficer: "Priya Sharma",
      coordinates: { lat: 28.6506, lng: 77.2334 }
    }
  ];

  const mockActivities = [
    {
      type: "report_submitted",
      user: "Citizen User",
      action: "submitted a new report for",
      reportId: "RPT-2024-001",
      details: "Oversized billboard at MG Road",
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      type: "report_assigned",
      user: "Admin",
      action: "assigned",
      reportId: "RPT-2024-002",
      details: "Assigned to Rajesh Kumar for investigation",
      timestamp: new Date(Date.now() - 900000) // 15 minutes ago
    },
    {
      type: "status_updated",
      user: "Priya Sharma",
      action: "updated status of",
      reportId: "RPT-2024-004",
      details: "Status changed to resolved",
      timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
    },
    {
      type: "comment_added",
      user: "Amit Singh",
      action: "added a comment to",
      reportId: "RPT-2024-003",
      details: "Requested additional documentation",
      timestamp: new Date(Date.now() - 3600000) // 1 hour ago
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'pending', label: 'Pending Reports', icon: 'Clock' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  const handleReportSelect = (reportId) => {
    setSelectedReports(prev => 
      prev?.includes(reportId) 
        ? prev?.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    setSelectedReports(mockReports?.map(report => report?.id));
  };

  const handleClearSelection = () => {
    setSelectedReports([]);
  };

  const handleBulkAction = (actionData) => {
    console.log('Bulk action:', actionData);
    // Handle bulk actions here
    setSelectedReports([]);
  };

  const handleViewDetails = (report) => {
    console.log('View report details:', report);
    // Navigate to report details or open modal
  };

  const handleAssignReport = (report) => {
    console.log('Assign report:', report);
    // Open assignment modal
  };

  const handleUpdateStatus = (report, newStatus) => {
    console.log('Update status:', report?.id, newStatus);
    // Update report status
  };

  const handleMapReportClick = (report) => {
    setSelectedMapReport(report);
  };

  const handleNotificationClick = () => {
    console.log('Notification clicked');
    // Handle notification click
  };

  const filteredReports = mockReports?.filter(report => {
    if (filters?.search && !report?.location?.toLowerCase()?.includes(filters?.search?.toLowerCase()) && 
        !report?.id?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
      return false;
    }
    if (filters?.status && filters?.status !== 'all' && report?.status !== filters?.status) {
      return false;
    }
    if (filters?.priority && filters?.priority !== 'all' && report?.priority !== filters?.priority) {
      return false;
    }
    if (filters?.violationType && filters?.violationType !== 'all' && report?.violationType !== filters?.violationType) {
      return false;
    }
    return true;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricsData?.map((metric, index) => (
                <MetricsCard key={index} {...metric} />
              ))}
            </div>
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Interactive Map */}
              <div className="lg:col-span-2">
                <InteractiveMap 
                  reports={mockReports}
                  onReportClick={handleMapReportClick}
                  selectedReport={selectedMapReport}
                />
              </div>

              {/* Activity Feed */}
              <div>
                <ActivityFeed activities={mockActivities} />
              </div>
            </div>
            {/* Recent Reports */}
            <div className="bg-card border border-border rounded-civic-card p-6 civic-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Reports</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('pending')}
                  iconName="ArrowRight"
                  iconPosition="right"
                  iconSize={16}
                >
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockReports?.slice(0, 4)?.map(report => (
                  <ReportCard
                    key={report?.id}
                    report={report}
                    onViewDetails={handleViewDetails}
                    onAssign={handleAssignReport}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="space-y-6">
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={() => setFilters({})}
              resultCount={filteredReports?.length}
              isExpanded={isFilterExpanded}
              onToggleExpanded={() => setIsFilterExpanded(!isFilterExpanded)}
            />
            <BulkActionsToolbar
              selectedReports={selectedReports}
              onBulkAction={handleBulkAction}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              totalReports={filteredReports?.length}
            />
            <div className="bg-card border border-border rounded-civic-card civic-shadow">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Pending Reports</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredReports?.length} reports requiring attention
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {filteredReports?.map(report => (
                    <div key={report?.id} className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedReports?.includes(report?.id)}
                        onChange={() => handleReportSelect(report?.id)}
                        className="mt-2 w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <div className="flex-1">
                        <ReportCard
                          report={report}
                          onViewDetails={handleViewDetails}
                          onAssign={handleAssignReport}
                          onUpdateStatus={handleUpdateStatus}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {filteredReports?.length === 0 && (
                  <div className="text-center py-12">
                    <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No reports found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or check back later for new reports.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-civic-card p-6 civic-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Analytics Dashboard</h3>
                <Button
                  variant="outline"
                  onClick={() => navigate('/analytics-compliance-reporting')}
                  iconName="ExternalLink"
                  iconPosition="right"
                  iconSize={16}
                >
                  View Full Analytics
                </Button>
              </div>
              
              <div className="text-center py-12">
                <Icon name="BarChart3" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Detailed Analytics Available</h3>
                <p className="text-muted-foreground mb-4">
                  Access comprehensive analytics and compliance reporting tools.
                </p>
                <Button
                  variant="default"
                  onClick={() => navigate('/analytics-compliance-reporting')}
                  iconName="ArrowRight"
                  iconPosition="right"
                  iconSize={16}
                >
                  Go to Analytics
                </Button>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-civic-card p-6 civic-shadow">
              <h3 className="text-lg font-semibold text-foreground mb-4">Dashboard Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Notification Preferences</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary border-border rounded" />
                      <span className="text-sm text-foreground">New report submissions</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary border-border rounded" />
                      <span className="text-sm text-foreground">Status updates</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="w-4 h-4 text-primary border-border rounded" />
                      <span className="text-sm text-foreground">Weekly summary reports</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Display Options</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary border-border rounded" />
                      <span className="text-sm text-foreground">Show map clusters</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary border-border rounded" />
                      <span className="text-sm text-foreground">Auto-refresh data</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="municipal" 
        notificationCount={3} 
        onNotificationClick={handleNotificationClick}
      />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Municipal Authority Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Monitor and manage billboard compliance reports across the city
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/analytics-compliance-reporting')}
                  iconName="BarChart3"
                  iconPosition="left"
                  iconSize={16}
                >
                  Analytics
                </Button>
                
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  New Assignment
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border mb-8">
            <nav className="flex space-x-8">
              {tabs?.map(tab => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm civic-transition ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default MunicipalAuthorityDashboard;