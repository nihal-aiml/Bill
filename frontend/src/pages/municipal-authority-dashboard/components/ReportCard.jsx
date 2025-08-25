import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ReportCard = ({ report, onViewDetails, onAssign, onUpdateStatus }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error text-error-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'investigating':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'resolved':
        return 'bg-success/10 text-success border-success/20';
      case 'rejected':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-civic-card p-4 civic-shadow hover:civic-shadow-lg civic-transition">
      <div className="flex items-start space-x-4">
        {/* Report Image */}
        <div className="w-20 h-20 rounded-civic overflow-hidden flex-shrink-0">
          <Image 
            src={report?.imageUrl} 
            alt={`Billboard violation at ${report?.location}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Report Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-foreground text-sm">
                Report #{report?.id}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                <Icon name="MapPin" size={12} className="inline mr-1" />
                {report?.location}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report?.priority)}`}>
                {report?.priority}
              </span>
              <span className={`px-2 py-1 rounded-civic text-xs font-medium border ${getStatusColor(report?.status)}`}>
                {report?.status}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Icon name="AlertTriangle" size={12} className="mr-1" />
              <span>{report?.violationType}</span>
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Icon name="Calendar" size={12} className="mr-1" />
              <span>Submitted: {formatDate(report?.submittedAt)}</span>
            </div>

            {report?.assignedOfficer && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Icon name="User" size={12} className="mr-1" />
                <span>Assigned to: {report?.assignedOfficer}</span>
              </div>
            )}

            {report?.aiAnalysis && (
              <div className="bg-primary/5 border border-primary/10 rounded-civic p-2 mt-2">
                <p className="text-xs text-primary font-medium mb-1">AI Analysis:</p>
                <p className="text-xs text-muted-foreground">{report?.aiAnalysis}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 mt-3">
            <Button
              variant="outline"
              size="xs"
              onClick={() => onViewDetails(report)}
              iconName="Eye"
              iconPosition="left"
              iconSize={12}
            >
              View
            </Button>
            
            {report?.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => onAssign(report)}
                  iconName="UserPlus"
                  iconPosition="left"
                  iconSize={12}
                >
                  Assign
                </Button>
                
                <Button
                  variant="default"
                  size="xs"
                  onClick={() => onUpdateStatus(report, 'investigating')}
                  iconName="Search"
                  iconPosition="left"
                  iconSize={12}
                >
                  Investigate
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;