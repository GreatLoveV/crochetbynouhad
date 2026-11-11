/**
 * Result of a small admin action used with `useActionState`: a success line
 * or an error line, never both.
 *
 * Lives outside the `"use server"` files, which may only export async
 * functions.
 */
export type ActionMessage = { ok?: string; error?: string };

export const emptyActionMessage: ActionMessage = {};
