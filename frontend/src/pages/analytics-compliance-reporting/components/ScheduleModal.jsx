import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ScheduleModal = ({ isOpen, onClose, onSchedule }) => {
  const [scheduleConfig, setScheduleConfig] = useState({
    frequency: 'weekly',
    dayOfWeek: 'monday',
    dayOfMonth: '1',
    time: '09:00',
    format: 'pdf',
    recipients: '',
    reportName: 'Weekly Compliance Report',
    includeCharts: true,
    includeMap: true,
    includePerformance: true,
    autoArchive: true
  });

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const dayOfWeekOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV Data' }
  ];

  const handleConfigChange = (key, value) => {
    setScheduleConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSchedule = () => {
    if (onSchedule) {
      onSchedule(scheduleConfig);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal">
      <div className="bg-card border border-border rounded-civic-card civic-shadow max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Schedule Automated Report</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <Input
            label="Report Name"
            type="text"
            value={scheduleConfig?.reportName}
            onChange={(e) => handleConfigChange('reportName', e?.target?.value)}
            placeholder="Enter report name"
          />
          
          <Select
            label="Frequency"
            options={frequencyOptions}
            value={scheduleConfig?.frequency}
            onChange={(value) => handleConfigChange('frequency', value)}
          />
          
          {scheduleConfig?.frequency === 'weekly' && (
            <Select
              label="Day of Week"
              options={dayOfWeekOptions}
              value={scheduleConfig?.dayOfWeek}
              onChange={(value) => handleConfigChange('dayOfWeek', value)}
            />
          )}
          
          {scheduleConfig?.frequency === 'monthly' && (
            <Input
              label="Day of Month"
              type="number"
              min="1"
              max="28"
              value={scheduleConfig?.dayOfMonth}
              onChange={(e) => handleConfigChange('dayOfMonth', e?.target?.value)}
              placeholder="Enter day (1-28)"
            />
          )}
          
          <Input
            label="Time"
            type="time"
            value={scheduleConfig?.time}
            onChange={(e) => handleConfigChange('time', e?.target?.value)}
          />
          
          <Select
            label="Report Format"
            options={formatOptions}
            value={scheduleConfig?.format}
            onChange={(value) => handleConfigChange('format', value)}
          />
          
          <Input
            label="Email Recipients"
            type="text"
            value={scheduleConfig?.recipients}
            onChange={(e) => handleConfigChange('recipients', e?.target?.value)}
            placeholder="Enter email addresses (comma separated)"
            description="Multiple emails can be separated by commas"
          />
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Report Sections</h4>
            
            <Checkbox
              label="Include Charts & Analytics"
              checked={scheduleConfig?.includeCharts}
              onChange={(e) => handleConfigChange('includeCharts', e?.target?.checked)}
            />
            
            <Checkbox
              label="Include Violation Map"
              checked={scheduleConfig?.includeMap}
              onChange={(e) => handleConfigChange('includeMap', e?.target?.checked)}
            />
            
            <Checkbox
              label="Include Performance Metrics"
              checked={scheduleConfig?.includePerformance}
              onChange={(e) => handleConfigChange('includePerformance', e?.target?.checked)}
            />
            
            <Checkbox
              label="Auto-archive Reports"
              description="Automatically save reports to system archive"
              checked={scheduleConfig?.autoArchive}
              onChange={(e) => handleConfigChange('autoArchive', e?.target?.checked)}
            />
          </div>
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              fullWidth
              onClick={handleSchedule}
              iconName="Calendar"
              iconPosition="left"
              iconSize={16}
            >
              Schedule Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;