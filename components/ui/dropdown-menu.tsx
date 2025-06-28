"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Context for managing dropdown state
interface DropdownMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

// Hook to use dropdown context
const useDropdownMenu = () => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("useDropdownMenu must be used within a DropdownMenu");
  }
  return context;
};

// Main DropdownMenu component
interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  
  const open = controlledOpen ?? uncontrolledOpen;
  const handleOpenChange = onOpenChange ?? setUncontrolledOpen;

  return (
    <DropdownMenuContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      <div className="relative">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

// DropdownMenuTrigger component
interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, asChild = false, ...props }, ref) => {
  const { open, onOpenChange } = useDropdownMenu();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onOpenChange(!open);
    props.onClick?.(event);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ...(children.props as any),
      ref,
      onClick: handleClick,
      "aria-expanded": open,
      "aria-haspopup": "menu",
    });
  }

  return (
    <button
      ref={ref}
      {...props}
      onClick={handleClick}
      aria-expanded={open}
      aria-haspopup="menu"
    >
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

// DropdownMenuContent component with alignOffset support
interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ 
  children, 
  align = "center", 
  alignOffset = 0,
  side = "bottom", 
  sideOffset = 0,
  className,
  style,
  ...props 
}, ref) => {
  const { open, onOpenChange } = useDropdownMenu();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, onOpenChange]);

  // Close dropdown on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onOpenChange]);

  if (!open) return null;

  // Calculate position based on side and align props
  const getPositionStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      position: "absolute",
      zIndex: 50,
    };

    // Apply side positioning
    switch (side) {
      case "top":
        styles.bottom = `calc(100% + ${sideOffset}px)`;
        break;
      case "right":
        styles.left = `calc(100% + ${sideOffset}px)`;
        break;
      case "left":
        styles.right = `calc(100% + ${sideOffset}px)`;
        break;
      case "bottom":
      default:
        styles.top = `calc(100% + ${sideOffset}px)`;
        break;
    }

    // Apply align positioning with alignOffset
    switch (align) {
      case "start":
        if (side === "top" || side === "bottom") {
          styles.left = `${alignOffset}px`;
        } else {
          styles.top = `${alignOffset}px`;
        }
        break;
      case "end":
        if (side === "top" || side === "bottom") {
          styles.right = `${-alignOffset}px`;
        } else {
          styles.bottom = `${-alignOffset}px`;
        }
        break;
      case "center":
      default:
        if (side === "top" || side === "bottom") {
          styles.left = "50%";
          styles.transform = `translateX(calc(-50% + ${alignOffset}px))`;
        } else {
          styles.top = "50%";
          styles.transform = `translateY(calc(-50% + ${alignOffset}px))`;
        }
        break;
    }

    return styles;
  };

  return (
    <div
      ref={(node) => {
        contentRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn(
        "min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      style={{
        ...getPositionStyles(),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

// DropdownMenuItem component
interface DropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, onClick, disabled = false, ...props }, ref) => {
  const { onOpenChange } = useDropdownMenu();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(event);
    onOpenChange(false);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

// DropdownMenuSeparator component
interface DropdownMenuSeparatorProps {
  className?: string;
}

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps & React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

// DropdownMenuLabel component
interface DropdownMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  DropdownMenuLabelProps & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  >
    {children}
  </div>
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
};