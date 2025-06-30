"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string
  onLoadingStatusChange?: (status: 'loading' | 'loaded' | 'error') => void
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  delayMs?: number
}

// Avatar Root Component
function Avatar({ className, ...props }: AvatarProps) {
  const [imageLoadingStatus, setImageLoadingStatus] = React.useState<'loading' | 'loaded' | 'error'>('loading')
  
  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <AvatarContext.Provider value={{ imageLoadingStatus, setImageLoadingStatus }}>
        {props.children}
      </AvatarContext.Provider>
    </div>
  )
}

// Context for sharing image loading state
const AvatarContext = React.createContext<{
  imageLoadingStatus: 'loading' | 'loaded' | 'error'
  setImageLoadingStatus: (status: 'loading' | 'loaded' | 'error') => void
} | null>(null)

function useAvatarContext() {
  const context = React.useContext(AvatarContext)
  if (!context) {
    throw new Error('Avatar components must be used within Avatar')
  }
  return context
}

// Avatar Image Component
function AvatarImage({ 
  className, 
  onLoadingStatusChange, 
  onLoad,
  onError,
  ...props 
}: AvatarImageProps) {
  const { imageLoadingStatus, setImageLoadingStatus } = useAvatarContext()
  const [isLoaded, setIsLoaded] = React.useState(false)
  
  const handleLoad = React.useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoadingStatus('loaded')
    setIsLoaded(true)
    onLoadingStatusChange?.('loaded')
    onLoad?.(event)
  }, [setImageLoadingStatus, onLoadingStatusChange, onLoad])
  
  const handleError = React.useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoadingStatus('error')
    onLoadingStatusChange?.('error')
    onError?.(event)
  }, [setImageLoadingStatus, onLoadingStatusChange, onError])
  
  const handleLoadStart = React.useCallback(() => {
    setImageLoadingStatus('loading')
    setIsLoaded(false)
    onLoadingStatusChange?.('loading')
  }, [setImageLoadingStatus, onLoadingStatusChange])
  
  React.useEffect(() => {
    if (props.src) {
      setImageLoadingStatus('loading')
      setIsLoaded(false)
    }
  }, [props.src, setImageLoadingStatus])
  
  return (
    <img
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full object-cover",
        imageLoadingStatus === 'loaded' ? 'block' : 'hidden',
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
      onLoadStart={handleLoadStart}
      {...props}
    />
  )
}

// Avatar Fallback Component
function AvatarFallback({ 
  className, 
  delayMs = 0,
  children,
  ...props 
}: AvatarFallbackProps) {
  const { imageLoadingStatus } = useAvatarContext()
  const [canRender, setCanRender] = React.useState(delayMs === 0)
  
  React.useEffect(() => {
    if (delayMs > 0) {
      const timer = setTimeout(() => setCanRender(true), delayMs)
      return () => clearTimeout(timer)
    }
  }, [delayMs])
  
  const shouldShow = canRender && (imageLoadingStatus === 'loading' || imageLoadingStatus === 'error')
  
  if (!shouldShow) {
    return null
  }
  
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full text-sm font-medium",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Avatar, AvatarImage, AvatarFallback }