import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Camera Capture',
      description: 'Take photo with AI detection',
      icon: 'Camera',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      path: '/camera-capture-ai-detection'
    },
    {
      title: 'View Reports',
      description: 'Check all submissions',
      icon: 'FileText',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20',
      path: '/report-submission-documentation'
    },
    {
      title: 'Help & Guide',
      description: 'Learn how to report',
      icon: 'HelpCircle',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      path: '#'
    }
  ];

  const handleActionClick = (path) => {
    if (path !== '#') {
      navigate(path);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions?.map((action, index) => (
          <button
            key={index}
            onClick={() => handleActionClick(action?.path)}
            className={`${action?.bgColor} ${action?.borderColor} border rounded-civic-card p-4 text-left civic-transition-fast hover:scale-105 hover:civic-shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-10 h-10 ${action?.bgColor} rounded-civic flex items-center justify-center`}>
                <Icon name={action?.icon} size={20} className={action?.color} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{action?.title}</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{action?.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;