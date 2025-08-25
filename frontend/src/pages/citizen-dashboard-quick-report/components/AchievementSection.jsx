import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementSection = ({ achievements, userStats }) => {
  const badges = [
    {
      id: 'first_report',
      title: 'First Reporter',
      description: 'Submitted your first report',
      icon: 'Award',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      earned: achievements?.includes('first_report')
    },
    {
      id: 'civic_hero',
      title: 'Civic Hero',
      description: 'Submitted 10+ reports',
      icon: 'Shield',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      earned: achievements?.includes('civic_hero')
    },
    {
      id: 'community_champion',
      title: 'Community Champion',
      description: 'Helped resolve 5+ violations',
      icon: 'Crown',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      earned: achievements?.includes('community_champion')
    },
    {
      id: 'accuracy_expert',
      title: 'Accuracy Expert',
      description: '90%+ report accuracy rate',
      icon: 'Target',
      color: 'text-success',
      bgColor: 'bg-success/10',
      earned: achievements?.includes('accuracy_expert')
    }
  ];

  const impactStats = [
    {
      label: 'Reports Submitted',
      value: userStats?.totalReports,
      icon: 'FileText',
      color: 'text-primary'
    },
    {
      label: 'Violations Resolved',
      value: userStats?.resolvedReports,
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      label: 'Community Impact',
      value: `${userStats?.impactScore}%`,
      icon: 'TrendingUp',
      color: 'text-secondary'
    },
    {
      label: 'Accuracy Rate',
      value: `${userStats?.accuracyRate}%`,
      icon: 'Target',
      color: 'text-warning'
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Your Impact & Achievements</h2>
      {/* Impact Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {impactStats?.map((stat, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-civic-card p-4 text-center civic-transition-fast hover:civic-shadow-lg"
          >
            <Icon name={stat?.icon} size={24} className={`${stat?.color} mx-auto mb-2`} />
            <div className="text-2xl font-bold text-foreground mb-1">{stat?.value}</div>
            <div className="text-xs text-muted-foreground">{stat?.label}</div>
          </div>
        ))}
      </div>
      {/* Achievement Badges */}
      <div className="bg-card border border-border rounded-civic-card p-6">
        <h3 className="text-md font-medium text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Award" size={20} className="text-primary" />
          <span>Achievement Badges</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges?.map((badge) => (
            <div
              key={badge?.id}
              className={`${badge?.bgColor} border rounded-civic-card p-4 text-center civic-transition-fast ${
                badge?.earned 
                  ? 'border-current opacity-100 hover:scale-105' :'border-border opacity-50'
              }`}
            >
              <div className={`w-12 h-12 ${badge?.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Icon 
                  name={badge?.icon} 
                  size={24} 
                  className={badge?.earned ? badge?.color : 'text-muted-foreground'} 
                />
              </div>
              <h4 className={`font-medium mb-1 ${badge?.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                {badge?.title}
              </h4>
              <p className="text-xs text-muted-foreground">{badge?.description}</p>
              
              {badge?.earned && (
                <div className="mt-2">
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-success/20 text-success rounded-full text-xs font-medium">
                    <Icon name="Check" size={12} />
                    <span>Earned</span>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress to next achievement */}
        <div className="mt-6 p-4 bg-muted/50 rounded-civic">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Next Achievement</span>
            <span className="text-sm text-muted-foreground">7/10 reports</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full civic-transition" style={{ width: '70%' }}></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Submit 3 more reports to earn the "Civic Hero" badge
          </p>
        </div>
      </div>
    </div>
  );
};

export default AchievementSection;