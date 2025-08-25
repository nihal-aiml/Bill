import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';


const RegisterForm = ({ language = 'en' }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    userType: '',
    password: '',
    confirmPassword: '',
    employeeId: '',
    department: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const content = {
    en: {
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email address',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'Enter your phone number',
      userTypeLabel: 'User Type',
      userTypePlaceholder: 'Select user type',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Create a strong password',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      employeeIdLabel: 'Employee ID',
      employeeIdPlaceholder: 'Enter your employee ID',
      departmentLabel: 'Department',
      departmentPlaceholder: 'Select your department',
      agreeToTerms: 'I agree to the Terms of Service and Privacy Policy',
      registerButton: 'Create Account',
      passwordStrengthWeak: 'Weak',
      passwordStrengthMedium: 'Medium',
      passwordStrengthStrong: 'Strong'
    },
    hi: {
      fullNameLabel: 'पूरा नाम',
      fullNamePlaceholder: 'अपना पूरा नाम दर्ज करें',
      emailLabel: 'ईमेल पता',
      emailPlaceholder: 'अपना ईमेल पता दर्ज करें',
      phoneLabel: 'फोन नंबर',
      phonePlaceholder: 'अपना फोन नंबर दर्ज करें',
      userTypeLabel: 'उपयोगकर्ता प्रकार',
      userTypePlaceholder: 'उपयोगकर्ता प्रकार चुनें',
      passwordLabel: 'पासवर्ड',
      passwordPlaceholder: 'एक मजबूत पासवर्ड बनाएं',
      confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
      confirmPasswordPlaceholder: 'अपने पासवर्ड की पुष्टि करें',
      employeeIdLabel: 'कर्मचारी आईडी',
      employeeIdPlaceholder: 'अपनी कर्मचारी आईडी दर्ज करें',
      departmentLabel: 'विभाग',
      departmentPlaceholder: 'अपना विभाग चुनें',
      agreeToTerms: 'मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूं',
      registerButton: 'खाता बनाएं',
      passwordStrengthWeak: 'कमजोर',
      passwordStrengthMedium: 'मध्यम',
      passwordStrengthStrong: 'मजबूत'
    }
  };

  const t = content?.[language];

  const userTypeOptions = [
    { value: 'citizen', label: language === 'hi' ? 'नागरिक' : 'Citizen' },
    { value: 'municipal', label: language === 'hi' ? 'नगरपालिका प्राधिकरण' : 'Municipal Authority' }
  ];

  const departmentOptions = [
    { value: 'urban-planning', label: language === 'hi' ? 'शहरी नियोजन' : 'Urban Planning' },
    { value: 'traffic-police', label: language === 'hi' ? 'ट्रैफिक पुलिस' : 'Traffic Police' },
    { value: 'municipal-corporation', label: language === 'hi' ? 'नगर निगम' : 'Municipal Corporation' },
    { value: 'road-safety', label: language === 'hi' ? 'सड़क सुरक्षा' : 'Road Safety' }
  ];

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength += 1;
    if (/[A-Z]/?.test(password)) strength += 1;
    if (/[a-z]/?.test(password)) strength += 1;
    if (/[0-9]/?.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/?.test(password)) strength += 1;
    return Math.min(strength, 3);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData?.userType) {
      newErrors.userType = 'User type is required';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData?.userType === 'municipal') {
      if (!formData?.employeeId?.trim()) {
        newErrors.employeeId = 'Employee ID is required for municipal users';
      }
      if (!formData?.department) {
        newErrors.department = 'Department is required for municipal users';
      }
    }
    
    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
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
      const redirectPath = formData?.userType === 'citizen' ?'/citizen-dashboard-quick-report' :'/municipal-authority-dashboard';
      navigate(redirectPath);
      setIsLoading(false);
    }, 2000);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return 'bg-error';
      case 2: return 'bg-warning';
      case 3: return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 1: return t?.passwordStrengthWeak;
      case 2: return t?.passwordStrengthMedium;
      case 3: return t?.passwordStrengthStrong;
      default: return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t?.fullNameLabel}
          type="text"
          name="fullName"
          placeholder={t?.fullNamePlaceholder}
          value={formData?.fullName}
          onChange={handleInputChange}
          error={errors?.fullName}
          required
        />

        <Input
          label={t?.emailLabel}
          type="email"
          name="email"
          placeholder={t?.emailPlaceholder}
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t?.phoneLabel}
          type="tel"
          name="phone"
          placeholder={t?.phonePlaceholder}
          value={formData?.phone}
          onChange={handleInputChange}
          error={errors?.phone}
          required
        />

        <Select
          label={t?.userTypeLabel}
          placeholder={t?.userTypePlaceholder}
          options={userTypeOptions}
          value={formData?.userType}
          onChange={(value) => handleSelectChange('userType', value)}
          error={errors?.userType}
          required
        />
      </div>
      {formData?.userType === 'municipal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-civic">
          <Input
            label={t?.employeeIdLabel}
            type="text"
            name="employeeId"
            placeholder={t?.employeeIdPlaceholder}
            value={formData?.employeeId}
            onChange={handleInputChange}
            error={errors?.employeeId}
            required
          />

          <Select
            label={t?.departmentLabel}
            placeholder={t?.departmentPlaceholder}
            options={departmentOptions}
            value={formData?.department}
            onChange={(value) => handleSelectChange('department', value)}
            error={errors?.department}
            required
          />
        </div>
      )}
      <div className="space-y-4">
        <div>
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
          
          {formData?.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Password Strength</span>
                <span>{getPasswordStrengthText()}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full civic-transition ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 3) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Input
          label={t?.confirmPasswordLabel}
          type="password"
          name="confirmPassword"
          placeholder={t?.confirmPasswordPlaceholder}
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          error={errors?.confirmPassword}
          required
        />
      </div>
      <Checkbox
        label={t?.agreeToTerms}
        name="agreeToTerms"
        checked={formData?.agreeToTerms}
        onChange={handleInputChange}
        error={errors?.agreeToTerms}
        required
      />
      <Button
        type="submit"
        fullWidth
        loading={isLoading}
        className="civic-transition-fast"
      >
        {t?.registerButton}
      </Button>
    </form>
  );
};

export default RegisterForm;