import * as React from 'react';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, checked, onCheckedChange, onChange, ...props }, ref) => {
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onCheckedChange?.(event.target.checked);
    };
    
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            className={cn(
              'h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500',
              error && 'border-red-500',
              className
            )}
            ref={ref}
            checked={checked}
            onChange={handleChange}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-2 text-sm">
            <label 
              className={cn(
                "font-medium text-gray-700",
                error && "text-red-500"
              )}
              htmlFor={props.id}
            >
              {label}
            </label>
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
