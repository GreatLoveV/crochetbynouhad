/**
 * Shape of the checkout form's action state.
 *
 * This lives OUTSIDE `src/app/actions/orders.ts` on purpose: a `"use server"`
 * file may only export async functions, so the empty initial state object has
 * to live in a plain module. Importing it from the action file would make Next
 * reject the whole server-action manifest (and with it every other action).
 */
export type OrderFormState = {
  status: "idle" | "invalid" | "error";
  /** One message per field, keyed by input name, ready to render. */
  fieldErrors?: Record<string, string>;
  message?: string;
  /** Echoed back so a failed submit never wipes what the customer typed. */
  values?: {
    name: string;
    phone: string;
    city: string;
    address: string;
    notes: string;
  };
};

export const emptyOrderFormState: OrderFormState = { status: "idle" };
