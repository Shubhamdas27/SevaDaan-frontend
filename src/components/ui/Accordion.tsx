import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export interface AccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
  children?: React.ReactNode;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = "single", collapsible = false, value, onValueChange, className, children, ...props }, ref) => {
    const [state, setState] = React.useState<string | string[]>(value || (type === "multiple" ? [] : ""));

    React.useEffect(() => {
      if (value !== undefined) {
        setState(value);
      }
    }, [value]);

    const handleValueChange = (itemValue: string) => {
      if (type === "single") {
        if (collapsible && state === itemValue) {
          const newState = "";
          setState(newState);
          onValueChange?.(newState);
        } else {
          setState(itemValue);
          onValueChange?.(itemValue);
        }
      } else {
        const currentItems = Array.isArray(state) ? state : [];
        if (currentItems.includes(itemValue)) {
          const newState = currentItems.filter((v) => v !== itemValue);
          setState(newState);
          onValueChange?.(newState);
        } else {
          const newState = [...currentItems, itemValue];
          setState(newState);
          onValueChange?.(newState);
        }
      }
    };

    const AccordionContext = React.useMemo(
      () => ({
        type,
        value: state,
        onValueChange: handleValueChange,
      }),
      [state, type]
    );

    return (
      <AccordionPrimitive.Provider value={AccordionContext}>
        <div ref={ref} className={cn("space-y-1", className)} {...props}>
          {children}
        </div>
      </AccordionPrimitive.Provider>
    );
  }
);

Accordion.displayName = "Accordion";

export interface AccordionItemProps {
  value: string;
  className?: string;
  children?: React.ReactNode;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, className, children, ...props }, ref) => {
    const { type, value: selectedValue } = React.useContext(AccordionPrimitive.AccordionContext);
    const isExpanded = type === "single"
      ? selectedValue === value
      : Array.isArray(selectedValue) && selectedValue.includes(value);

    return (
      <div
        ref={ref}
        data-state={isExpanded ? "open" : "closed"}
        className={cn("border-b", className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              isExpanded,
              value,
            } as any);
          }
          return child;
        })}
      </div>
    );
  }
);

AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps {
  className?: string;
  children?: React.ReactNode;
  value?: string;
  isExpanded?: boolean;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, value, isExpanded, ...props }, ref) => {
    const { onValueChange } = React.useContext(AccordionPrimitive.AccordionContext);

    return (
      <button
        ref={ref}
        onClick={() => value && onValueChange(value)}
        className={cn(
          "flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        )}
        data-state={isExpanded ? "open" : "closed"}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
      </button>
    );
  }
);

AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps {
  className?: string;
  children?: React.ReactNode;
  isExpanded?: boolean;
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, isExpanded, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-state={isExpanded ? "open" : "closed"}
        className={cn(
          "overflow-hidden text-sm transition-all",
          isExpanded ? "pb-4 pt-0" : "h-0 py-0",
          className
        )}
        {...props}
      >
        <div className="pb-4 pt-0">{children}</div>
      </div>
    );
  }
);

AccordionContent.displayName = "AccordionContent";

// Context for the Accordion component
const AccordionPrimitive = {
  Provider: ({ children, value }: { children: React.ReactNode; value: any }) => {
    const [context] = React.useState(value);
    return <AccordionContext.Provider value={context}>{children}</AccordionContext.Provider>;
  },
  AccordionContext: React.createContext<{
    type: "single" | "multiple";
    value: string | string[];
    onValueChange: (value: string) => void;
  }>({
    type: "single",
    value: "",
    onValueChange: () => {},
  }),
};

const AccordionContext = React.createContext<{
  type: "single" | "multiple";
  value: string | string[];
  onValueChange: (value: string) => void;
}>({
  type: "single",
  value: "",
  onValueChange: () => {},
});
