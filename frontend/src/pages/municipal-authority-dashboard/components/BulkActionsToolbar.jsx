import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsToolbar = ({ 
  selectedReports = [], 
  onBulkAction, 
  onSelectAll, 
  onClearSelection,
  totalReports = 0 
}) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('');

  const actionOptions = [
    { value: '', label: 'Select Action' },
    { value: 'assign', label: 'Assign to Officer' },
    { value: 'update_status', label: 'Update Status' },
    { value: 'set_priority', label: 'Set Priority' },
    { value: 'export', label: 'Export Reports' },
    { value: 'archive', label: 'Archive Reports' }
  ];

  const officerOptions = [
    { value: '', label: 'Select Officer' },
    { value: 'officer_1', label: 'Rajesh Kumar - Zone A' },
    { value: 'officer_2', label: 'Priya Sharma - Zone B' },
    { value: 'officer_3', label: 'Amit Singh - Zone C' },
    { value: 'officer_4', label: 'Sunita Patel - Zone D' }
  ];

  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: 'investigating', label: 'Under Investigation' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'pending', label: 'Pending Review' }
  ];

  const priorityOptions = [
    { value: '', label: 'Select Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const handleActionExecute = () => {
    if (!selectedAction || selectedReports?.length === 0) return;

    const actionData = {
      action: selectedAction,
      reportIds: selectedReports,
      officer: selectedOfficer,
      timestamp: new Date()?.toISOString()
    };

    onBulkAction(actionData);
    setSelectedAction('');
    setSelectedOfficer('');
  };

  const getActionOptions = () => {
    switch (selectedAction) {
      case 'assign':
        return officerOptions;
      case 'update_status':
        return statusOptions;
      case 'set_priority':
        return priorityOptions;
      default:
        return [];
    }
  };

  if (selectedReports?.length === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-civic-card p-4 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Selection Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="font-medium text-foreground">
              {selectedReports?.length} of {totalReports} selected
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSelectAll}
              iconName="CheckSquare"
              iconPosition="left"
              iconSize={16}
              className="text-primary hover:text-primary/80"
            >
              Select All
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              iconName="X"
              iconPosition="left"
              iconSize={16}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center space-x-3">
          <Select
            options={actionOptions}
            value={selectedAction}
            onChange={setSelectedAction}
            placeholder="Select Action"
            className="min-w-40"
          />

          {/* Secondary Action Select */}
          {selectedAction && ['assign', 'update_status', 'set_priority']?.includes(selectedAction) && (
            <Select
              options={getActionOptions()}
              value={selectedOfficer}
              onChange={setSelectedOfficer}
              placeholder={
                selectedAction === 'assign' ? 'Select Officer' :
                selectedAction === 'update_status'? 'Select Status' : 'Select Priority'
              }
              className="min-w-40"
            />
          )}

          <Button
            variant="default"
            onClick={handleActionExecute}
            disabled={!selectedAction || (
              ['assign', 'update_status', 'set_priority']?.includes(selectedAction) && !selectedOfficer
            )}
            iconName="Play"
            iconPosition="left"
            iconSize={16}
          >
            Execute
          </Button>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-primary/20">
        <span className="text-sm text-muted-foreground">Quick Actions:</span>
        
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onBulkAction({ action: 'export', reportIds: selectedReports })}
          iconName="Download"
          iconPosition="left"
          iconSize={12}
          className="text-primary hover:text-primary/80"
        >
          Export
        </Button>
        
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onBulkAction({ action: 'print', reportIds: selectedReports })}
          iconName="Printer"
          iconPosition="left"
          iconSize={12}
          className="text-primary hover:text-primary/80"
        >
          Print
        </Button>
        
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onBulkAction({ action: 'notify_citizens', reportIds: selectedReports })}
          iconName="Bell"
          iconPosition="left"
          iconSize={12}
          className="text-primary hover:text-primary/80"
        >
          Notify Citizens
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;