import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CaptureControls = ({ 
  onCapture, 
  onGallery, 
  onSwitchCamera, 
  onFlashToggle,
  flashEnabled = false,
  isCapturing = false,
  captureMode = 'single', // 'single', 'multiple', 'batch'
  onCaptureModeChange,
  capturedCount = 0
}) => {
  const [showModeSelector, setShowModeSelector] = useState(false);

  const captureModes = [
    { value: 'single', label: 'Single Shot', icon: 'Camera', description: 'Capture one image' },
    { value: 'multiple', label: 'Multiple', icon: 'Images', description: 'Capture multiple angles' },
    { value: 'batch', label: 'Batch Mode', icon: 'Grid3x3', description: 'Rapid capture mode' }
  ];

  const handleCapture = () => {
    if (onCapture && !isCapturing) {
      onCapture();
    }
  };

  const handleModeChange = (mode) => {
    if (onCaptureModeChange) {
      onCaptureModeChange(mode);
    }
    setShowModeSelector(false);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent">
      {/* Mode Selector Popup */}
      {showModeSelector && (
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-civic p-4 min-w-[280px]">
          <div className="space-y-2">
            <h3 className="text-white font-medium text-sm mb-3">Capture Mode</h3>
            {captureModes?.map((mode) => (
              <button
                key={mode?.value}
                onClick={() => handleModeChange(mode?.value)}
                className={`w-full flex items-center space-x-3 p-3 rounded-civic civic-transition-fast ${
                  captureMode === mode?.value 
                    ? 'bg-primary text-white' :'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Icon name={mode?.icon} size={20} />
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{mode?.label}</p>
                  <p className="text-xs opacity-80">{mode?.description}</p>
                </div>
                {captureMode === mode?.value && (
                  <Icon name="Check" size={16} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Main Controls */}
      <div className="flex items-center justify-center h-32 px-8">
        <div className="flex items-center justify-between w-full max-w-md">
          {/* Gallery Button */}
          <div className="flex flex-col items-center space-y-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onGallery}
              className="w-12 h-12 rounded-full border-2 border-white/50 text-white hover:bg-white/20 civic-transition-fast"
            >
              <Icon name="Image" size={24} color="white" />
            </Button>
            <span className="text-xs text-white/80">Gallery</span>
          </div>

          {/* Capture Button */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCapture}
                disabled={isCapturing}
                className="w-20 h-20 rounded-full border-4 border-white bg-white/10 hover:bg-white/20 civic-transition-fast disabled:opacity-50"
              >
                {isCapturing ? (
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-8 h-8 bg-white rounded-full" />
                )}
              </Button>
              
              {/* Capture Count Badge */}
              {capturedCount > 0 && captureMode !== 'single' && (
                <div className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {capturedCount}
                </div>
              )}
            </div>
            <span className="text-xs text-white/80">
              {isCapturing ? 'Capturing...' : 'Capture'}
            </span>
          </div>

          {/* Switch Camera Button */}
          <div className="flex flex-col items-center space-y-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSwitchCamera}
              className="w-12 h-12 rounded-full border-2 border-white/50 text-white hover:bg-white/20 civic-transition-fast"
            >
              <Icon name="RotateCcw" size={24} color="white" />
            </Button>
            <span className="text-xs text-white/80">Switch</span>
          </div>
        </div>
      </div>
      {/* Secondary Controls */}
      <div className="flex items-center justify-center pb-6 space-x-6">
        {/* Flash Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onFlashToggle}
          className={`text-white hover:bg-white/20 civic-transition-fast ${flashEnabled ? 'bg-white/20' : ''}`}
          iconName={flashEnabled ? "Zap" : "ZapOff"}
          iconPosition="left"
          iconSize={16}
        >
          Flash
        </Button>

        {/* Capture Mode */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowModeSelector(!showModeSelector)}
          className="text-white hover:bg-white/20 civic-transition-fast"
          iconName="Settings"
          iconPosition="left"
          iconSize={16}
        >
          {captureModes?.find(m => m?.value === captureMode)?.label}
        </Button>

        {/* AI Status */}
        <div className="flex items-center space-x-2 px-3 py-1 bg-success/20 rounded-full">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-white font-medium">AI Active</span>
        </div>
      </div>
    </div>
  );
};

export default CaptureControls;