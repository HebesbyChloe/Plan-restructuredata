/**
 * Form Types
 * Panel and form-related type definitions
 */

// Base panel props (used by all create/edit panels)
export interface BasePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Edit panel props
export interface EditPanelProps<T = any> extends BasePanelProps {
  data?: T;
  mode?: 'create' | 'edit';
}

// Form field error
export interface FieldError {
  field: string;
  message: string;
}

// Form validation result
export interface ValidationResult {
  isValid: boolean;
  errors: FieldError[];
}

// Form state
export interface FormState<T = any> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isDirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
}

// Upload file type
export interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  preview?: string;
  uploadProgress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
}

// Address type (used in orders, shipping, etc.)
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
}

// Contact info
export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}
