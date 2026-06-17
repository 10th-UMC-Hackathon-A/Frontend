export type Size = 'sm' | 'md' | 'lg';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface BaseComponentProps {
  className?: string;
}

export interface BaseInputProps extends BaseComponentProps {
  disabled?: boolean;
  placeholder?: string;
}
