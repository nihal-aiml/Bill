import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LanguageToggle = ({ language, onLanguageChange }) => {
  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' }
  ];

  const currentLanguage = languages?.find(lang => lang?.code === language);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
        className="civic-transition-fast"
      >
        <span className="mr-2">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline">{currentLanguage?.label}</span>
        <Icon name="ChevronDown" size={16} className="ml-1" />
      </Button>
    </div>
  );
};

export default LanguageToggle;