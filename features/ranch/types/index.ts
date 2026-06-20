export type Ranch = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  address_line_1: string | null;
  timezone: string;
};

export type RanchFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "phone" | "email" | "address" | "timezone", string>>;
};

export const initialRanchFormState: RanchFormState = { status: "idle" };
