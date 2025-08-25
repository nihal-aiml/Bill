import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ContactInformation = ({ 
  contactData, 
  onContactUpdate, 
  className = '' 
}) => {
  const [isAnonymous, setIsAnonymous] = useState(contactData?.anonymous || false);

  const handleAnonymousChange = (checked) => {
    setIsAnonymous(checked);
    onContactUpdate({ 
      ...contactData, 
      anonymous: checked,
      ...(checked && {
        name: '',
        email: '',
        phone: '',
        allowFollowUp: false
      })
    });
  };

  const handleInputChange = (field, value) => {
    onContactUpdate({ 
      ...contactData, 
      [field]: value 
    });
  };

  return (
    <div className={`bg-card rounded-civic-card border border-border ${className}`}>
      <div className="p-4 border-b border-border">
        <h3 className="font-medium text-foreground">Contact Information</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Provide your contact details for follow-up or submit anonymously
        </p>
      </div>
      <div className="p-4 space-y-4">
        {/* Anonymous Reporting Option */}
        <div className="bg-muted/50 rounded-civic p-4">
          <Checkbox
            label="Submit this report anonymously"
            description="Your identity will not be shared with authorities or stored in our records"
            checked={isAnonymous}
            onChange={(e) => handleAnonymousChange(e?.target?.checked)}
          />
        </div>

        {!isAnonymous && (
          <>
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  value={contactData?.name || ''}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  value={contactData?.email || ''}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                />
              </div>

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 98765 43210"
                value={contactData?.phone || ''}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
              />
            </div>

            {/* Follow-up Preferences */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Communication Preferences</h4>
              
              <Checkbox
                label="Allow follow-up communication"
                description="Authorities may contact you for additional information or updates"
                checked={contactData?.allowFollowUp || false}
                onChange={(e) => handleInputChange('allowFollowUp', e?.target?.checked)}
              />

              {contactData?.allowFollowUp && (
                <div className="ml-6 space-y-2">
                  <Checkbox
                    label="Email notifications"
                    checked={contactData?.notifications?.email || false}
                    onChange={(e) => handleInputChange('notifications', {
                      ...contactData?.notifications,
                      email: e?.target?.checked
                    })}
                  />
                  <Checkbox
                    label="SMS notifications"
                    checked={contactData?.notifications?.sms || false}
                    onChange={(e) => handleInputChange('notifications', {
                      ...contactData?.notifications,
                      sms: e?.target?.checked
                    })}
                  />
                </div>
              )}
            </div>

            {/* Witness Information */}
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium text-foreground mb-3">Witness Information (Optional)</h4>
              
              <Checkbox
                label="I have witnesses to this violation"
                checked={contactData?.hasWitnesses || false}
                onChange={(e) => handleInputChange('hasWitnesses', e?.target?.checked)}
              />

              {contactData?.hasWitnesses && (
                <div className="mt-3 space-y-3">
                  <Input
                    label="Witness Name"
                    type="text"
                    placeholder="Enter witness name"
                    value={contactData?.witnessName || ''}
                    onChange={(e) => handleInputChange('witnessName', e?.target?.value)}
                  />
                  
                  <Input
                    label="Witness Contact"
                    type="text"
                    placeholder="Phone or email"
                    value={contactData?.witnessContact || ''}
                    onChange={(e) => handleInputChange('witnessContact', e?.target?.value)}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Privacy Notice */}
        <div className="bg-primary/5 border border-primary/20 rounded-civic p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Privacy Protection</h4>
              <p className="text-xs text-muted-foreground">
                {isAnonymous 
                  ? "Your report will be submitted without any identifying information. We cannot provide status updates for anonymous reports."
                  : "Your personal information is encrypted and only shared with relevant municipal authorities for report processing. You can request data deletion at any time."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Data Consent */}
        {!isAnonymous && (
          <Checkbox
            label="I consent to data processing"
            description="I agree to the processing of my personal data for the purpose of this report and municipal compliance activities"
            checked={contactData?.dataConsent || false}
            onChange={(e) => handleInputChange('dataConsent', e?.target?.checked)}
            required
          />
        )}
      </div>
    </div>
  );
};

export default ContactInformation;