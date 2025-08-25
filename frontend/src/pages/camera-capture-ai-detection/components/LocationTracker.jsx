import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LocationTracker = ({ onLocationUpdate, showAccuracy = true }) => {
  const [location, setLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsTracking(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
          timestamp: new Date()?.toISOString()
        };
        
        setLocation(newLocation);
        setAccuracy(position?.coords?.accuracy);
        setIsTracking(false);
        
        if (onLocationUpdate) {
          onLocationUpdate(newLocation, position?.coords?.accuracy);
        }
      },
      (error) => {
        setIsTracking(false);
        switch (error?.code) {
          case error?.PERMISSION_DENIED:
            setError('Location access denied by user');
            break;
          case error?.POSITION_UNAVAILABLE:
            setError('Location information unavailable');
            break;
          case error?.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('An unknown error occurred');
            break;
        }
      },
      options
    );
  };

  const formatCoordinate = (coord) => {
    return coord ? coord?.toFixed(6) : '---';
  };

  const getAccuracyColor = () => {
    if (!accuracy) return 'text-muted-foreground';
    if (accuracy <= 5) return 'text-success';
    if (accuracy <= 15) return 'text-warning';
    return 'text-error';
  };

  const getAccuracyText = () => {
    if (!accuracy) return 'Unknown';
    if (accuracy <= 5) return 'High';
    if (accuracy <= 15) return 'Medium';
    return 'Low';
  };

  return (
    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-civic p-3 text-white min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon 
            name={isTracking ? "Loader" : location ? "MapPin" : "MapPinOff"} 
            size={16} 
            className={isTracking ? "animate-spin" : ""} 
          />
          <span className="text-sm font-medium">Location</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={getCurrentLocation}
          disabled={isTracking}
          className="w-6 h-6 text-white hover:bg-white/20"
        >
          <Icon name="RefreshCw" size={12} />
        </Button>
      </div>
      {error ? (
        <div className="text-xs text-error">
          <p>{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={getCurrentLocation}
            className="mt-1 h-6 text-xs text-white hover:bg-white/20"
          >
            Retry
          </Button>
        </div>
      ) : location ? (
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="opacity-80">Lat:</span>
            <span className="font-mono">{formatCoordinate(location?.latitude)}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-80">Lng:</span>
            <span className="font-mono">{formatCoordinate(location?.longitude)}</span>
          </div>
          {showAccuracy && accuracy && (
            <div className="flex justify-between items-center pt-1 border-t border-white/20">
              <span className="opacity-80">Accuracy:</span>
              <div className="flex items-center space-x-1">
                <span className={`font-medium ${getAccuracyColor()}`}>
                  {getAccuracyText()}
                </span>
                <span className="opacity-60">
                  (±{Math.round(accuracy)}m)
                </span>
              </div>
            </div>
          )}
        </div>
      ) : isTracking ? (
        <div className="text-xs opacity-80">
          Getting location...
        </div>
      ) : (
        <div className="text-xs opacity-80">
          Location unavailable
        </div>
      )}
      {/* Manual Location Adjustment */}
      {location && (
        <div className="mt-2 pt-2 border-t border-white/20">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-6 text-xs text-white hover:bg-white/20"
            iconName="Edit"
            iconSize={12}
            iconPosition="left"
          >
            Adjust Location
          </Button>
        </div>
      )}
    </div>
  );
};

export default LocationTracker;