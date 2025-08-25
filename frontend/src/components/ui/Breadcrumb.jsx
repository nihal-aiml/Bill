import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Breadcrumb = ({ 
  items = [], 
  separator = 'ChevronRight',
  showHome = true,
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const defaultItems = showHome ? [
    { label: 'Dashboard', path: '/citizen-dashboard-quick-report', icon: 'Home' }
  ] : [];

  const allItems = [...defaultItems, ...items];

  if (allItems?.length <= 1) return null;

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {allItems?.map((item, index) => {
          const isLast = index === allItems?.length - 1;
          const isClickable = item?.path && !isLast;
          
          return (
            <li key={index} className="flex items-center space-x-1">
              {index > 0 && (
                <Icon 
                  name={separator} 
                  size={16} 
                  className="text-muted-foreground" 
                />
              )}
              <div className="flex items-center space-x-1">
                {item?.icon && (
                  <Icon 
                    name={item?.icon} 
                    size={16} 
                    className={isLast ? 'text-foreground' : 'text-muted-foreground'} 
                  />
                )}
                
                {isClickable ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation(item?.path)}
                    className="h-auto p-0 text-muted-foreground hover:text-foreground civic-transition-fast"
                  >
                    {item?.label}
                  </Button>
                ) : (
                  <span 
                    className={`${
                      isLast 
                        ? 'text-foreground font-medium' 
                        : 'text-muted-foreground'
                    }`}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item?.label}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;