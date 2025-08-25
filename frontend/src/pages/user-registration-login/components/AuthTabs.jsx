import React from 'react';
import Button from '../../../components/ui/Button';

const AuthTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'login', label: 'Login', labelHi: 'लॉगिन' },
    { id: 'register', label: 'Register', labelHi: 'पंजीकरण' }
  ];

  return (
    <div className="flex bg-muted rounded-civic p-1 mb-6">
      {tabs?.map((tab) => (
        <Button
          key={tab?.id}
          variant={activeTab === tab?.id ? "default" : "ghost"}
          fullWidth
          onClick={() => onTabChange(tab?.id)}
          className="civic-transition-fast"
        >
          {tab?.label}
        </Button>
      ))}
    </div>
  );
};

export default AuthTabs;