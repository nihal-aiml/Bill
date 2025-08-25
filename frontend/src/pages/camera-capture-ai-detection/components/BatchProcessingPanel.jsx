import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const BatchProcessingPanel = ({ 
  isVisible = false, 
  capturedImages = [], 
  onClose, 
  onProcessAll, 
  onRemoveImage,
  onRetakeImage,
  processingStatus = 'idle' // 'idle', 'processing', 'completed', 'error'
}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [processingProgress, setProcessingProgress] = useState(0);

  const mockCapturedImages = capturedImages?.length > 0 ? capturedImages : [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
      timestamp: new Date(Date.now() - 30000),
      location: { lat: 28.6139, lng: 77.2090 },
      status: 'pending', // 'pending', 'processing', 'completed', 'error'
      analysis: null
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
      timestamp: new Date(Date.now() - 60000),
      location: { lat: 28.6140, lng: 77.2091 },
      status: 'completed',
      analysis: {
        violations: 2,
        confidence: 89,
        complianceStatus: 'violation'
      }
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400',
      timestamp: new Date(Date.now() - 90000),
      location: { lat: 28.6141, lng: 77.2092 },
      status: 'processing',
      analysis: null
    }
  ];

  useEffect(() => {
    if (processingStatus === 'processing') {
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [processingStatus]);

  const handleImageSelect = (imageId) => {
    setSelectedImages(prev => 
      prev?.includes(imageId) 
        ? prev?.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedImages?.length === mockCapturedImages?.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(mockCapturedImages?.map(img => img?.id));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return { name: 'CheckCircle', color: 'text-success' };
      case 'processing': return { name: 'Loader', color: 'text-primary animate-spin' };
      case 'error': return { name: 'AlertCircle', color: 'text-error' };
      default: return { name: 'Clock', color: 'text-muted-foreground' };
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-modal flex items-end sm:items-center justify-center p-4">
      <div className="bg-card rounded-t-civic-card sm:rounded-civic-card w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-civic flex items-center justify-center">
              <Icon name="Images" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Batch Processing</h2>
              <p className="text-sm text-muted-foreground">
                {mockCapturedImages?.length} images captured • {selectedImages?.length} selected
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Processing Status */}
        {processingStatus === 'processing' && (
          <div className="p-4 bg-primary/5 border-b border-border">
            <div className="flex items-center space-x-3">
              <Icon name="Loader" size={20} className="text-primary animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Processing Images...</p>
                <div className="mt-2 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full civic-transition" 
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-medium text-primary">{processingProgress}%</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                iconName={selectedImages?.length === mockCapturedImages?.length ? "CheckSquare" : "Square"}
                iconPosition="left"
                iconSize={16}
              >
                {selectedImages?.length === mockCapturedImages?.length ? 'Deselect All' : 'Select All'}
              </Button>
              {selectedImages?.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedImages?.length} selected
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={selectedImages?.length === 0}
                iconName="Trash2"
                iconPosition="left"
                iconSize={16}
              >
                Remove Selected
              </Button>
            </div>
          </div>

          {/* Images Grid */}
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockCapturedImages?.map((image) => {
                const statusIcon = getStatusIcon(image?.status);
                const isSelected = selectedImages?.includes(image?.id);
                
                return (
                  <div 
                    key={image?.id} 
                    className={`relative border rounded-civic overflow-hidden civic-transition-fast ${
                      isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <button
                        onClick={() => handleImageSelect(image?.id)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center civic-transition-fast ${
                          isSelected 
                            ? 'bg-primary border-primary text-white' :'bg-white/80 border-white/80 hover:bg-white'
                        }`}
                      >
                        {isSelected && <Icon name="Check" size={12} />}
                      </button>
                    </div>
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <div className={`w-6 h-6 rounded-full bg-white/90 flex items-center justify-center ${statusIcon?.color}`}>
                        <Icon name={statusIcon?.name} size={12} />
                      </div>
                    </div>
                    {/* Image */}
                    <div className="aspect-video bg-muted">
                      <Image
                        src={image?.url}
                        alt={`Captured billboard ${image?.id}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Image Info */}
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatTimestamp(image?.timestamp)}</span>
                        <span>
                          {image?.location?.lat?.toFixed(4)}, {image?.location?.lng?.toFixed(4)}
                        </span>
                      </div>
                      
                      {image?.analysis && (
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-medium ${
                            image?.analysis?.complianceStatus === 'violation' ? 'text-error' : 'text-success'
                          }`}>
                            {image?.analysis?.violations} violations
                          </span>
                          <span className="text-muted-foreground">
                            {image?.analysis?.confidence}% confidence
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-1 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRetakeImage && onRetakeImage(image?.id)}
                          className="flex-1 h-7 text-xs"
                          iconName="Camera"
                          iconSize={12}
                        >
                          Retake
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveImage && onRemoveImage(image?.id)}
                          className="flex-1 h-7 text-xs text-error hover:text-error"
                          iconName="Trash2"
                          iconSize={12}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            {mockCapturedImages?.filter(img => img?.status === 'completed')?.length} of {mockCapturedImages?.length} processed
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={onProcessAll}
              disabled={processingStatus === 'processing' || mockCapturedImages?.length === 0}
              iconName="Play"
              iconPosition="left"
            >
              {processingStatus === 'processing' ? 'Processing...' : 'Process All'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchProcessingPanel;