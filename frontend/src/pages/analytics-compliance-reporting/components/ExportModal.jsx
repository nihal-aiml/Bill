import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportModal = ({ isOpen, onClose, onExport }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'pdf',
    dateRange: 'last30days',
    includeCharts: true,
    includeMap: true,
    includePerformance: true,
    includeBreakdown: true,
    reportTitle: 'Billboard Compliance Report',
    recipientEmail: ''
  });

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'csv', label: 'CSV Data' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'json', label: 'JSON Data' }
  ];

  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' }
  ];

  const handleConfigChange = (key, value) => {
    setExportConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    if (onExport) {
      onExport(exportConfig);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal">
      <div className="bg-card border border-border rounded-civic-card civic-shadow max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Download" size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Export Report</h3>
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
            label="Report Title"
            type="text"
            value={exportConfig?.reportTitle}
            onChange={(e) => handleConfigChange('reportTitle', e?.target?.value)}
            placeholder="Enter report title"
          />
          
          <Select
            label="Export Format"
            options={formatOptions}
            value={exportConfig?.format}
            onChange={(value) => handleConfigChange('format', value)}
          />
          
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={exportConfig?.dateRange}
            onChange={(value) => handleConfigChange('dateRange', value)}
          />
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Include Sections</h4>
            
            <Checkbox
              label="Violation Charts & Trends"
              checked={exportConfig?.includeCharts}
              onChange={(e) => handleConfigChange('includeCharts', e?.target?.checked)}
            />
            
            <Checkbox
              label="Violation Map & Hotspots"
              checked={exportConfig?.includeMap}
              onChange={(e) => handleConfigChange('includeMap', e?.target?.checked)}
            />
            
            <Checkbox
              label="Officer Performance Metrics"
              checked={exportConfig?.includePerformance}
              onChange={(e) => handleConfigChange('includePerformance', e?.target?.checked)}
            />
            
            <Checkbox
              label="Category Breakdown Analysis"
              checked={exportConfig?.includeBreakdown}
              onChange={(e) => handleConfigChange('includeBreakdown', e?.target?.checked)}
            />
          </div>
          
          <Input
            label="Email Report To (Optional)"
            type="email"
            value={exportConfig?.recipientEmail}
            onChange={(e) => handleConfigChange('recipientEmail', e?.target?.value)}
            placeholder="Enter email address"
            description="Leave empty to download directly"
          />
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
              onClick={handleExport}
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              Export Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;