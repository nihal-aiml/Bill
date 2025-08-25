import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ language = 'en' }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const mockCredentials = {
    citizen: { email: 'citizen@demo.com', password: 'citizen123' },
    municipal: { email: 'authority@demo.com', password: 'municipal123' }
  };

  const content = {
    en: {
      emailLabel: 'Email or Phone',
      emailPlaceholder: 'Enter your email or phone number',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot Password?',
      loginButton: 'Sign In',
      orText: 'Or continue with',
      googleLogin: 'Continue with Google',
      facebookLogin: 'Continue with Facebook',
      invalidCredentials: 'Invalid credentials. Use citizen@demo.com/citizen123 or authority@demo.com/municipal123'
    },
    hi: {
      emailLabel: 'ईमेल या फोन',
      emailPlaceholder: 'अपना ईमेल या फोन नंबर दर्ज करें',
      passwordLabel: 'पासवर्ड',
      passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
      rememberMe: 'मुझे याद रखें',
      forgotPassword: 'पासवर्ड भूल गए?',
      loginButton: 'साइन इन करें',
      orText: 'या इसके साथ जारी रखें',
      googleLogin: 'Google के साथ जारी रखें',
      facebookLogin: 'Facebook के साथ जारी रखें',
      invalidCredentials: 'गलत क्रेडेंशियल। citizen@demo.com/citizen123 या authority@demo.com/municipal123 का उपयोग करें'
    }
  };

  const t = content?.[language];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.emailOrPhone?.trim()) {
      newErrors.emailOrPhone = 'Email or phone is required';
    }
    
    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const { emailOrPhone, password } = formData;
      
      // Check credentials
      const isCitizen = emailOrPhone === mockCredentials?.citizen?.email && password === mockCredentials?.citizen?.password;
      const isMunicipal = emailOrPhone === mockCredentials?.municipal?.email && password === mockCredentials?.municipal?.password;
      
      if (isCitizen) {
        navigate('/citizen-dashboard-quick-report');
      } else if (isMunicipal) {
        navigate('/municipal-authority-dashboard');
      } else {
        setErrors({ general: t?.invalidCredentials });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/citizen-dashboard-quick-report');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors?.general && (
        <div className="bg-error/10 border border-error/20 rounded-civic p-3">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <p className="text-sm text-error">{errors?.general}</p>
          </div>
        </div>
      )}
      <Input
        label={t?.emailLabel}
        type="text"
        name="emailOrPhone"
        placeholder={t?.emailPlaceholder}
        value={formData?.emailOrPhone}
        onChange={handleInputChange}
        error={errors?.emailOrPhone}
        required
      />
      <Input
        label={t?.passwordLabel}
        type="password"
        name="password"
        placeholder={t?.passwordPlaceholder}
        value={formData?.password}
        onChange={handleInputChange}
        error={errors?.password}
        required
      />
      <div className="flex items-center justify-between">
        <Checkbox
          label={t?.rememberMe}
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
        />
        
        <Button variant="link" className="text-sm p-0 h-auto">
          {t?.forgotPassword}
        </Button>
      </div>
      <Button
        type="submit"
        fullWidth
        loading={isLoading}
        className="civic-transition-fast"
      >
        {t?.loginButton}
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">{t?.orText}</span>
        </div>
      </div>
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={() => handleSocialLogin('google')}
          iconName="Chrome"
          iconPosition="left"
          className="civic-transition-fast"
        >
          {t?.googleLogin}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={() => handleSocialLogin('facebook')}
          iconName="Facebook"
          iconPosition="left"
          className="civic-transition-fast"
        >
          {t?.facebookLogin}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;