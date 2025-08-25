import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveMap = ({ reports = [], onReportClick, selectedReport = null }) => {
  const [mapView, setMapView] = useState('satellite');
  const [showClusters, setShowClusters] = useState(true);

  // Mock coordinates for demonstration
  const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // New Delhi

  const getMarkerColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#DC2626'; // red
      case 'medium':
        return '#F59E0B'; // amber
      case 'low':
        return '#10B981'; // emerald
      default:
        return '#6B7280'; // gray
    }
  };

  const clusterReports = (reports) => {
    // Simple clustering logic for demonstration
    const clusters = [];
    const processed = new Set();

    reports?.forEach((report, index) => {
      if (processed?.has(index)) return;

      const cluster = {
        id: `cluster-${index}`,
        lat: report?.coordinates?.lat,
        lng: report?.coordinates?.lng,
        reports: [report],
        priority: report?.priority
      };

      // Find nearby reports (within ~100m for demo)
      reports?.forEach((otherReport, otherIndex) => {
        if (otherIndex !== index && !processed?.has(otherIndex)) {
          const distance = Math.sqrt(
            Math.pow(report?.coordinates?.lat - otherReport?.coordinates?.lat, 2) +
            Math.pow(report?.coordinates?.lng - otherReport?.coordinates?.lng, 2)
          );

          if (distance < 0.001) { // Approximate 100m
            cluster?.reports?.push(otherReport);
            processed?.add(otherIndex);
          }
        }
      });

      processed?.add(index);
      clusters?.push(cluster);
    });

    return clusters;
  };

  const clusters = showClusters ? clusterReports(reports) : reports?.map(report => ({
    ...report,
    reports: [report]
  }));

  return (
    <div className="bg-card border border-border rounded-civic-card civic-shadow overflow-hidden">
      {/* Map Controls */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Violation Map</h3>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={showClusters ? "default" : "outline"}
              size="xs"
              onClick={() => setShowClusters(!showClusters)}
              iconName="Layers"
              iconPosition="left"
              iconSize={12}
            >
              Clusters
            </Button>
            
            <Button
              variant="outline"
              size="xs"
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={12}
            >
              Reset View
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 mt-3 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-muted-foreground">High Priority</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">Medium Priority</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Low Priority</span>
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div className="relative h-96 bg-muted">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Billboard Violations Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${defaultCenter?.lat},${defaultCenter?.lng}&z=12&output=embed`}
          className="w-full h-full"
        />

        {/* Overlay Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {clusters?.map((cluster, index) => (
            <div
              key={cluster?.id || index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
              style={{
                left: `${20 + (index % 5) * 15}%`,
                top: `${30 + Math.floor(index / 5) * 20}%`
              }}
              onClick={() => onReportClick && onReportClick(cluster?.reports?.[0])}
            >
              <div className="relative">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white civic-shadow flex items-center justify-center text-white text-xs font-bold civic-transition hover:scale-110"
                  style={{ backgroundColor: getMarkerColor(cluster?.priority) }}
                >
                  {cluster?.reports?.length > 1 ? cluster?.reports?.length : '!'}
                </div>
                
                {selectedReport && selectedReport?.id === cluster?.reports?.[0]?.id && (
                  <div className="absolute -top-2 -left-2 w-10 h-10 border-2 border-primary rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Map Loading State */}
        <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
          <div className="text-center">
            <Icon name="MapPin" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Loading map data...</p>
          </div>
        </div>
      </div>
      {/* Selected Report Info */}
      {selectedReport && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-foreground">Report #{selectedReport?.id}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                <Icon name="MapPin" size={12} className="inline mr-1" />
                {selectedReport?.location}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedReport?.violationType} • {selectedReport?.priority} priority
              </p>
            </div>
            
            <Button
              variant="outline"
              size="xs"
              onClick={() => onReportClick && onReportClick(selectedReport)}
              iconName="Eye"
              iconPosition="left"
              iconSize={12}
            >
              View Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;