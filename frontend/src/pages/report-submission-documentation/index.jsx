import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StatusNotification from '../../components/ui/StatusNotification';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { reportService } from '../../services/reportService';

// Import components
import ImagePreview from './components/ImagePreview';
import LocationDetails from './components/LocationDetails';
import ViolationForm from './components/ViolationForm';
import EvidenceUpload from './components/EvidenceUpload';
import ContactInformation from './components/ContactInformation';
import SubmissionSummary from './components/SubmissionSummary';

const ReportSubmissionDocumentation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get data from camera capture page
  const capturedData = location?.state || {};
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  // Form data state
  const [reportData, setReportData] = useState({
    image: capturedData?.image || null,
    imageFile: capturedData?.imageFile || null,
    annotations: capturedData?.annotations || [],
    location: capturedData?.location || {
      latitude: null,
      longitude: null,
      address: '',
      city: '',
      state: '',
      accuracy: 0,
      timestamp: new Date()?.toISOString(),
      landmarks: []
    },
    violations: [],
    priority: 'medium',
    description: '',
    estimatedSize: '',
    distanceFromRoad: '',
    trafficImpact: {},
    additionalImages: [],
    contact: {
      anonymous: false,
      name: '',
      email: '',
      phone: '',
      allowFollowUp: false,
      notifications: {},
      hasWitnesses: false,
      dataConsent: false
    }
  });

  const steps = [
    { id: 1, title: 'Image Review', icon: 'Image' },
    { id: 2, title: 'Location', icon: 'MapPin' },
    { id: 3, title: 'Violations', icon: 'AlertTriangle' },
    { id: 4, title: 'Evidence', icon: 'Camera' },
    { id: 5, title: 'Contact', icon: 'User' }
  ];

  // Auto-save draft functionality
  useEffect(() => {
    if (!user) return;

    const saveTimer = setTimeout(() => {
      localStorage.setItem(`billboardReportDraft_${user?.id}`, JSON.stringify(reportData));
      setIsDraftSaved(true);
      
      // Show auto-save notification
      const notification = {
        id: Date.now(),
        type: 'info',
        title: 'Draft saved automatically',
        message: 'Your progress has been saved locally',
        timestamp: new Date(),
        read: false
      };
      
      setNotifications(prev => [notification, ...prev]);
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [reportData, user]);

  // Load draft on component mount
  useEffect(() => {
    if (!user) return;

    const savedDraft = localStorage.getItem(`billboardReportDraft_${user?.id}`);
    if (savedDraft && !capturedData?.image) {
      try {
        const draftData = JSON.parse(savedDraft);
        setReportData(draftData);
        
        const notification = {
          id: Date.now(),
          type: 'success',
          title: 'Draft restored',
          message: 'Your previous report has been restored',
          timestamp: new Date(),
          read: false
        };
        
        setNotifications(prev => [notification, ...prev]);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [capturedData?.image, user]);

  const handleStepChange = (step) => {
    if (step <= currentStep + 1) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    if (currentStep < steps?.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormUpdate = (section, data) => {
    setReportData(prev => ({
      ...prev,
      [section]: { ...prev?.[section], ...data }
    }));
  };

  const handleImageAnnotationEdit = (updatedAnnotation) => {
    setReportData(prev => ({
      ...prev,
      annotations: prev?.annotations?.map(ann => 
        ann?.id === updatedAnnotation?.id ? updatedAnnotation : ann
      )
    }));
  };

  const handleImageReplace = () => {
    navigate('/camera-capture-ai-detection');
  };

  const handleLocationUpdate = (locationData) => {
    setReportData(prev => ({
      ...prev,
      location: locationData
    }));
  };

  const handleViolationUpdate = (violationData) => {
    setReportData(prev => ({
      ...prev,
      ...violationData
    }));
  };

  const handleEvidenceUpdate = (images) => {
    setReportData(prev => ({
      ...prev,
      additionalImages: images
    }));
  };

  const handleContactUpdate = (contactData) => {
    setReportData(prev => ({
      ...prev,
      contact: contactData
    }));
  };

  const handleVoiceInput = (isRecording) => {
    if (isRecording) {
      const notification = {
        id: Date.now(),
        type: 'info',
        title: 'Voice recording started',
        message: 'Speak clearly to add description',
        timestamp: new Date(),
        read: false
      };
      
      setNotifications(prev => [notification, ...prev]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      const notification = {
        id: Date.now(),
        type: 'error',
        title: 'Authentication required',
        message: 'Please sign in to submit reports',
        timestamp: new Date(),
        read: false
      };
      
      setNotifications(prev => [notification, ...prev]);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit report to Supabase with email notification
      const { data, error } = await reportService?.createReport(reportData);
      
      if (error) throw error;
      
      // Clear draft
      localStorage.removeItem(`billboardReportDraft_${user?.id}`);
      
      // Success notification
      const notification = {
        id: Date.now(),
        type: 'success',
        title: 'Report submitted successfully',
        message: 'Email sent to municipal authorities - Government will be notified directly',
        timestamp: new Date(),
        read: false,
        progress: 100
      };
      
      setNotifications(prev => [notification, ...prev]);
      
      // Navigate to dashboard with success message
      setTimeout(() => {
        navigate('/citizen-dashboard-quick-report', {
          state: { 
            reportSubmitted: true,
            reportId: data?.id,
            emailSent: true
          }
        });
      }, 2000);
      
    } catch (error) {
      console.error('Submission error:', error);
      const notification = {
        id: Date.now(),
        type: 'error',
        title: 'Submission failed',
        message: error?.message || 'Please check your connection and try again',
        timestamp: new Date(),
        read: false
      };
      
      setNotifications(prev => [notification, ...prev]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(n => n?.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev?.map(n => ({ ...n, read: true })));
  };

  const isStepComplete = (stepId) => {
    switch (stepId) {
      case 1: return reportData?.image && reportData?.annotations?.length > 0;
      case 2: return reportData?.location?.address && reportData?.location?.latitude;
      case 3: return reportData?.violations?.length > 0 && reportData?.description;
      case 4: return true; // Optional step
      case 5: return reportData?.contact?.anonymous || (reportData?.contact?.name && reportData?.contact?.email && reportData?.contact?.dataConsent);
      default: return false;
    }
  };

  const canProceed = isStepComplete(currentStep);

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <Icon name="Lock" size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to submit billboard reports</p>
          <Button onClick={() => navigate('/user-registration-login')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="min-h-screen bg-background">
        <Header userRole="citizen" />
        <StatusNotification
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
        
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Breadcrumb
              items={[
                { label: 'Report Billboard', path: '/camera-capture-ai-detection' },
                { label: 'Documentation', path: '/report-submission-documentation' },
                { label: 'Review & Submit' }
              ]}
              className="mb-6"
            />

            <SubmissionSummary
              reportData={reportData}
              onEdit={() => setShowSummary(false)}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/citizen-dashboard-quick-report')}
              isSubmitting={isSubmitting}
            />
          </div>
        </main>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ImagePreview
            image={reportData?.image}
            annotations={reportData?.annotations}
            onAnnotationEdit={handleImageAnnotationEdit}
            onImageReplace={handleImageReplace}
          />
        );
      case 2:
        return (
          <LocationDetails
            location={reportData?.location}
            onLocationUpdate={handleLocationUpdate}
          />
        );
      case 3:
        return (
          <ViolationForm
            formData={reportData}
            onFormUpdate={handleViolationUpdate}
            onVoiceInput={handleVoiceInput}
          />
        );
      case 4:
        return (
          <EvidenceUpload
            images={reportData?.additionalImages}
            onImagesUpdate={handleEvidenceUpdate}
          />
        );
      case 5:
        return (
          <ContactInformation
            contactData={reportData?.contact}
            onContactUpdate={handleContactUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="citizen" 
        onNotificationClick={handleNotificationClick}
      />
      <StatusNotification
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Report Billboard', path: '/camera-capture-ai-detection' },
              { label: 'Documentation' }
            ]}
            className="mb-6"
          />

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Report Documentation</h1>
                <p className="text-muted-foreground mt-1">
                  Complete your billboard violation report - Email will be sent directly to government authorities
                </p>
              </div>
              
              {isDraftSaved && (
                <div className="flex items-center space-x-2 text-sm text-success">
                  <Icon name="Check" size={16} />
                  <span>Draft saved</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps?.map((step, index) => (
                <div key={step?.id} className="flex items-center">
                  <button
                    onClick={() => handleStepChange(step?.id)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 civic-transition-fast ${
                      currentStep === step?.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isStepComplete(step?.id)
                        ? 'border-success bg-success text-success-foreground'
                        : currentStep > step?.id
                        ? 'border-primary text-primary hover:bg-primary/10' 
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    {isStepComplete(step?.id) && currentStep !== step?.id ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <Icon name={step?.icon} size={16} />
                    )}
                  </button>
                  
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep === step?.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step?.title}
                    </p>
                  </div>
                  
                  {index < steps?.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      isStepComplete(step?.id) ? 'bg-success' : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {renderStepContent()}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Card */}
              <div className="bg-card rounded-civic-card border border-border p-4">
                <h3 className="font-medium text-foreground mb-3">Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="text-foreground">
                      {steps?.filter(step => isStepComplete(step?.id))?.length}/{steps?.length}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full civic-transition"
                      style={{ 
                        width: `${(steps?.filter(step => isStepComplete(step?.id))?.length / steps?.length) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-primary/5 border border-primary/20 rounded-civic-card p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Mail" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Email Notification</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Report sent directly to government email</li>
                      <li>• Municipal authorities notified immediately</li>
                      <li>• Automatic email confirmation to reporter</li>
                      <li>• Status updates via email notifications</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col space-y-3">
                <Button
                  variant="default"
                  onClick={handleNext}
                  disabled={!canProceed}
                  iconName={currentStep === steps?.length ? "Eye" : "ArrowRight"}
                  iconPosition="right"
                  iconSize={16}
                  fullWidth
                >
                  {currentStep === steps?.length ? 'Review & Submit' : 'Next Step'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  iconSize={16}
                  fullWidth
                >
                  Previous
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => navigate('/citizen-dashboard-quick-report')}
                  fullWidth
                >
                  Save as Draft & Exit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportSubmissionDocumentation;