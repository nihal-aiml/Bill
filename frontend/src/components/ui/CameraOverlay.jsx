import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const CameraOverlay = ({ 
  isVisible = true, 
  onBack, 
  onCapture, 
  onFlash, 
  flashEnabled = false,
  isCapturing = false,
  captureProgress = 0 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/citizen-dashboard-quick-report');
    }
  };

  const handleCapture = () => {
    if (onCapture && !isCapturing) {
      onCapture();
    }
  };

  const handleFlashToggle = () => {
    if (onFlash) {
      onFlash(!flashEnabled);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-overlay pointer-events-none">
      {/* Top Overlay */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent h-20 pointer-events-auto">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-white hover:bg-white/20 civic-transition-fast"
          >
            <Icon name="ArrowLeft" size={24} color="white" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="bg-black/30 rounded-full px-3 py-1">
              <span className="text-white text-sm font-medium">AI Detection Active</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleFlashToggle}
            className={`text-white hover:bg-white/20 civic-transition-fast ${flashEnabled ? 'bg-white/20' : ''}`}
          >
            <Icon name={flashEnabled ? "Zap" : "ZapOff"} size={24} color="white" />
          </Button>
        </div>
      </div>

      {/* Bottom Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-32 pointer-events-auto">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-8">
            {/* Gallery Button */}
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full border-2 border-white/50 text-white hover:bg-white/20 civic-transition-fast"
            >
              <Icon name="Image" size={24} color="white" />
            </Button>

            {/* Capture Button */}
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
              
              {/* Progress Ring */}
              {isCapturing && captureProgress > 0 && (
                <svg className="absolute inset-0 w-20 h-20 -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - captureProgress / 100)}`}
                    className="civic-transition"
                  />
                </svg>
              )}
            </div>

            {/* Switch Camera Button */}
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full border-2 border-white/50 text-white hover:bg-white/20 civic-transition-fast"
            >
              <Icon name="RotateCcw" size={24} color="white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Detection Overlay */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="bg-black/30 rounded-civic px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">Scanning for violations...</span>
          </div>
        </div>
      </div>

      {/* Corner Guidelines */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 border-l-2 border-t-2 border-white/50 pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-8 h-8 border-r-2 border-t-2 border-white/50 pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-8 h-8 border-l-2 border-b-2 border-white/50 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-8 h-8 border-r-2 border-b-2 border-white/50 pointer-events-none"></div>
    </div>
  );
};

export default CameraOverlay;