import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapWidget = ({ nearbyReports }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock coordinates for demonstration
  const centerLat = 28.6139;
  const centerLng = 77.2090;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Nearby Reports</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleExpanded}
          iconName={isExpanded ? "Minimize2" : "Maximize2"}
          iconPosition="right"
          iconSize={16}
        >
          {isExpanded ? "Minimize" : "Expand"}
        </Button>
      </div>
      <div className={`bg-card border border-border rounded-civic-card overflow-hidden civic-shadow ${isExpanded ? 'h-96' : 'h-64'} civic-transition`}>
        <div className="relative w-full h-full">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Nearby Billboard Reports"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${centerLat},${centerLng}&z=14&output=embed`}
            className="border-0"
          />
          
          {/* Overlay with report markers info */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-civic p-3 civic-shadow">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="MapPin" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                {nearbyReports?.length} Reports Nearby
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-error rounded-full"></div>
                <span className="text-xs text-muted-foreground">High Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-xs text-muted-foreground">Under Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-xs text-muted-foreground">Resolved</span>
              </div>
            </div>
          </div>

          {/* Filter controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-white/90 backdrop-blur-sm civic-shadow"
            >
              <Icon name="Filter" size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/90 backdrop-blur-sm civic-shadow"
            >
              <Icon name="Layers" size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Report summary */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-error">{nearbyReports?.filter(r => r?.priority === 'high')?.length}</div>
          <div className="text-xs text-muted-foreground">High Priority</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-warning">{nearbyReports?.filter(r => r?.status === 'under_review')?.length}</div>
          <div className="text-xs text-muted-foreground">Under Review</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-success">{nearbyReports?.filter(r => r?.status === 'resolved')?.length}</div>
          <div className="text-xs text-muted-foreground">Resolved</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">{nearbyReports?.length}</div>
          <div className="text-xs text-muted-foreground">Total Reports</div>
        </div>
      </div>
    </div>
  );
};

export default MapWidget;