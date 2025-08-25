import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const FilterBar = ({ onFiltersChange, onExport, onScheduleReport }) => {
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    district: 'all',
    violationType: 'all',
    status: 'all'
  });

  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const districtOptions = [
    { value: 'all', label: 'All Districts' },
    { value: 'central', label: 'Central District' },
    { value: 'north', label: 'North District' },
    { value: 'south', label: 'South District' },
    { value: 'east', label: 'East District' },
    { value: 'west', label: 'West District' }
  ];

  const violationTypeOptions = [
    { value: 'all', label: 'All Violations' },
    { value: 'size_violation', label: 'Size Violations' },
    { value: 'placement_violation', label: 'Placement Violations' },
    { value: 'permit_violation', label: 'Permit Violations' },
    { value: 'safety_violation', label: 'Safety Violations' },
    { value: 'content_violation', label: 'Content Violations' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      dateRange: 'last30days',
      district: 'all',
      violationType: 'all',
      status: 'all'
    };
    setFilters(resetFilters);
    if (onFiltersChange) {
      onFiltersChange(resetFilters);
    }
  };

  return (
    <div className="bg-card border border-border rounded-civic-card p-4 civic-shadow mb-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
            className="w-full"
          />
          
          <Select
            label="District"
            options={districtOptions}
            value={filters?.district}
            onChange={(value) => handleFilterChange('district', value)}
            className="w-full"
          />
          
          <Select
            label="Violation Type"
            options={violationTypeOptions}
            value={filters?.violationType}
            onChange={(value) => handleFilterChange('violationType', value)}
            className="w-full"
          />
          
          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            iconName="RotateCcw"
            iconPosition="left"
            iconSize={16}
          >
            Reset
          </Button>
          
          <Button
            variant="outline"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
          >
            Export
          </Button>
          
          <Button
            variant="default"
            onClick={onScheduleReport}
            iconName="Calendar"
            iconPosition="left"
            iconSize={16}
          >
            Schedule Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;