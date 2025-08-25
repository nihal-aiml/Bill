import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import CitizenDashboard from './pages/citizen-dashboard-quick-report';
import ReportSubmissionDocumentation from './pages/report-submission-documentation';
import CameraCaptureAIDetection from './pages/camera-capture-ai-detection';
import UserRegistrationLogin from './pages/user-registration-login';
import MunicipalAuthorityDashboard from './pages/municipal-authority-dashboard';
import AnalyticsComplianceReporting from './pages/analytics-compliance-reporting';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AnalyticsComplianceReporting />} />
        <Route path="/citizen-dashboard-quick-report" element={<CitizenDashboard />} />
        <Route path="/report-submission-documentation" element={<ReportSubmissionDocumentation />} />
        <Route path="/camera-capture-ai-detection" element={<CameraCaptureAIDetection />} />
        <Route path="/user-registration-login" element={<UserRegistrationLogin />} />
        <Route path="/municipal-authority-dashboard" element={<MunicipalAuthorityDashboard />} />
        <Route path="/analytics-compliance-reporting" element={<AnalyticsComplianceReporting />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
