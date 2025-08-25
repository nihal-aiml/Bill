import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import WelcomeSection from './components/WelcomeSection';
import LanguageToggle from './components/LanguageToggle';

const UserRegistrationLogin = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('billboard-monitor-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('billboard-monitor-language', newLanguage);
  };

  const content = {
    en: {
      pageTitle: 'Billboard Monitor - Login & Registration',
      appName: 'Billboard Monitor',
      appTagline: 'Civic Engagement Platform',
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Sign in to continue monitoring billboards in your city',
      registerTitle: 'Join the Community',
      registerSubtitle: 'Create your account to start reporting billboard violations'
    },
    hi: {
      pageTitle: 'बिलबोर्ड मॉनिटर - लॉगिन और पंजीकरण',
      appName: 'बिलबोर्ड मॉनिटर',
      appTagline: 'नागरिक सहभागिता मंच',
      loginTitle: 'वापस स्वागत है',
      loginSubtitle: 'अपने शहर में बिलबोर्ड की निगरानी जारी रखने के लिए साइन इन करें',
      registerTitle: 'समुदाय में शामिल हों',
      registerSubtitle: 'बिलबोर्ड उल्लंघनों की रिपोर्ट करना शुरू करने के लिए अपना खाता बनाएं'
    }
  };

  const t = content?.[language];

  return (
    <>
      <Helmet>
        <title>{t?.pageTitle}</title>
        <meta name="description" content="Secure login and registration for Billboard Monitor - AI-powered civic engagement platform for reporting billboard violations" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Eye" size={20} color="white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-foreground">{t?.appName}</h1>
                  <p className="text-xs text-muted-foreground">{t?.appTagline}</p>
                </div>
              </div>

              {/* Language Toggle */}
              <LanguageToggle 
                language={language} 
                onLanguageChange={handleLanguageChange} 
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
            {/* Welcome Section - Desktop Only */}
            <WelcomeSection language={language} />

            {/* Auth Form Section */}
            <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
              <div className="w-full max-w-md space-y-8">
                {/* Mobile Welcome Header */}
                <div className="lg:hidden text-center mb-8">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Eye" size={32} color="white" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {t?.appName}
                  </h1>
                  <p className="text-muted-foreground">
                    {t?.appTagline}
                  </p>
                </div>

                {/* Auth Card */}
                <div className="bg-card rounded-civic-card civic-shadow-lg p-6 sm:p-8 border border-border">
                  {/* Form Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {activeTab === 'login' ? t?.loginTitle : t?.registerTitle}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {activeTab === 'login' ? t?.loginSubtitle : t?.registerSubtitle}
                    </p>
                  </div>

                  {/* Auth Tabs */}
                  <AuthTabs 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                  />

                  {/* Auth Forms */}
                  {activeTab === 'login' ? (
                    <LoginForm language={language} />
                  ) : (
                    <RegisterForm language={language} />
                  )}
                </div>

                {/* Mobile Trust Badges */}
                <div className="lg:hidden flex justify-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Shield" size={12} className="text-success" />
                    <span>{language === 'hi' ? 'सुरक्षित' : 'Secure'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="CheckCircle" size={12} className="text-success" />
                    <span>{language === 'hi' ? 'सत्यापित' : 'Verified'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={12} className="text-success" />
                    <span>{language === 'hi' ? '15K+ उपयोगकर्ता' : '15K+ Users'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                <span>© {new Date()?.getFullYear()} Billboard Monitor</span>
                <span>•</span>
                <span>{language === 'hi' ? 'सभी अधिकार सुरक्षित' : 'All rights reserved'}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>{language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}</span>
                <span>•</span>
                <span>{language === 'hi' ? 'सेवा की शर्तें' : 'Terms of Service'}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default UserRegistrationLogin;