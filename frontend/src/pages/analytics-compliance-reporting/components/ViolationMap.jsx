import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ViolationMap = ({ violations = [], onLocationClick }) => {
  const [mapView, setMapView] = useState('heatmap');
  const [selectedViolation, setSelectedViolation] = useState(null);

  const mockViolations = [
    {
      id: 1,
      lat: 28.6139,
      lng: 77.2090,
      type: 'Size Violation',
      severity: 'high',
      count: 15,
      address: "Connaught Place, New Delhi",
      status: 'pending'
    },
    {
      id: 2,
      lat: 28.5355,
      lng: 77.3910,
      type: 'Placement Violation',
      severity: 'medium',
      count: 8,
      address: "Noida Sector 18",
      status: 'in_progress'
    },
    {
      id: 3,
      lat: 28.4595,
      lng: 77.0266,
      type: 'Permit Violation',
      severity: 'high',
      count: 12,
      address: "Gurgaon Cyber City",
      status: 'resolved'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-error';
      case 'medium':
        return 'bg-warning';
      case 'low':
        return 'bg-success';
      default:
        return 'bg-primary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'text-success';
      case 'in_progress':
        return 'text-warning';
      case 'pending':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleMarkerClick = (violation) => {
    setSelectedViolation(violation);
    if (onLocationClick) {
      onLocationClick(violation);
    }
  };

  return (
    <div className="bg-card border border-border rounded-civic-card civic-shadow">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Violation Hotspots</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={mapView === 'heatmap' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapView('heatmap')}
              iconName="Thermometer"
              iconPosition="left"
              iconSize={14}
            >
              Heatmap
            </Button>
            <Button
              variant={mapView === 'markers' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapView('markers')}
              iconName="MapPin"
              iconPosition="left"
              iconSize={14}
            >
              Markers
            </Button>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="h-96 bg-muted rounded-b-civic-card overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Violation Hotspots Map"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=28.6139,77.2090&z=11&output=embed"
            className="border-0"
          />
          
          {/* Overlay markers for violations */}
          <div className="absolute inset-0 pointer-events-none">
            {mockViolations?.map((violation, index) => (
              <div
                key={violation?.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `${20 + index * 25}%`,
                  top: `${30 + index * 15}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleMarkerClick(violation)}
              >
                <div className={`w-6 h-6 ${getSeverityColor(violation?.severity)} rounded-full border-2 border-white civic-shadow animate-pulse`}>
                  <div className="w-full h-full rounded-full bg-white/30"></div>
                </div>
                <div className="absolute -top-1 -right-1 bg-foreground text-background text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {violation?.count}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card border border-border rounded-civic p-3 civic-shadow">
          <h4 className="text-sm font-medium text-foreground mb-2">Severity Levels</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <span className="text-xs text-muted-foreground">High (10+ violations)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-xs text-muted-foreground">Medium (5-9 violations)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-xs text-muted-foreground">Low (1-4 violations)</span>
            </div>
          </div>
        </div>
      </div>
      {/* Selected violation details */}
      {selectedViolation && (
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{selectedViolation?.type}</h4>
              <p className="text-sm text-muted-foreground mt-1">{selectedViolation?.address}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-foreground">
                  <strong>{selectedViolation?.count}</strong> violations
                </span>
                <span className={`text-sm font-medium ${getStatusColor(selectedViolation?.status)}`}>
                  {selectedViolation?.status?.replace('_', ' ')?.toUpperCase()}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedViolation(null)}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViolationMap;