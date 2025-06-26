"use client";

import * as React from "react";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Context for dropdown state management
interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  closeOnSelect: boolean;
}

const DropdownContext = React.createContext<DropdownContextType | null>(null);

// Hook to use dropdown context
function useDropdown() {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within DropdownMenu");
  }
  return context;
}

// Root dropdown component
interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  closeOnSelect?: boolean;
}

function DropdownMenu({
  children,
  open,
  onOpenChange,
  defaultOpen = false,
  closeOnSelect = true,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = open !== undefined ? open : internalOpen;
  
  const setIsOpen = React.useCallback((newOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [open, onOpenChange]);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, closeOnSelect }}>
      {children}
    </DropdownContext.Provider>
  );
}

// Trigger component
interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function DropdownMenuTrigger({ 
  children, 
  asChild = false,
  onClick,
  ...props 
}: DropdownMenuTriggerProps) {
  const { isOpen, setIsOpen } = useDropdown();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(!isOpen);
    onClick?.(e);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
        onClick: handleClick,
        'aria-expanded': isOpen,
        'aria-haspopup': 'menu',
    });
  }

  return (
    <button
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      {...props}
    >
      {children}
    </button>
  );
}

// Portal component (simplified)
function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
}

// Content component
interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

function DropdownMenuContent({
  children,
  className,
  sideOffset = 4,
  align = 'center',
  side = 'bottom',
  ...props
}: DropdownMenuContentProps) {
  const { isOpen, setIsOpen } = useDropdown();
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <DropdownMenuPortal>
      <div
        ref={contentRef}
        className={cn(
          "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "animate-in fade-in-0 zoom-in-95",
          side === 'bottom' && "slide-in-from-top-2",
          side === 'top' && "slide-in-from-bottom-2",
          side === 'left' && "slide-in-from-right-2",
          side === 'right' && "slide-in-from-left-2",
          className
        )}
        style={{
          transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)',
          marginTop: side === 'bottom' ? sideOffset : side === 'top' ? -sideOffset : 0,
          marginLeft: side === 'right' ? sideOffset : side === 'left' ? -sideOffset : 0,
        }}
        {...props}
      >
        {children}
      </div>
    </DropdownMenuPortal>
  );
}

// Group component
function DropdownMenuGroup({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="group" {...props}>{children}</div>;
}

// Menu item component
interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

function DropdownMenuItem({
  children,
  className,
  inset,
  variant = "default",
  disabled,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const { setIsOpen, closeOnSelect } = useDropdown();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    onClick?.(e);
    
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground",
        variant === "destructive" && "text-destructive focus:bg-destructive/10 focus:text-destructive",
        disabled && "pointer-events-none opacity-50",
        inset && "pl-8",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// Checkbox item component
interface DropdownMenuCheckboxItemProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

function DropdownMenuCheckboxItem({
  children,
  className,
  checked,
  onCheckedChange,
  disabled,
  onClick,
  ...props
}: DropdownMenuCheckboxItemProps) {
  const { closeOnSelect } = useDropdown();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    onCheckedChange?.(!checked);
    onClick?.(e);
    
    if (!closeOnSelect) {
      e.preventDefault();
    }
  };

  return (
    <div
      role="menuitemcheckbox"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <CheckIcon className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
}

// Radio group component
interface DropdownMenuRadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
} | null>(null);

function DropdownMenuRadioGroup({
  children,
  value,
  onValueChange,
  ...props
}: DropdownMenuRadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div role="radiogroup" {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

// Radio item component
interface DropdownMenuRadioItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

function DropdownMenuRadioItem({
  children,
  className,
  value,
  disabled,
  onClick,
  ...props
}: DropdownMenuRadioItemProps) {
  const radioContext = React.useContext(RadioGroupContext);
  const { setIsOpen, closeOnSelect } = useDropdown();
  const isSelected = radioContext?.value === value;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    radioContext?.onValueChange?.(value);
    onClick?.(e);
    
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  return (
    <div
      role="menuitemradio"
      aria-checked={isSelected}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <CircleIcon className="h-2 w-2 fill-current" />}
      </span>
      {children}
    </div>
  );
}

// Label component
interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

// Separator component
function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  );
}

// Shortcut component
function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
}

// Sub menu components
interface DropdownMenuSubProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SubMenuContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

function DropdownMenuSub({ children, open, onOpenChange }: DropdownMenuSubProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  
  const setIsOpen = React.useCallback((newOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [open, onOpenChange]);

  return (
    <SubMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SubMenuContext.Provider>
  );
}

// Sub trigger component
interface DropdownMenuSubTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
  disabled?: boolean;
}

function DropdownMenuSubTrigger({
  children,
  className,
  inset,
  disabled,
  ...props
}: DropdownMenuSubTriggerProps) {
  const subContext = React.useContext(SubMenuContext);

  return (
    <div
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        inset && "pl-8",
        className
      )}
      onMouseEnter={() => subContext?.setIsOpen(true)}
      onMouseLeave={() => subContext?.setIsOpen(false)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </div>
  );
}

// Sub content component
interface DropdownMenuSubContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function DropdownMenuSubContent({
  children,
  className,
  ...props
}: DropdownMenuSubContentProps) {
  const subContext = React.useContext(SubMenuContext);

  if (!subContext?.isOpen) return null;

  return (
    <div
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
        "animate-in fade-in-0 zoom-in-95 slide-in-from-left-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};