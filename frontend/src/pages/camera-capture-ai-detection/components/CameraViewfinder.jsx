import React, { useRef, useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CameraViewfinder = ({ 
  onCapture, 
  isCapturing = false, 
  flashEnabled = false, 
  onFlashToggle,
  detectedBillboards = [],
  isAnalyzing = false 
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream?.getTracks()?.forEach(track => track?.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices?.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      if (videoRef?.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setError(null);
      }
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions.');
      console.error('Camera error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const captureImage = () => {
    if (!videoRef?.current || !canvasRef?.current || isCapturing) return;

    const video = videoRef?.current;
    const canvas = canvasRef?.current;
    const context = canvas?.getContext('2d');

    // Validate video dimensions
    if (!video?.videoWidth || !video?.videoHeight) {
      console.error('Video dimensions not available');
      return;
    }

    canvas.width = video?.videoWidth;
    canvas.height = video?.videoHeight;
    
    try {
      context?.drawImage(video, 0, 0);

      canvas?.toBlob((blob) => {
        // Validate blob before calling onCapture
        if (blob && blob instanceof Blob && blob?.size > 0) {
          if (onCapture) {
            onCapture(blob);
          }
        } else {
          console.error('Failed to create blob from canvas');
          // Optionally show user-friendly error message
        }
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const getBoundingBoxColor = (compliance) => {
    switch (compliance) {
      case 'compliant': return 'border-success';
      case 'violation': return 'border-error';
      case 'uncertain': return 'border-warning';
      default: return 'border-primary';
    }
  };

  if (error) {
    return (
      <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <Icon name="Camera" size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Camera Access Required</p>
          <p className="text-sm opacity-80 mb-4">{error}</p>
          <Button variant="outline" onClick={startCamera} className="text-white border-white hover:bg-white hover:text-gray-900">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm">Initializing camera...</p>
          </div>
        </div>
      )}
      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        onLoadedMetadata={() => setIsLoading(false)}
      />
      {/* Hidden Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" />
      {/* AI Detection Overlays */}
      {detectedBillboards?.map((billboard, index) => (
        <div
          key={index}
          className={`absolute border-2 ${getBoundingBoxColor(billboard?.compliance)} pointer-events-none`}
          style={{
            left: `${billboard?.x}%`,
            top: `${billboard?.y}%`,
            width: `${billboard?.width}%`,
            height: `${billboard?.height}%`
          }}
        >
          <div className={`absolute -top-6 left-0 px-2 py-1 text-xs font-medium rounded ${
            billboard?.compliance === 'compliant' ? 'bg-success text-white' :
            billboard?.compliance === 'violation' ? 'bg-error text-white' :
            billboard?.compliance === 'uncertain'? 'bg-warning text-gray-900' : 'bg-primary text-white'
          }`}>
            {billboard?.confidence}% confident
          </div>
        </div>
      ))}
      {/* Analysis Status */}
      {isAnalyzing && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 rounded-civic px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-white">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">AI analyzing scene...</span>
          </div>
        </div>
      )}
      {/* Capture Button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <Button
          variant="ghost"
          size="icon"
          onClick={captureImage}
          disabled={isCapturing || isLoading}
          className="w-20 h-20 rounded-full border-4 border-white bg-white/10 hover:bg-white/20 civic-transition-fast disabled:opacity-50"
        >
          {isCapturing ? (
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="w-8 h-8 bg-white rounded-full" />
          )}
        </Button>
      </div>
      {/* Flash Toggle */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onFlashToggle}
          className={`text-white hover:bg-white/20 civic-transition-fast ${flashEnabled ? 'bg-white/20' : ''}`}
        >
          <Icon name={flashEnabled ? "Zap" : "ZapOff"} size={24} color="white" />
        </Button>
      </div>
      {/* Corner Guidelines */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 border-l-2 border-t-2 border-white/50 pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-8 h-8 border-r-2 border-t-2 border-white/50 pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-8 h-8 border-l-2 border-b-2 border-white/50 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-8 h-8 border-r-2 border-b-2 border-white/50 pointer-events-none"></div>
    </div>
  );
};

export default CameraViewfinder;