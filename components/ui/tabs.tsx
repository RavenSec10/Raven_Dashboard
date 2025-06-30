"use client"
import * as React from "react"

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

interface TabsContextValue {
  value?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component')
  }
  return context
}

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
  children?: React.ReactNode
}

function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '')
  
  const value = controlledValue !== undefined ? controlledValue : internalValue
  
  const handleValueChange = React.useCallback((newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }, [controlledValue, onValueChange])

  const contextValue = React.useMemo(() => ({
    value,
    onValueChange: handleValueChange,
    orientation
  }), [value, handleValueChange, orientation])

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        data-slot="tabs"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  className?: string
  children?: React.ReactNode
}

function TabsList({
  className,
  children,
  ...props
}: TabsListProps) {
  const { orientation } = useTabsContext()
  const listRef = React.useRef<HTMLDivElement>(null)

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const triggers = listRef.current?.querySelectorAll('[role="tab"]') as NodeListOf<HTMLElement>
    if (!triggers.length) return

    const currentIndex = Array.from(triggers).findIndex(trigger => 
      trigger === document.activeElement
    )

    let nextIndex = currentIndex

    switch (event.key) {
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          event.preventDefault()
          nextIndex = currentIndex + 1 >= triggers.length ? 0 : currentIndex + 1
        }
        break
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          event.preventDefault()
          nextIndex = currentIndex - 1 < 0 ? triggers.length - 1 : currentIndex - 1
        }
        break
      case 'ArrowDown':
        if (orientation === 'vertical') {
          event.preventDefault()
          nextIndex = currentIndex + 1 >= triggers.length ? 0 : currentIndex + 1
        }
        break
      case 'ArrowUp':
        if (orientation === 'vertical') {
          event.preventDefault()
          nextIndex = currentIndex - 1 < 0 ? triggers.length - 1 : currentIndex - 1
        }
        break
      case 'Home':
        event.preventDefault()
        nextIndex = 0
        break
      case 'End':
        event.preventDefault()
        nextIndex = triggers.length - 1
        break
    }

    if (nextIndex !== currentIndex) {
      triggers[nextIndex]?.focus()
      triggers[nextIndex]?.click()
    }
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

function TabsTrigger({
  value: triggerValue,
  disabled = false,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const { value, onValueChange } = useTabsContext()
  const isActive = value === triggerValue

  const handleClick = () => {
    if (!disabled) {
      onValueChange?.(triggerValue)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={`tabpanel-${triggerValue}`}
      id={`tab-${triggerValue}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      data-state={isActive ? 'active' : 'inactive'}
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  forceMount?: boolean
  className?: string
  children?: React.ReactNode
}

function TabsContent({
  value: contentValue,
  forceMount = false,
  className,
  children,
  ...props
}: TabsContentProps) {
  const { value } = useTabsContext()
  const isActive = value === contentValue

  if (!forceMount && !isActive) {
    return null
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${contentValue}`}
      aria-labelledby={`tab-${contentValue}`}
      hidden={!isActive}
      tabIndex={0}
      data-state={isActive ? 'active' : 'inactive'}
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }