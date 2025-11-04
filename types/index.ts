// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// API Response types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface ApiSuccess<T = unknown> {
  data: T;
  message?: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | { error: ApiError };

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}
