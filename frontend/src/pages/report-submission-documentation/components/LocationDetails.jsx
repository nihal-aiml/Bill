import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LocationDetails = ({ 
  location, 
  onLocationUpdate, 
  className = '' 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLocation, setEditedLocation] = useState(location);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    setEditedLocation(location);
  }, [location]);

  const handleGetCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const newLocation = {
            ...editedLocation,
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
            accuracy: position?.coords?.accuracy
          };
          setEditedLocation(newLocation);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
        }
      );
    }
  };

  const handleSaveLocation = () => {
    if (onLocationUpdate) {
      onLocationUpdate(editedLocation);
    }
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedLocation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={`bg-card rounded-civic-card border border-border ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground">Location Details</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGetCurrentLocation}
              loading={isLoadingLocation}
              iconName="MapPin"
              iconPosition="left"
              iconSize={16}
            >
              Update GPS
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              iconName="Edit2"
              iconSize={16}
            />
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {/* Map Preview */}
        <div className="w-full h-48 rounded-civic border border-border overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Billboard Location"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${editedLocation?.latitude},${editedLocation?.longitude}&z=16&output=embed`}
            className="border-0"
          />
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground">Address</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={editedLocation?.address}
                  onChange={(e) => handleInputChange('address', e?.target?.value)}
                  placeholder="Enter address"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-muted-foreground mt-1">{editedLocation?.address}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">City</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={editedLocation?.city}
                  onChange={(e) => handleInputChange('city', e?.target?.value)}
                  placeholder="Enter city"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-muted-foreground mt-1">{editedLocation?.city}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">State</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={editedLocation?.state}
                  onChange={(e) => handleInputChange('state', e?.target?.value)}
                  placeholder="Enter state"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-muted-foreground mt-1">{editedLocation?.state}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground">Coordinates</label>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-muted-foreground">
                  Lat: {editedLocation?.latitude?.toFixed(6)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Lng: {editedLocation?.longitude?.toFixed(6)}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Accuracy</label>
              <p className="text-sm text-muted-foreground mt-1">
                ±{editedLocation?.accuracy}m
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Timestamp</label>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(editedLocation.timestamp)?.toLocaleString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Nearby Landmarks */}
        <div>
          <label className="text-sm font-medium text-foreground">Nearby Landmarks</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {editedLocation?.landmarks?.map((landmark, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
              >
                <Icon name="MapPin" size={12} className="mr-1" />
                {landmark}
              </span>
            ))}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSaveLocation}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDetails;