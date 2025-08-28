// src/components/common/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  // Color classes
  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600', 
    white: 'border-white'
  };

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`
          spinner 
          ${sizeClasses[size]} 
          ${colorClasses[color]}
        `}
      />
      {text && (
        <p className="mt-2 text-sm text-secondary-600">{text}</p>
      )}
    </div>
  );

  // Full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

export default LoadingSpinner;