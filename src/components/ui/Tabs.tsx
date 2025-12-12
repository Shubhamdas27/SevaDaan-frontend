import * as React from 'react';
import { cn } from '../../lib/utils';

// Types
type TabsContextValue = {
  selectedValue: string | null;
  onChange: (value: string) => void;
};

// Context
const TabsContext = React.createContext<TabsContextValue>({
  selectedValue: null,
  onChange: () => {},
});

// Root Tabs component
interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: TabsProps) => {
  const [selectedValue, setSelectedValue] = React.useState<string | null>(
    value || defaultValue || null
  );

  // Update internal state when controlled value changes
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const onChange = React.useCallback(
    (newValue: string) => {
      setSelectedValue(newValue);
      onValueChange?.(newValue);
    },
    [onValueChange]
  );

  return (
    <TabsContext.Provider value={{ selectedValue, onChange }}>
      <div className={cn('tabs-container', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

// TabsList component
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList = ({ children, className }: TabsListProps) => {
  // Ensure only TabsTrigger components are rendered as direct children
  const validChildren = React.Children.toArray(children).filter(
    (child): child is React.ReactElement =>
      React.isValidElement(child) &&
      (child.type === TabsTrigger ||
        (child.type as React.ComponentType).displayName === TabsTrigger.displayName)
  );

  return (
    <div
      role="tablist"
      className={cn(
        'flex mb-4 p-1 bg-gray-100 rounded-lg',
        className
      )}
    >
      {validChildren.length > 0 ? (
        validChildren
      ) : (
        <div
          role="tab"
          aria-disabled="true"
          tabIndex={-1}
          className="opacity-50 pointer-events-none px-3 py-2"
        >
          No tabs available
        </div>
      )}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const TabsTrigger = ({
  value,
  children,
  className,
  disabled = false,
}: TabsTriggerProps) => {
  const { selectedValue, onChange } = React.useContext(TabsContext);
  const isSelected = selectedValue === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isSelected}
      disabled={disabled}
      onClick={() => onChange(value)}
      className={cn(
        'flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all',
        isSelected
          ? 'bg-white text-green-700 shadow'
          : 'text-gray-600 hover:text-gray-900',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      tabIndex={isSelected ? 0 : -1}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
    >
      {children}
    </button>
  );
};
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent = ({
  value,
  children,
  className,
}: TabsContentProps) => {
  const { selectedValue } = React.useContext(TabsContext);
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={cn('mt-2 focus:outline-none', className)}
    >
      {children}
    </div>
  );
};

export default { Tabs, TabsList, TabsTrigger, TabsContent };
