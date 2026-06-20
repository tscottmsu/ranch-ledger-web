export type AuthFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<"email" | "password" | "firstName" | "lastName", string>>;
};

export const initialAuthFormState: AuthFormState = { status: "idle" };
