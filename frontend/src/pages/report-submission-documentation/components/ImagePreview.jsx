import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ImagePreview = ({ 
  image, 
  annotations = [], 
  onAnnotationEdit, 
  onImageReplace,
  className = '' 
}) => {
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAnnotationClick = (annotation) => {
    setSelectedAnnotation(annotation);
    setIsEditing(true);
  };

  const handleSaveAnnotation = (updatedAnnotation) => {
    if (onAnnotationEdit) {
      onAnnotationEdit(updatedAnnotation);
    }
    setIsEditing(false);
    setSelectedAnnotation(null);
  };

  return (
    <div className={`bg-card rounded-civic-card border border-border overflow-hidden ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground">Captured Image</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onImageReplace}
            iconName="Camera"
            iconPosition="left"
            iconSize={16}
          >
            Retake
          </Button>
        </div>
      </div>
      <div className="relative">
        <Image
          src={image}
          alt="Captured billboard"
          className="w-full h-64 sm:h-80 object-cover"
        />

        {/* AI Annotations Overlay */}
        {annotations?.map((annotation, index) => (
          <div
            key={index}
            className="absolute border-2 border-error bg-error/10 cursor-pointer civic-transition-fast hover:bg-error/20"
            style={{
              left: `${annotation?.x}%`,
              top: `${annotation?.y}%`,
              width: `${annotation?.width}%`,
              height: `${annotation?.height}%`
            }}
            onClick={() => handleAnnotationClick(annotation)}
          >
            <div className="absolute -top-6 left-0 bg-error text-error-foreground text-xs px-2 py-1 rounded civic-shadow">
              {annotation?.type}
            </div>
          </div>
        ))}

        {/* AI Detection Badge */}
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium civic-shadow">
          <Icon name="Zap" size={16} className="inline mr-1" />
          AI Detected: {annotations?.length} violations
        </div>
      </div>
      {/* Annotation Details */}
      {annotations?.length > 0 && (
        <div className="p-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Detected Violations</h4>
          <div className="space-y-2">
            {annotations?.map((annotation, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-civic cursor-pointer civic-transition-fast hover:bg-muted/80"
                onClick={() => handleAnnotationClick(annotation)}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-error rounded-full"></div>
                  <span className="text-sm text-foreground">{annotation?.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    Confidence: {Math.round(annotation?.confidence * 100)}%
                  </span>
                  <Icon name="Edit2" size={14} className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Edit Annotation Modal */}
      {isEditing && selectedAnnotation && (
        <div className="fixed inset-0 bg-black/50 z-modal flex items-center justify-center p-4">
          <div className="bg-card rounded-civic-card border border-border max-w-md w-full civic-shadow-lg">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-foreground">Edit Violation</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Violation Type</label>
                <select className="w-full mt-1 p-2 border border-border rounded-civic bg-input text-foreground">
                  <option value="oversized">Oversized Billboard</option>
                  <option value="unsafe_placement">Unsafe Placement</option>
                  <option value="missing_permit">Missing Permit</option>
                  <option value="traffic_obstruction">Traffic Obstruction</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Confidence Level</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(selectedAnnotation?.confidence * 100)}
                  className="w-full mt-1"
                />
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => handleSaveAnnotation(selectedAnnotation)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;