import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const ViolationForm = ({ 
  formData, 
  onFormUpdate, 
  onVoiceInput,
  className = '' 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [characterCount, setCharacterCount] = useState(formData?.description?.length || 0);

  const violationTypes = [
    { id: 'oversized', label: 'Oversized Dimensions', description: 'Billboard exceeds permitted size limits' },
    { id: 'unsafe_placement', label: 'Unsafe Placement', description: 'Located in hazardous or restricted area' },
    { id: 'missing_permit', label: 'Missing Permits', description: 'No valid permit displayed or expired' },
    { id: 'traffic_obstruction', label: 'Traffic Signal Proximity', description: 'Too close to traffic signals or intersections' },
    { id: 'structural_damage', label: 'Structural Damage', description: 'Physical damage or deterioration' },
    { id: 'content_violation', label: 'Content Violation', description: 'Inappropriate or prohibited content' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', description: 'Minor violation, no immediate safety concern' },
    { value: 'medium', label: 'Medium Priority', description: 'Moderate violation requiring attention' },
    { value: 'high', label: 'High Priority', description: 'Significant violation affecting safety' },
    { value: 'emergency', label: 'Emergency', description: 'Immediate safety hazard requiring urgent action' }
  ];

  const handleViolationChange = (violationId, checked) => {
    const updatedViolations = checked
      ? [...(formData?.violations || []), violationId]
      : (formData?.violations || [])?.filter(id => id !== violationId);
    
    onFormUpdate({ violations: updatedViolations });
  };

  const handleDescriptionChange = (value) => {
    setCharacterCount(value?.length);
    onFormUpdate({ description: value });
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (onVoiceInput) {
      onVoiceInput(!isRecording);
    }
  };

  const handleInputChange = (field, value) => {
    onFormUpdate({ [field]: value });
  };

  return (
    <div className={`bg-card rounded-civic-card border border-border ${className}`}>
      <div className="p-4 border-b border-border">
        <h3 className="font-medium text-foreground">Violation Details</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Provide detailed information about the billboard violation
        </p>
      </div>
      <div className="p-4 space-y-6">
        {/* Violation Types */}
        <div>
          <CheckboxGroup 
            label="Violation Categories" 
            description="Select all applicable violations (multiple selections allowed)"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {violationTypes?.map((violation) => (
                <div key={violation?.id} className="border border-border rounded-civic p-3 civic-transition-fast hover:bg-muted/50">
                  <Checkbox
                    label={violation?.label}
                    description={violation?.description}
                    checked={(formData?.violations || [])?.includes(violation?.id)}
                    onChange={(e) => handleViolationChange(violation?.id, e?.target?.checked)}
                  />
                </div>
              ))}
            </div>
          </CheckboxGroup>
        </div>

        {/* Priority Level */}
        <div>
          <Select
            label="Priority Level"
            description="Help authorities prioritize this report"
            options={priorityOptions}
            value={formData?.priority}
            onChange={(value) => handleInputChange('priority', value)}
            placeholder="Select priority level"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Detailed Description
            <span className="text-error ml-1">*</span>
          </label>
          <div className="relative">
            <textarea
              value={formData?.description || ''}
              onChange={(e) => handleDescriptionChange(e?.target?.value)}
              placeholder="Describe the violation in detail. Include specific measurements, safety concerns, and any other relevant information..."
              className="w-full h-32 p-3 border border-border rounded-civic bg-input text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              maxLength={500}
            />
            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
              <span className={`text-xs ${characterCount > 450 ? 'text-warning' : 'text-muted-foreground'}`}>
                {characterCount}/500
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleVoiceRecording}
                className={`w-8 h-8 ${isRecording ? 'text-error' : 'text-muted-foreground'}`}
              >
                <Icon name={isRecording ? "MicOff" : "Mic"} size={16} />
              </Button>
            </div>
          </div>
          {isRecording && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-error">
              <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
              <span>Recording... Speak clearly</span>
            </div>
          )}
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Billboard Size (Estimated)"
            type="text"
            placeholder="e.g., 20ft x 10ft"
            value={formData?.estimatedSize || ''}
            onChange={(e) => handleInputChange('estimatedSize', e?.target?.value)}
          />

          <Input
            label="Distance from Road"
            type="text"
            placeholder="e.g., 5 meters"
            value={formData?.distanceFromRoad || ''}
            onChange={(e) => handleInputChange('distanceFromRoad', e?.target?.value)}
          />
        </div>

        {/* Traffic Impact */}
        <div>
          <CheckboxGroup label="Traffic Impact Assessment">
            <div className="space-y-2 mt-3">
              <Checkbox
                label="Obstructs driver visibility"
                checked={formData?.trafficImpact?.visibility || false}
                onChange={(e) => handleInputChange('trafficImpact', { 
                  ...formData?.trafficImpact, 
                  visibility: e?.target?.checked 
                })}
              />
              <Checkbox
                label="Creates distraction for drivers"
                checked={formData?.trafficImpact?.distraction || false}
                onChange={(e) => handleInputChange('trafficImpact', { 
                  ...formData?.trafficImpact, 
                  distraction: e?.target?.checked 
                })}
              />
              <Checkbox
                label="Blocks traffic signs or signals"
                checked={formData?.trafficImpact?.signalBlocking || false}
                onChange={(e) => handleInputChange('trafficImpact', { 
                  ...formData?.trafficImpact, 
                  signalBlocking: e?.target?.checked 
                })}
              />
            </div>
          </CheckboxGroup>
        </div>
      </div>
    </div>
  );
};

export default ViolationForm;