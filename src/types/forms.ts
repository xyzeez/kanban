export interface RegisterFormInputs {
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginFormInputs {
  email: string;
  password: string;
  remember: boolean;
}

export interface BoardFormProps {
  toEdit?: boolean;
}

export interface BoardFormInputs {
  name: string;
  columns: { title: string }[];
}
