import React from 'react';
import { cn } from '../../lib/utils';
import { getInitials } from '../../lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = '', name, size = 'md', ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const sizeClasses = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
    };

    const handleImageError = () => {
      setImageError(true);
    };

    return (
      <div
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-slate-200',
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : name ? (
          <span className="font-medium text-slate-700">{getInitials(name)}</span>
        ) : (
          <span className="font-medium text-slate-700">
            {alt ? getInitials(alt) : 'U'}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };