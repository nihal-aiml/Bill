import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecentReports = ({ reports }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const statusConfig = {
      'submitted': { color: 'bg-primary text-primary-foreground', icon: 'FileText' },
      'under_review': { color: 'bg-warning text-warning-foreground', icon: 'Clock' },
      'resolved': { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      'rejected': { color: 'bg-error text-error-foreground', icon: 'XCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.['submitted'];
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{status?.replace('_', ' ')}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleViewAllReports = () => {
    navigate('/report-submission-documentation');
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Reports</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewAllReports}
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={16}
        >
          View All
        </Button>
      </div>
      {reports?.length === 0 ? (
        <div className="bg-card border border-border rounded-civic-card p-8 text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Reports Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start making a difference by reporting your first billboard violation.
          </p>
          <Button
            variant="default"
            onClick={() => navigate('/camera-capture-ai-detection')}
            iconName="Camera"
            iconPosition="left"
          >
            Report Now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports?.map((report) => (
            <div
              key={report?.id}
              className="bg-card border border-border rounded-civic-card overflow-hidden civic-shadow hover:civic-shadow-lg civic-transition-fast"
            >
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={report?.image}
                  alt={`Billboard report ${report?.id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(report?.status)}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start space-x-2 mb-2">
                  <Icon name="MapPin" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground line-clamp-2">{report?.location}</p>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="Calendar" size={16} className="text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{formatDate(report?.submittedAt)}</p>
                </div>

                {report?.violationType && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="AlertTriangle" size={16} className="text-warning" />
                    <p className="text-sm text-foreground font-medium">{report?.violationType}</p>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  iconName="Eye"
                  iconPosition="left"
                  iconSize={16}
                  className="civic-transition-fast"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentReports;