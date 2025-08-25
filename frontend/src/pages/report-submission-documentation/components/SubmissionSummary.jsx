import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SubmissionSummary = ({ 
  reportData, 
  onEdit, 
  onSubmit, 
  onCancel,
  isSubmitting = false,
  className = '' 
}) => {
  const violationLabels = {
    'oversized': 'Oversized Dimensions',
    'unsafe_placement': 'Unsafe Placement',
    'missing_permit': 'Missing Permits',
    'traffic_obstruction': 'Traffic Signal Proximity',
    'structural_damage': 'Structural Damage',
    'content_violation': 'Content Violation'
  };

  const priorityLabels = {
    'low': 'Low Priority',
    'medium': 'Medium Priority',
    'high': 'High Priority',
    'emergency': 'Emergency'
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return 'text-error bg-error/10';
      case 'high': return 'text-warning bg-warning/10';
      case 'medium': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted/50';
    }
  };

  const generateReportId = () => {
    const timestamp = new Date()?.getTime()?.toString()?.slice(-6);
    const random = Math.random()?.toString(36)?.substring(2, 5)?.toUpperCase();
    return `BM${timestamp}${random}`;
  };

  return (
    <div className={`bg-card rounded-civic-card border border-border ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Report Summary</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Review your report before submission
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Report ID</p>
            <p className="text-sm text-muted-foreground">{generateReportId()}</p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-6">
        {/* Image Preview */}
        {reportData?.image && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Captured Evidence</h4>
            <div className="relative">
              <Image
                src={reportData?.image}
                alt="Billboard evidence"
                className="w-full h-48 object-cover rounded-civic border border-border"
              />
              {reportData?.annotations?.length > 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                  {reportData?.annotations?.length} AI detections
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location Information */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Location</h4>
          <div className="bg-muted/50 rounded-civic p-3">
            <p className="text-sm text-foreground">{reportData?.location?.address}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {reportData?.location?.city}, {reportData?.location?.state}
            </p>
            <p className="text-xs text-muted-foreground">
              Coordinates: {reportData?.location?.latitude?.toFixed(6)}, {reportData?.location?.longitude?.toFixed(6)}
            </p>
          </div>
        </div>

        {/* Violations */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Reported Violations</h4>
          <div className="flex flex-wrap gap-2">
            {reportData?.violations?.map((violation) => (
              <span
                key={violation}
                className="inline-flex items-center px-2 py-1 bg-error/10 text-error text-xs rounded-full"
              >
                <Icon name="AlertTriangle" size={12} className="mr-1" />
                {violationLabels?.[violation]}
              </span>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Priority Level</h4>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getPriorityColor(reportData?.priority)}`}>
            <Icon name="Flag" size={14} className="mr-1" />
            {priorityLabels?.[reportData?.priority]}
          </span>
        </div>

        {/* Description */}
        {reportData?.description && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
            <div className="bg-muted/50 rounded-civic p-3">
              <p className="text-sm text-foreground">{reportData?.description}</p>
            </div>
          </div>
        )}

        {/* Additional Evidence */}
        {reportData?.additionalImages?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              Additional Evidence ({reportData?.additionalImages?.length} images)
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {reportData?.additionalImages?.slice(0, 4)?.map((image, index) => (
                <Image
                  key={index}
                  src={image?.url}
                  alt={`Evidence ${index + 1}`}
                  className="w-full h-16 object-cover rounded border border-border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Contact Information</h4>
          <div className="bg-muted/50 rounded-civic p-3">
            {reportData?.contact?.anonymous ? (
              <div className="flex items-center space-x-2">
                <Icon name="EyeOff" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Anonymous Report</span>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-foreground">{reportData?.contact?.name}</p>
                <p className="text-xs text-muted-foreground">{reportData?.contact?.email}</p>
                <p className="text-xs text-muted-foreground">{reportData?.contact?.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Submission Details */}
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Submission Date</p>
              <p className="text-foreground">
                {new Date()?.toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Estimated Review Time</p>
              <p className="text-foreground">
                {reportData?.priority === 'emergency' ? '2-4 hours' :
                 reportData?.priority === 'high' ? '1-2 days' :
                 reportData?.priority === 'medium' ? '3-5 days' : '5-7 days'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          
          <Button
            variant="secondary"
            onClick={onEdit}
            disabled={isSubmitting}
            iconName="Edit2"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Edit Report
          </Button>
          
          <Button
            variant="default"
            onClick={onSubmit}
            loading={isSubmitting}
            iconName="Send"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>

        {/* Legal Notice */}
        <div className="bg-primary/5 border border-primary/20 rounded-civic p-3">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">
                By submitting this report, you confirm that the information provided is accurate to the best of your knowledge. 
                False reporting may result in legal consequences under applicable municipal laws.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSummary;