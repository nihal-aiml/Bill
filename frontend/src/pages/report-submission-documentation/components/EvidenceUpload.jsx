import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EvidenceUpload = ({ 
  images = [], 
  onImagesUpdate, 
  maxImages = 5,
  className = '' 
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event?.target?.files);
    const newImages = files?.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file?.name,
      size: file?.size,
      timestamp: new Date()?.toISOString()
    }));

    const updatedImages = [...images, ...newImages]?.slice(0, maxImages);
    onImagesUpdate(updatedImages);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e?.preventDefault();
    
    if (draggedIndex === null) return;
    
    const newImages = [...images];
    const draggedImage = newImages?.[draggedIndex];
    
    newImages?.splice(draggedIndex, 1);
    newImages?.splice(dropIndex, 0, draggedImage);
    
    onImagesUpdate(newImages);
    setDraggedIndex(null);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images?.filter((_, i) => i !== index);
    onImagesUpdate(updatedImages);
  };

  const handleDragEnter = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    if (e?.currentTarget?.contains(e?.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDropZone = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e?.dataTransfer?.files)?.filter(file => 
      file?.type?.startsWith('image/')
    );
    
    if (files?.length > 0) {
      const newImages = files?.map(file => ({
        id: Date.now() + Math.random(),
        file,
        url: URL.createObjectURL(file),
        name: file?.name,
        size: file?.size,
        timestamp: new Date()?.toISOString()
      }));

      const updatedImages = [...images, ...newImages]?.slice(0, maxImages);
      onImagesUpdate(updatedImages);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className={`bg-card rounded-civic-card border border-border ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">Additional Evidence</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Upload additional photos to support your report ({images?.length}/{maxImages})
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef?.current?.click()}
            disabled={images?.length >= maxImages}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
          >
            Add Photos
          </Button>
        </div>
      </div>
      <div className="p-4">
        {/* Upload Zone */}
        {images?.length < maxImages && (
          <div
            className={`border-2 border-dashed rounded-civic p-6 text-center civic-transition-fast ${
              isDragging 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDropZone}
          >
            <Icon name="Upload" size={32} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">
              Drag and drop images here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports JPG, PNG, WebP up to 10MB each
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef?.current?.click()}
              className="mt-3"
            >
              Choose Files
            </Button>
          </div>
        )}

        {/* Image Gallery */}
        {images?.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images?.map((image, index) => (
                <div
                  key={image?.id}
                  className="relative group bg-muted rounded-civic overflow-hidden civic-transition-fast hover:civic-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <Image
                    src={image?.url}
                    alt={`Evidence ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 civic-transition-fast flex items-center justify-center">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveImage(index)}
                        className="w-8 h-8 text-white hover:bg-white/20"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-white hover:bg-white/20 cursor-move"
                      >
                        <Icon name="Move" size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-xs text-white truncate">{image?.name}</p>
                    <p className="text-xs text-white/70">{formatFileSize(image?.size)}</p>
                  </div>

                  {/* Drag Indicator */}
                  {draggedIndex === index && (
                    <div className="absolute inset-0 border-2 border-primary bg-primary/10 rounded-civic"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Reorder Instructions */}
            <div className="mt-3 flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Info" size={14} />
              <span>Drag images to reorder. First image will be used as primary evidence.</span>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default EvidenceUpload;