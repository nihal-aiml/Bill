import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleReportBillboard = () => {
    navigate('/camera-capture-ai-detection');
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-civic-card p-6 mb-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Camera" size={32} color="white" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Make Your City Better
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Spot an unauthorized billboard? Report it instantly with AI-powered detection and help improve urban governance.
        </p>
        <Button
          variant="default"
          size="lg"
          onClick={handleReportBillboard}
          iconName="Camera"
          iconPosition="left"
          iconSize={20}
          className="civic-shadow-lg civic-transition-fast hover:scale-105"
        >
          Report Billboard Now
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;