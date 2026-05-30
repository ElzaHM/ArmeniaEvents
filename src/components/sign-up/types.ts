export interface SignUpFormValues {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agree?: boolean;
}

export type PasswordStrength = 'Weak' | 'Medium' | 'Strong' | 'Very Strong';