'use client';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface CustomFormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export function CustomFormField({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  className,
  required = false,
  disabled = false,
}: CustomFormFieldProps) {
  const fieldId = React.useId();

  return (
    <div className={cn('grid gap-2', className)}>
      <Label 
        htmlFor={fieldId}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          error && 'text-destructive'
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <Input
        id={fieldId}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          error && 'border-destructive focus:border-destructive focus:ring-destructive'
        )}
        {...register(name)}
      />
      
      {error && (
        <p className="text-sm font-medium text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}

// Optional: Extended version with more features
interface CustomFormFieldAdvancedProps extends CustomFormFieldProps {
  description?: string;
  helperText?: string;
}

export function CustomFormFieldAdvanced({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  description,
  helperText,
  className,
  required = false,
  disabled = false,
}: CustomFormFieldAdvancedProps) {
  const fieldId = React.useId();
  const descriptionId = `${fieldId}-description`;
  const helperTextId = `${fieldId}-helper`;

  return (
    <div className={cn('grid gap-2', className)}>
      <Label 
        htmlFor={fieldId}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          error && 'text-destructive'
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {description && (
        <p 
          id={descriptionId}
          className="text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}
      
      <Input
        id={fieldId}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-describedby={
          description || helperText 
            ? `${description ? descriptionId : ''} ${helperText ? helperTextId : ''}`.trim()
            : undefined
        }
        aria-invalid={!!error}
        className={cn(
          error && 'border-destructive focus:border-destructive focus:ring-destructive'
        )}
        {...register(name)}
      />
      
      {error && (
        <p className="text-sm font-medium text-destructive">
          {error.message}
        </p>
      )}
      
      {helperText && !error && (
        <p 
          id={helperTextId}
          className="text-sm text-muted-foreground"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}