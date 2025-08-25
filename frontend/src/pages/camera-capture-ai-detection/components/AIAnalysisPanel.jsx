import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIAnalysisPanel = ({ 
  isVisible = false, 
  analysisData = null, 
  onClose, 
  onConfirm, 
  onCorrect,
  isProcessing = false 
}) => {
  const [expandedViolation, setExpandedViolation] = useState(null);

  const mockAnalysisData = analysisData || {
    billboardCount: 2,
    dimensions: {
      width: "12.5 meters",
      height: "8.2 meters",
      area: "102.5 sq meters"
    },
    distanceFromRoad: "15.3 meters",
    complianceStatus: "violation",
    violations: [
      {
        id: 1,
        type: "Size Violation",
        severity: "high",
        description: "Billboard exceeds maximum allowed dimensions of 10x6 meters",
        confidence: 94,
        regulation: "Municipal Advertising Code Section 4.2"
      },
      {
        id: 2,
        type: "Placement Violation",
        severity: "medium",
        description: "Billboard placed within 50 meters of traffic intersection",
        confidence: 87,
        regulation: "Road Safety Guidelines Article 12.1"
      }
    ],
    gpsCoordinates: {
      latitude: 28.6139,
      longitude: 77.2090,
      accuracy: "±3 meters"
    },
    timestamp: new Date()?.toISOString(),
    confidence: 91
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'text-success bg-success/10';
      case 'violation': return 'text-error bg-error/10';
      case 'uncertain': return 'text-warning bg-warning/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error bg-error/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-modal flex items-end sm:items-center justify-center p-4">
      <div className="bg-card rounded-t-civic-card sm:rounded-civic-card w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-civic flex items-center justify-center">
              <Icon name="Scan" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">AI Analysis Results</h2>
              <p className="text-sm text-muted-foreground">
                {mockAnalysisData?.billboardCount} billboard(s) detected
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {isProcessing ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-foreground mb-2">Processing Image</h3>
              <p className="text-muted-foreground">AI is analyzing the captured image...</p>
              <div className="mt-4 bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Overall Status */}
              <div className={`p-4 rounded-civic ${getStatusColor(mockAnalysisData?.complianceStatus)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={mockAnalysisData?.complianceStatus === 'violation' ? 'AlertTriangle' : 'CheckCircle'} 
                      size={20} 
                    />
                    <span className="font-medium capitalize">
                      {mockAnalysisData?.complianceStatus}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {mockAnalysisData?.confidence}% confidence
                  </span>
                </div>
              </div>

              {/* Billboard Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">Billboard Dimensions</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Width:</span>
                      <span className="text-foreground">{mockAnalysisData?.dimensions?.width}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Height:</span>
                      <span className="text-foreground">{mockAnalysisData?.dimensions?.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Area:</span>
                      <span className="text-foreground">{mockAnalysisData?.dimensions?.area}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">Location Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance from Road:</span>
                      <span className="text-foreground">{mockAnalysisData?.distanceFromRoad}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GPS Accuracy:</span>
                      <span className="text-foreground">{mockAnalysisData?.gpsCoordinates?.accuracy}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Violations List */}
              {mockAnalysisData?.violations?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">Detected Violations</h3>
                  <div className="space-y-2">
                    {mockAnalysisData?.violations?.map((violation) => (
                      <div key={violation?.id} className="border border-border rounded-civic">
                        <div 
                          className="p-4 cursor-pointer hover:bg-muted/50 civic-transition-fast"
                          onClick={() => setExpandedViolation(
                            expandedViolation === violation?.id ? null : violation?.id
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(violation?.severity)}`}>
                                {violation?.severity?.toUpperCase()}
                              </span>
                              <span className="font-medium text-foreground">{violation?.type}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">{violation?.confidence}%</span>
                              <Icon 
                                name={expandedViolation === violation?.id ? "ChevronUp" : "ChevronDown"} 
                                size={16} 
                                className="text-muted-foreground" 
                              />
                            </div>
                          </div>
                        </div>
                        
                        {expandedViolation === violation?.id && (
                          <div className="px-4 pb-4 border-t border-border">
                            <p className="text-sm text-muted-foreground mb-2">{violation?.description}</p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Regulation:</strong> {violation?.regulation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GPS Coordinates */}
              <div className="bg-muted/30 p-4 rounded-civic">
                <h3 className="font-medium text-foreground mb-2">Location Coordinates</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-muted-foreground">
                    Lat: {mockAnalysisData?.gpsCoordinates?.latitude}
                  </span>
                  <span className="text-muted-foreground">
                    Lng: {mockAnalysisData?.gpsCoordinates?.longitude}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isProcessing && (
          <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
            <Button variant="outline" onClick={onCorrect} iconName="Edit" iconPosition="left">
              Correct Analysis
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="default" onClick={onConfirm} iconName="Check" iconPosition="left">
                Confirm & Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysisPanel;