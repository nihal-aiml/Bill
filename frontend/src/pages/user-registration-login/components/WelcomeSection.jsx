import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const WelcomeSection = ({ language = 'en' }) => {
  const content = {
    en: {
      title: 'Monitor Billboards,\nImprove Your City',
      subtitle: 'Join thousands of citizens and municipal authorities in creating safer, more compliant urban spaces through AI-powered billboard monitoring.',
      features: [
        {
          icon: 'Camera',
          title: 'AI-Powered Detection',
          description: 'Advanced computer vision technology automatically identifies billboard violations'
        },
        {
          icon: 'MapPin',
          title: 'Precise Geotagging',
          description: 'Accurate location tracking ensures proper documentation of violations'
        },
        {
          icon: 'Shield',
          title: 'Government Verified',
          description: 'Trusted by municipal authorities and civic organizations nationwide'
        }
      ],
      trustBadges: [
        'Government Approved',
        'Municipal Verified',
        'Civic Endorsed'
      ]
    },
    hi: {
      title: 'बिलबोर्ड की निगरानी करें,\nअपने शहर को बेहतर बनाएं',
      subtitle: 'AI-संचालित बिलबोर्ड निगरानी के माध्यम से सुरक्षित, अधिक अनुपालित शहरी स्थान बनाने में हजारों नागरिकों और नगरपालिका अधिकारियों के साथ जुड़ें।',
      features: [
        {
          icon: 'Camera',
          title: 'AI-संचालित पहचान',
          description: 'उन्नत कंप्यूटर विजन तकनीक स्वचालित रूप से बिलबोर्ड उल्लंघनों की पहचान करती है'
        },
        {
          icon: 'MapPin',
          title: 'सटीक जियोटैगिंग',
          description: 'सटीक स्थान ट्रैकिंग उल्लंघनों के उचित दस्तावेजीकरण को सुनिश्चित करती है'
        },
        {
          icon: 'Shield',
          title: 'सरकारी सत्यापित',
          description: 'देशभर की नगरपालिका अधिकारियों और नागरिक संगठनों द्वारा विश्वसनीय'
        }
      ],
      trustBadges: [
        'सरकारी अनुमोदित',
        'नगरपालिका सत्यापित',
        'नागरिक समर्थित'
      ]
    }
  };

  const t = content?.[language];

  return (
    <div className="hidden lg:flex flex-col justify-center h-full bg-gradient-to-br from-primary/5 to-secondary/5 p-8">
      <div className="max-w-md mx-auto">
        {/* Hero Image */}
        <div className="mb-8 relative">
          <div className="w-full h-64 rounded-civic-card overflow-hidden civic-shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=300&fit=crop"
              alt="Smart city billboard monitoring"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center civic-shadow-lg">
            <Icon name="Eye" size={32} color="white" />
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight whitespace-pre-line">
            {t?.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {t?.subtitle}
          </p>
        </div>

        {/* Features */}
        <div className="space-y-6 mb-8">
          {t?.features?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-civic flex items-center justify-center flex-shrink-0">
                <Icon name={feature?.icon} size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {feature?.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature?.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-2">
          {t?.trustBadges?.map((badge, index) => (
            <div
              key={index}
              className="inline-flex items-center space-x-1 bg-success/10 text-success px-3 py-1 rounded-full text-xs font-medium"
            >
              <Icon name="CheckCircle" size={12} />
              <span>{badge}</span>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">15K+</div>
            <div className="text-xs text-muted-foreground">Reports Filed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">98%</div>
            <div className="text-xs text-muted-foreground">Accuracy Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning">24/7</div>
            <div className="text-xs text-muted-foreground">Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;