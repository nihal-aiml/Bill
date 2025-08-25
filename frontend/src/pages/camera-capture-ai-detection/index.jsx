import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CameraViewfinder from './components/CameraViewfinder';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import LocationTracker from './components/LocationTracker';
import CaptureControls from './components/CaptureControls';
import BatchProcessingPanel from './components/BatchProcessingPanel';

const CameraCaptureAIDetection = () => {
  const navigate = useNavigate();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMode, setCaptureMode] = useState('single');
  const [capturedImages, setCapturedImages] = useState([]);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [showBatchPanel, setShowBatchPanel] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [detectedBillboards, setDetectedBillboards] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  // Mock detected billboards for demonstration
  const mockDetectedBillboards = [
    {
      x: 20,
      y: 30,
      width: 25,
      height: 15,
      compliance: 'violation',
      confidence: 94
    },
    {
      x: 60,
      y: 45,
      width: 20,
      height: 12,
      compliance: 'compliant',
      confidence: 87
    }
  ];

  useEffect(() => {
    // Simulate AI detection after component mounts
    const timer = setTimeout(() => {
      setDetectedBillboards(mockDetectedBillboards);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate('/citizen-dashboard-quick-report');
  };

  const handleCapture = async (imageBlob) => {
    // Add validation for imageBlob
    if (!imageBlob || !(imageBlob instanceof Blob)) {
      console.error('Invalid image blob received:', imageBlob);
      setIsCapturing(false);
      setIsAnalyzing(false);
      return;
    }

    setIsCapturing(true);
    setIsAnalyzing(true);

    try {
      // Simulate image processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newImage = {
        id: Date.now(),
        url: URL.createObjectURL(imageBlob),
        timestamp: new Date(),
        location: currentLocation,
        status: 'processing',
        blob: imageBlob
      };

      setCapturedImages(prev => [...prev, newImage]);

      // Simulate AI analysis
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisData({
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
            }
          ],
          gpsCoordinates: currentLocation || { latitude: 28.6139, longitude: 77.2090, accuracy: "±3 meters" },
          confidence: 91
        });
        setShowAnalysisPanel(true);
      }, 3000);

    } catch (error) {
      console.error('Capture error:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleLocationUpdate = (location, accuracy) => {
    setCurrentLocation({
      ...location,
      accuracy: `±${Math.round(accuracy)}m`
    });
  };

  const handleFlashToggle = () => {
    setFlashEnabled(!flashEnabled);
  };

  const handleGallery = () => {
    if (capturedImages?.length > 0) {
      setShowBatchPanel(true);
    }
  };

  const handleSwitchCamera = () => {
    // Implementation for switching between front/back camera
    console.log('Switching camera...');
  };

  const handleCaptureModeChange = (mode) => {
    setCaptureMode(mode);
    if (mode === 'batch' && capturedImages?.length > 0) {
      setShowBatchPanel(true);
    }
  };

  const handleAnalysisConfirm = () => {
    setShowAnalysisPanel(false);
    // Navigate to report submission with pre-filled data
    navigate('/report-submission-documentation', {
      state: {
        analysisData,
        capturedImages: capturedImages?.slice(-1), // Latest image
        location: currentLocation
      }
    });
  };

  const handleAnalysisCorrect = () => {
    setShowAnalysisPanel(false);
    // Allow user to manually correct the analysis
    console.log('Manual correction mode...');
  };

  const handleProcessAll = () => {
    console.log('Processing all images...');
    // Implement batch processing logic
  };

  const handleRemoveImage = (imageId) => {
    setCapturedImages(prev => {
      const updatedImages = prev?.filter(img => img?.id !== imageId);
      // Clean up object URLs to prevent memory leaks
      const imageToRemove = prev?.find(img => img?.id === imageId);
      if (imageToRemove?.url) {
        try {
          URL.revokeObjectURL(imageToRemove?.url);
        } catch (error) {
          console.warn('Failed to revoke object URL:', error);
        }
      }
      return updatedImages;
    });
  };

  const handleRetakeImage = (imageId) => {
    handleRemoveImage(imageId);
    setShowBatchPanel(false);
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Camera Viewfinder */}
      <CameraViewfinder
        onCapture={handleCapture}
        isCapturing={isCapturing}
        flashEnabled={flashEnabled}
        onFlashToggle={handleFlashToggle}
        detectedBillboards={detectedBillboards}
        isAnalyzing={isAnalyzing}
      />
      {/* Top Overlay Controls */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent h-20 z-overlay">
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
            <div className="bg-black/30 rounded-full px-3 py-1 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">AI Detection Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {capturedImages?.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBatchPanel(true)}
                className="text-white hover:bg-white/20 civic-transition-fast relative"
              >
                <Icon name="Images" size={20} color="white" />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {capturedImages?.length}
                </span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFlashToggle}
              className={`text-white hover:bg-white/20 civic-transition-fast ${flashEnabled ? 'bg-white/20' : ''}`}
            >
              <Icon name={flashEnabled ? "Zap" : "ZapOff"} size={20} color="white" />
            </Button>
          </div>
        </div>
      </div>
      {/* Location Tracker */}
      <LocationTracker
        onLocationUpdate={handleLocationUpdate}
        showAccuracy={true}
      />
      {/* Capture Controls */}
      <CaptureControls
        onCapture={handleCapture}
        onGallery={handleGallery}
        onSwitchCamera={handleSwitchCamera}
        onFlashToggle={handleFlashToggle}
        flashEnabled={flashEnabled}
        isCapturing={isCapturing}
        captureMode={captureMode}
        onCaptureModeChange={handleCaptureModeChange}
        capturedCount={capturedImages?.length}
      />
      {/* AI Analysis Panel */}
      <AIAnalysisPanel
        isVisible={showAnalysisPanel}
        analysisData={analysisData}
        onClose={() => setShowAnalysisPanel(false)}
        onConfirm={handleAnalysisConfirm}
        onCorrect={handleAnalysisCorrect}
        isProcessing={isAnalyzing}
      />
      {/* Batch Processing Panel */}
      <BatchProcessingPanel
        isVisible={showBatchPanel}
        capturedImages={capturedImages}
        onClose={() => setShowBatchPanel(false)}
        onProcessAll={handleProcessAll}
        onRemoveImage={handleRemoveImage}
        onRetakeImage={handleRetakeImage}
        processingStatus="idle"
      />
      {/* Detection Status Indicator */}
      {detectedBillboards?.length > 0 && !isAnalyzing && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-success/20 backdrop-blur-sm rounded-full px-4 py-2 z-overlay">
          <div className="flex items-center space-x-2">
            <Icon name="Eye" size={16} className="text-success" />
            <span className="text-success text-sm font-medium">
              {detectedBillboards?.length} billboard{detectedBillboards?.length > 1 ? 's' : ''} detected
            </span>
          </div>
        </div>
      )}
      {/* Help Overlay */}
      <div className="absolute bottom-40 left-4 right-4 text-center z-overlay">
        <div className="bg-black/30 backdrop-blur-sm rounded-civic px-4 py-2 inline-block">
          <p className="text-white text-sm">
            Point camera at billboards for AI detection
          </p>
        </div>
      </div>
    </div>
  );
};

export default CameraCaptureAIDetection;