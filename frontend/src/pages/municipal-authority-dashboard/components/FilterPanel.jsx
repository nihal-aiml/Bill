import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  resultCount = 0,
  isExpanded = false,
  onToggleExpanded 
}) => {
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
    { value: 'oversized', label: 'Oversized Billboard' },
    { value: 'unauthorized', label: 'Unauthorized Placement' },
    { value: 'safety_hazard', label: 'Safety Hazard' },
    { value: 'expired_permit', label: 'Expired Permit' },
    { value: 'structural_issue', label: 'Structural Issue' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'investigating', label: 'Under Investigation' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card border border-border rounded-civic-card p-4 civic-shadow mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Filters</h3>
          <span className="text-sm text-muted-foreground">
            ({resultCount} results)
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={16}
            className="text-muted-foreground"
          >
            Clear All
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleExpanded}
            className="lg:hidden"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 ${!isExpanded ? 'hidden lg:grid' : ''}`}>
        {/* Search Input */}
        <div className="md:col-span-2">
          <Input
            type="search"
            placeholder="Search by report ID, location..."
            value={filters?.search || ''}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* District Filter */}
        <Select
          options={districtOptions}
          value={filters?.district || 'all'}
          onChange={(value) => handleFilterChange('district', value)}
          placeholder="Select District"
        />

        {/* Violation Type Filter */}
        <Select
          options={violationTypeOptions}
          value={filters?.violationType || 'all'}
          onChange={(value) => handleFilterChange('violationType', value)}
          placeholder="Violation Type"
        />

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={filters?.status || 'all'}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Status"
        />

        {/* Priority Filter */}
        <Select
          options={priorityOptions}
          value={filters?.priority || 'all'}
          onChange={(value) => handleFilterChange('priority', value)}
          placeholder="Priority"
        />
      </div>
      {/* Date Range Filters - Expanded Section */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
          <Input
            type="date"
            label="From Date"
            value={filters?.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
          />
          
          <Input
            type="date"
            label="To Date"
            value={filters?.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
          />
        </div>
      )}
      {/* Active Filters Display */}
      {Object.keys(filters)?.some(key => filters?.[key] && filters?.[key] !== 'all') && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(filters)?.map(([key, value]) => {
            if (!value || value === 'all') return null;
            
            return (
              <span
                key={key}
                className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-civic border border-primary/20"
              >
                {key}: {value}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleFilterChange(key, '')}
                  className="w-4 h-4 ml-1 text-primary hover:text-primary/80"
                >
                  <Icon name="X" size={10} />
                </Button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;